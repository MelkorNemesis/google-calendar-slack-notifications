/* eslint-disable prefer-rest-params */

import { KnownBlock } from "@slack/web-api";
import { client } from "./client";
import moment from "moment";

function schedule({
  channel,
  blocks,
  text,
  postAt,
}: {
  channel: string;
  blocks: KnownBlock[];
  text: string;
  postAt: moment.Moment;
}) {
  return client.chat.scheduleMessage({
    channel,
    blocks,
    text,
    post_at: postAt.unix(),
  });
}

function post({
  channel,
  blocks,
  text,
}: {
  channel: string;
  blocks: KnownBlock[];
  text: string;
}) {
  return client.chat.postMessage({ channel, blocks, text });
}

export function sendMessage({
  channels,
  text,
  blocks,
  postAt,
}: {
  channels: string[];
  text: string;
  blocks: KnownBlock[];
  postAt: moment.Moment | null;
}) {
  return Promise.all(
    channels.map((channel) => {
      return postAt
        ? schedule({ channel, blocks, text, postAt })
        : post({ channel, blocks, text });
    })
  );
}

export async function getScheduledMessages() {
  const result = await client.chat.scheduledMessages.list();
  return result.scheduled_messages;
}

export async function deleteAllScheduledMessages() {
  const scheduledMessages = await getScheduledMessages();

  return Promise.all(
    scheduledMessages.map((scheduledMessage) =>
      client.chat.deleteScheduledMessage({
        scheduled_message_id: scheduledMessage.id,
        channel: scheduledMessage.channel_id,
      })
    )
  );
}

import { calendar_v3 } from "googleapis";
import * as slack from "./slack";
import * as google from "./google";
import { KnownBlock } from "@slack/web-api";
import moment from "moment";

function getEventCommunityChannels(event: calendar_v3.Schema$Event) {
  const regex = /(#community-\w+)/g;
  const matches = event.description?.match(regex) || [];
  return matches.map((match) => match.trim());
}

function getMeetingLink(event: calendar_v3.Schema$Event) {
  const entryPoints = event.conferenceData?.entryPoints || [];
  const videoEntryPoint = entryPoints.find(
    (entryPoint) => entryPoint.entryPointType === "video"
  );
  return videoEntryPoint?.uri;
}

function formatSlackBlocks({
  event,
  startInMinutes,
}: {
  event: calendar_v3.Schema$Event;
  startInMinutes: number;
}): KnownBlock[] {
  return [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Hey @channel! A *${event.summary}* meeting is starting in ${startInMinutes} minutes.`,
      },
    },
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `💻 Join the meeting: ${
          getMeetingLink(event) ?? "No link found"
        }`,
      },
    },
  ];
}

const MINUTES_BEFORE_EVENT_TO_ALERT = 15;

function getEventStartDate(event: calendar_v3.Schema$Event) {
  return moment(google.getEventStartDate(event));
}

function getAlertAt(eventStartDate: moment.Moment) {
  return eventStartDate
    .clone()
    .subtract(MINUTES_BEFORE_EVENT_TO_ALERT, "minutes");
}

function getStartInMinutes(
  postAt: moment.Moment,
  eventStartDate: moment.Moment,
  now: moment.Moment
) {
  return postAt
    ? eventStartDate.diff(postAt, "minutes")
    : eventStartDate.diff(now, "minutes");
}

function getMessageScheduledTime(
  eventStartDate: moment.Moment,
  now: moment.Moment
) {
  const alertAt = getAlertAt(eventStartDate);
  return now.isAfter(alertAt) ? null : alertAt;
}

export async function handleEvent(event: calendar_v3.Schema$Event) {
  const now = moment();
  const eventStartDate = getEventStartDate(event);
  const scheduledAt = getMessageScheduledTime(eventStartDate, now);
  const startInMinutes = getStartInMinutes(scheduledAt, eventStartDate, now);

  const channels = getEventCommunityChannels(event);
  const blocks = formatSlackBlocks({ event, startInMinutes });
  const text = `Upcoming event: ${event.summary} in ${startInMinutes} minutes`;

  await slack.sendMessage({ channels, blocks, text, scheduledAt });
}

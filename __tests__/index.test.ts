// import axios from "axios";
import { run } from "../src/index";
import { client } from "../src/slack/client";
import { calendar } from "../src/google/client";

import communityEventStub from "./stubs/community-event.json";
import nonCommunityEventStub from "./stubs/non-community-event.json";

jest.mock("../src/slack/client");
jest.mock("../src/google/client");

const mockedSlackClient = jest.mocked(client);
const mockedCalendarClient = jest.mocked(calendar);

describe("Calendar", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test("does not delete scheduled messages if there are none", async () => {
    mockedSlackClient.chat.scheduledMessages.list.mockResolvedValue({
      scheduled_messages: [],
      ok: true,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockedCalendarClient.events.list.mockResolvedValue({ data: { items: [] } });

    await run();

    expect(
      mockedSlackClient.chat.deleteScheduledMessage
    ).not.toHaveBeenCalled();
  });

  test("deletes scheduled messages", async () => {
    mockedSlackClient.chat.scheduledMessages.list.mockResolvedValue({
      scheduled_messages: [
        {
          id: "123",
          channel_id: "C123",
          text: "Scheduled message",
          post_at: 1234567890,
          date_created: 1234567890,
        },
      ],
      ok: true,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockedCalendarClient.events.list.mockResolvedValue({ data: { items: [] } });

    await run();

    expect(mockedSlackClient.chat.deleteScheduledMessage).toHaveBeenCalledWith({
      channel: "C123",
      scheduled_message_id: "123",
    });

    expect(mockedSlackClient.chat.deleteScheduledMessage).toHaveBeenCalledTimes(
      1
    );
  });

  test("does not schedule a slack message if the event is not a community event", async () => {
    mockedSlackClient.chat.scheduledMessages.list.mockResolvedValue({
      scheduled_messages: [],
      ok: true,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockedCalendarClient.events.list.mockResolvedValue({
      data: { items: [nonCommunityEventStub] },
    });

    await run();

    expect(mockedSlackClient.chat.scheduleMessage).not.toHaveBeenCalled();
    expect(mockedSlackClient.chat.postMessage).not.toHaveBeenCalled();
  });

  test("schedules a slack message", async () => {
    const thirtyMinutesBeforeEventStart = new Date('2023-03-03T05:15:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(thirtyMinutesBeforeEventStart);

    mockedSlackClient.chat.scheduledMessages.list.mockResolvedValue({
      scheduled_messages: [],
      ok: true,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockedCalendarClient.events.list.mockResolvedValue({
      data: { items: [communityEventStub] },
    });

    await run();

    expect(mockedSlackClient.chat.scheduleMessage).toHaveBeenNthCalledWith(1, {
      blocks: [
        {
          text: {
            text: "Hey @channel! A *Community Event* meeting is starting in 15 minutes.",
            type: "mrkdwn",
          },
          type: "section",
        },
        {
          text: {
            text: "💻 Join the meeting: https://nearform.zoom.us/j/86409061489?pwd=Q2VycTJ3ZjRidlFsd2d6QkxpeXFNQT09",
            type: "mrkdwn",
          },
          type: "section",
        },
      ],
      channel: "#community-dev",
      post_at: 1677821400,
      text: "Upcoming event: Community Event in 15 minutes",
    });

    expect(mockedSlackClient.chat.scheduleMessage).toHaveBeenNthCalledWith(2, {
      blocks: [
        {
          text: {
            text: "Hey @channel! A *Community Event* meeting is starting in 15 minutes.",
            type: "mrkdwn",
          },
          type: "section",
        },
        {
          text: {
            text: "💻 Join the meeting: https://nearform.zoom.us/j/86409061489?pwd=Q2VycTJ3ZjRidlFsd2d6QkxpeXFNQT09",
            type: "mrkdwn",
          },
          type: "section",
        },
      ],
      channel: "#community-test",
      post_at: 1677821400,
      text: "Upcoming event: Community Event in 15 minutes",
    })

    jest.useRealTimers();
  });

  test("posts a slack message immediately", async () => {
    const fiveMinutesBeforeEventStart = new Date('2023-03-03T05:40:00Z');
    jest.useFakeTimers();
    jest.setSystemTime(fiveMinutesBeforeEventStart);

    mockedSlackClient.chat.scheduledMessages.list.mockResolvedValue({
      scheduled_messages: [],
      ok: true,
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    mockedCalendarClient.events.list.mockResolvedValue({
      data: { items: [communityEventStub] },
    });

    await run();

    expect(mockedSlackClient.chat.postMessage).toHaveBeenNthCalledWith(1, {
      blocks: [
        {
          text: {
            text: "Hey @channel! A *Community Event* meeting is starting in 5 minutes.",
            type: "mrkdwn",
          },
          type: "section",
        },
        {
          text: {
            text: "💻 Join the meeting: https://nearform.zoom.us/j/86409061489?pwd=Q2VycTJ3ZjRidlFsd2d6QkxpeXFNQT09",
            type: "mrkdwn",
          },
          type: "section",
        },
      ],
      channel: "#community-dev",
      text: "Upcoming event: Community Event in 5 minutes",
    });

    expect(mockedSlackClient.chat.postMessage).toHaveBeenNthCalledWith(2, {
      blocks: [
        {
          text: {
            text: "Hey @channel! A *Community Event* meeting is starting in 5 minutes.",
            type: "mrkdwn",
          },
          type: "section",
        },
        {
          text: {
            text: "💻 Join the meeting: https://nearform.zoom.us/j/86409061489?pwd=Q2VycTJ3ZjRidlFsd2d6QkxpeXFNQT09",
            type: "mrkdwn",
          },
          type: "section",
        },
      ],
      channel: "#community-test",
      text: "Upcoming event: Community Event in 5 minutes",
    })

    jest.useRealTimers();
  })
});

// import axios from "axios";
import { run } from "../src/index";
import { client } from "../src/slack/client";
import { calendar } from "../src/google/client";

jest.mock("../src/slack/client");
jest.mock("../src/google/client");

const mockedSlackClient = jest.mocked(client);
const mockedCalendarClient = jest.mocked(calendar);

describe("Calendar", () => {
  beforeEach(() => {
    process.env.SLACK_TOKEN = "token";
    process.env.CALENDAR_ID = "calendar_id";
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("does not delete scheduled messages if there are none", async () => {
    mockedSlackClient.chat.scheduledMessages.list.mockResolvedValue({
      scheduled_messages: [],
      ok: true,
    });

    mockedCalendarClient.events.list.mockResolvedValue();

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

    await run();

    expect(mockedSlackClient.chat.deleteScheduledMessage).toHaveBeenCalledWith({
      channel: "C123",
      scheduled_message_id: "123",
    });

    expect(mockedSlackClient.chat.deleteScheduledMessage).toHaveBeenCalledTimes(
      1
    );
  });
});

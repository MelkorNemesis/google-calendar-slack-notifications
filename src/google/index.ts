import { calendar_v3 } from "googleapis";
import moment from "moment";
import { calendar, calendarId } from "./client";

export function getEventStartDate(event: calendar_v3.Schema$Event): Date {
  return new Date(event.start.dateTime || event.start.date);
}

export const getFutureEvents = async () => {
  const timeMin = moment().utc().format();
  const timeMax = moment().add(8, "hours").utc().format();

  const res = await calendar.events.list({
    calendarId,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: "startTime",
  });

  const nowUtc = moment().utc();

  return res.data.items.filter(
    (event) =>
      moment(event.start.dateTime).utc().isAfter(nowUtc) &&
      moment(event.end.dateTime).utc().isAfter(nowUtc)
  );
};

import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "./credentials.json",
  scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
});

export const calendar = google.calendar({ version: "v3", auth });

export const calendarId = process.env.CALENDAR_ID;

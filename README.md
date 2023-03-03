# google-calendar-slack-notifications

## Description

A lambda created to run every hour, to notify the correct community channel based on the description that the calendar event has.

## Background Setup

- Ensure you have Google Calendar API enabled in the Google Developer Console.
- Ensure that you have setup a `service_account` in the Google Developer Console that has the ability to view the CalendarAPI.
  - Make sure you have copied the `JSON` for the account details into `credentials.json` file in the root of this project.
- Ensure that you have setup a `Google Calendar` that has the correct events.
  - Make sure you have copied the `Calendar ID` into the `CALENDAR_ID` environment variable in the `.env` file.
- Ensure that you have enabled Google Calendar API in the Google Developer Console.
- Ensure that you have added the `service_account` to the Google Calendar as a `Reader`.
- Ensure that you have setup a `Slack App` that has the ability to post to the correct channel.
  - Make sure you have copied the `OAuth Access Token` into the `SLACK_TOKEN` environment variable in the `.env` file.

## Setup

1. Run `npm i` to install the dependencies

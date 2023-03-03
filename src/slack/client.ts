import { WebClient } from "@slack/web-api";

export const client = new WebClient(process.env.SLACK_TOKEN);

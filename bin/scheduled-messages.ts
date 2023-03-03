import * as dotenv from "dotenv";
dotenv.config();

import * as slack from "../src/slack";

async function main() {
  const scheduledMessages = await slack.getScheduledMessages();
  console.log("🐞", { scheduledMessages });
}

main();

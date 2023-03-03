import * as dotenv from "dotenv";
dotenv.config();

import * as google from "./google";
import * as slack from "./slack";
import * as lib from "./lib";

export const run = async () => {
  await slack.deleteAllScheduledMessages();
  const events = await google.getFutureEvents();
  await Promise.all(events.map(lib.handleEvent));
};

if (require.main === module) {
  run().catch((error) => {
    console.error(`🔴 Error running the script:`, error);
  });
}

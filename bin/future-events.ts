import * as dotenv from "dotenv";
dotenv.config();
import { getFutureEvents } from "../src/google";

async function main() {
  const events = await getFutureEvents();
  console.log("🐞", JSON.stringify(events, null, 2));
}

main();

// src/index.ts
import dotenv from "dotenv";
import { MessagesLogger } from "./logger";
import { listenToMessages } from "./server";

dotenv.config();

const homeserverUrl = process.env.HOMESERVER_URL || "";
const accessToken = process.env.ACCESS_TOKEN || "";
const userId = process.env.USER_ID || "";
const roomIds = process.env.ROOM_IDS?.split(";") || [];
const postgresUrl = process.env.POSTGRES_URL || "";

if (
  !homeserverUrl ||
  !accessToken ||
  !userId ||
  !roomIds.length ||
  !postgresUrl
) {
  throw new Error("No .env");
}

async function main() {
  const logger = new MessagesLogger(roomIds);
  await listenToMessages(homeserverUrl, accessToken, userId, logger);
}
console.log("Starting...");

main().catch((err) => {
  console.error("Error:", err);
});

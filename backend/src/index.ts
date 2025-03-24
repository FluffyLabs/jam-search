// src/index.ts
import dotenv from "dotenv";
import { MessagesLogger } from "./logger";
import { listenToMessages } from "./server";

dotenv.config();

const homeserverUrl = process.env.HOMESERVER_URL || "";
const accessToken = process.env.ACCESS_TOKEN || "";
const userId = process.env.USER_ID || "";
const roomId = process.env.ROOM_ID || "";
const searchEndpoint = process.env.SEARCH_ENDPOINT || "";
const indexName = process.env.INDEX_NAME || "";
const apiKey = process.env.API_KEY || "";

if (
  !homeserverUrl ||
  !accessToken ||
  !userId ||
  !roomId ||
  !searchEndpoint ||
  !indexName ||
  !apiKey
) {
  throw new Error("No .env");
}

async function main() {
  const logger = new MessagesLogger(roomId, searchEndpoint, indexName, apiKey);
  await listenToMessages(homeserverUrl, accessToken, userId, roomId, logger);
}

main().catch((err) => {
  console.error("Error:", err);
});

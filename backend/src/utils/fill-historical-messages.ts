import dotenv from "dotenv";
import { MessagesLogger } from "../services/logger.js";
import { db } from "../db/db.js";

dotenv.config();

const homeserverUrl = process.env.HOMESERVER_URL || "";
const accessToken = process.env.ACCESS_TOKEN || "";
const userId = process.env.USER_ID || "";
const roomIds = process.env.ROOM_IDS?.split(";") || [];

export async function fetchAndInsertHistoricalMessages(
  roomIds: string[],
  daysBack: number = 30
) {
  const { ClientEvent, createClient } = await import("matrix-js-sdk");

  if (!homeserverUrl || !accessToken || !userId) {
    throw new Error("Missing required environment variables");
  }

  const client = createClient({
    baseUrl: homeserverUrl,
    accessToken: accessToken,
    userId: userId,
  });

  // Start the client
  await client.startClient({ initialSyncLimit: 100 });

  // Wait for the client to be ready
  await new Promise<void>((resolve) => {
    client.once(ClientEvent.Sync, (state: string) => {
      if (state === "PREPARED") {
        console.log("Client is ready and synced!");
        resolve();
      }
    });
  });

  const logger = new MessagesLogger({ roomIds, db });
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - daysBack);

  for (const roomId of roomIds) {
    try {
      console.log(`Fetching messages for room ${roomId}`);

      const room = client.getRoom(roomId);
      if (!room) {
        console.error(`Room ${roomId} not found`);
        continue;
      }

      // Get room timeline
      const timeline = await room.getLiveTimeline();
      const events = timeline.getEvents();
      console.log("EVENTS", events.length);
      const messages = [];
      for (const event of events) {
        if (event.getType() === "m.room.message") {
          const content = event.getContent();
          const messageContent = content.body;

          if (typeof messageContent === "string") {
            const sender = event.getSender();
            const eventId = event.getId();
            const timestamp = event.getDate();

            if (eventId && timestamp && timestamp >= daysAgo) {
              try {
                messages.push({
                  roomId,
                  msg: messageContent,
                  sender,
                  eventId,
                  date: timestamp,
                });
              } catch (error) {
                console.error(`Error processing message ${eventId}:`, error);
              }
            }
          }
        }
      }

      await logger.onMessages(messages);
    } catch (error) {
      console.error(`Error processing room ${roomId}:`, error);
    }
  }

  // Stop the client
  client.stopClient();
}

// Example usage:
fetchAndInsertHistoricalMessages(roomIds, 100);

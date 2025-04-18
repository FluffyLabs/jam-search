import { MessagesLogger } from "../services/logger.js";
import { db } from "../db/db.js";
import { env } from "../env.js";

export async function fetchAndInsertHistoricalMessages(
  roomIds: string[],
  daysBack: number = 30
) {
  const { ClientEvent, createClient } = await import("matrix-js-sdk");

  const client = createClient({
    baseUrl: env.HOMESERVER_URL,
    accessToken: env.ACCESS_TOKEN,
    userId: env.USER_ID,
  });

  const logger = new MessagesLogger({ roomIds, db });
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - daysBack);

  for (const roomId of roomIds) {
    // Start the client
    await client.startClient({ initialSyncLimit: 1000 });

    // Wait for the client to be ready
    await new Promise<void>((resolve) => {
      client.once(ClientEvent.Sync, (state: string) => {
        if (state === "PREPARED") {
          console.log("Client is ready and synced!");
          resolve();
        }
      });
    });

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
      console.log("Adding messages", roomId, messages.length);
      await logger.onMessages(messages);
    } catch (error) {
      console.error(`Error processing room ${roomId}:`, error);
    }

    // Stop the client
    client.stopClient();
  }
}

// Example usage:
fetchAndInsertHistoricalMessages(env.ROOM_IDS, 200).finally(() => {
  process.exit(0);
});

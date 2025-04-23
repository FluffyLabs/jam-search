import { db } from "../db/db.js";
import { env } from "../env.js";
import { MessagesLogger } from "../services/logger.js";
import { MatrixService } from "../services/matrix.js";
import { Direction } from "matrix-js-sdk";

export async function fetchAndInsertHistoricalMessages(
  roomIds: string[],
  daysBack = 30
) {
  const logger = new MessagesLogger({ roomIds, db });
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - daysBack);

  // Create Matrix service with automatic token refresh
  const matrixService = new MatrixService(
    env.HOMESERVER_URL,
    env.ACCESS_TOKEN,
    env.USER_ID,
    logger
  );

  // Start client with token refresh capability
  const client = await matrixService.start();

  try {
    for (const roomId of roomIds) {
      try {
        console.log(`Fetching messages for room ${roomId}`);

        const room = client.getRoom(roomId);
        if (!room) {
          console.error(`Room ${roomId} not found`);
          continue;
        }

        // Get messages directly from the Matrix API
        const messagesLimit = 1000; // Increase this number to fetch more messages
        const messagesResponse = await client.createMessagesRequest(
          roomId,
          "", // from token (empty to start from latest)
          messagesLimit,
          Direction.Backward // backwards direction to get historical messages
        );

        if (!messagesResponse || !messagesResponse.chunk) {
          console.log(`No messages found for room ${roomId}`);
          continue;
        }

        const events = messagesResponse.chunk;
        console.log("EVENTS", events.length);

        const messages = [];
        for (const event of events) {
          if (event.type === "m.room.message") {
            const content = event.content;
            const messageContent = content.body;

            if (typeof messageContent === "string") {
              const sender = event.sender;
              const eventId = event.event_id;
              const timestamp = new Date(event.origin_server_ts);

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
        console.log(
          JSON.stringify(messages[0], null, 2),
          JSON.stringify(messages[messages.length - 1], null, 2)
        );
        // await logger.onMessages(messages);
      } catch (error) {
        console.error(`Error processing room ${roomId}:`, error);
      }
    }
  } finally {
    // Stop the client
    await matrixService.stop();
  }
}

// Example usage:
fetchAndInsertHistoricalMessages(env.ROOM_IDS, 200).finally(() => {
  process.exit(0);
});

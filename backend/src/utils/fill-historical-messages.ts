import { db } from "../db/db.js";
import { env } from "../env.js";
import { MessagesLogger } from "../services/logger.js";
import { MatrixService } from "../services/matrix.js";

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
    env.ACCESS_TOKEN, // Optional now
    env.USER_ID,
    logger,
    env.MATRIX_USERNAME,
    env.MATRIX_PASSWORD
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

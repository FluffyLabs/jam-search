import { db } from "../db/db.js";
import { env } from "../env.js";
import { MessagesLogger } from "../services/logger.js";
import { MatrixService } from "../services/matrix.js";
import { Direction } from "matrix-js-sdk";

// Define message type to avoid implicit any[]
interface Message {
  roomId: string;
  msg: string;
  sender: string;
  eventId: string;
  date: Date;
}

export async function fetchAndInsertHistoricalMessages(
  roomIds: string[],
  daysBack = 30,
  maxMessagesPerRoom = 3000 // Set maximum number of messages to fetch per room
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

        // Implement pagination to fetch more than 1000 messages
        const batchSize = 1000; // Maximum per API request
        let fromToken = ""; // Start with empty token (latest messages)
        let totalFetched = 0;
        let allMessages: Message[] = [];
        let shouldContinue = true;

        // Fetch messages in batches using pagination
        while (shouldContinue && totalFetched < maxMessagesPerRoom) {
          console.log(
            `Fetching batch from token: ${
              fromToken || "latest"
            }, total so far: ${totalFetched}`
          );

          const messagesResponse = await client.createMessagesRequest(
            roomId,
            fromToken,
            batchSize,
            Direction.Backward
          );

          if (
            !messagesResponse ||
            !messagesResponse.chunk ||
            messagesResponse.chunk.length === 0
          ) {
            console.log(`No more messages found for room ${roomId}`);
            break;
          }

          const events = messagesResponse.chunk;
          console.log(`Received ${events.length} events in this batch`);

          // Process messages from this batch
          const batchMessages: Message[] = [];
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
                    batchMessages.push({
                      roomId,
                      msg: messageContent,
                      sender,
                      eventId,
                      date: timestamp,
                    });
                  } catch (error) {
                    console.error(
                      `Error processing message ${eventId}:`,
                      error
                    );
                  }
                } else if (timestamp < daysAgo) {
                  // We've reached messages older than our cutoff date
                  shouldContinue = false;
                }
              }
            }
          }

          // Add this batch to our collection
          allMessages = [...allMessages, ...batchMessages];
          totalFetched += events.length;

          // Check if we have an end token for the next batch
          if (messagesResponse.end) {
            fromToken = messagesResponse.end;
          } else {
            console.log("No pagination token returned, reached end of history");
            break;
          }

          // If we got fewer messages than requested, we've reached the end
          if (events.length < batchSize) {
            console.log(
              "Received fewer messages than requested, reached end of history"
            );
            break;
          }
        }

        console.log(
          `Total messages collected: ${allMessages.length} from ${totalFetched} events`
        );

        if (allMessages.length > 0) {
          console.log(
            JSON.stringify(allMessages[0], null, 2),
            JSON.stringify(allMessages[allMessages.length - 1], null, 2)
          );
          // await logger.onMessages(allMessages);
        } else {
          console.log("No matching messages found");
        }
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
fetchAndInsertHistoricalMessages(env.ROOM_IDS, 200, 10000).finally(() => {
  process.exit(0);
});

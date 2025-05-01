import { db } from "../db/db.js";
import { env } from "../env.js";
import { MessagesLogger } from "../services/logger.js";
import { fetchArchivedMessages } from "../services/archiveService.js";
import { format, subDays } from "date-fns";

export async function fetchAndInsertHistoricalMessages(daysBack = 30) {
  // Extract just the room IDs for the MessagesLogger
  const roomIds = env.ROOM_IDS.map((room) => room.id);
  const logger = new MessagesLogger({ roomIds, db });

  // Calculate from and to dates based on days back and format as strings
  const today = new Date();
  const pastDate = subDays(today, daysBack);

  const toDateString = format(today, "yyyy-MM-dd");
  const fromDateString = format(pastDate, "yyyy-MM-dd");

  console.log(`Fetching messages from ${fromDateString} to ${toDateString}`);

  try {
    for (const room of env.ROOM_IDS) {
      console.log(`Fetching archived messages for room ${room.id}`);
      console.log(`Using archive URL: ${room.archiveUrl}`);

      // Fetch messages for the date range using string dates
      const messages = await fetchArchivedMessages(
        room.archiveUrl,
        room.id,
        fromDateString,
        toDateString
      );

      if (messages.length > 0) {
        console.log(`Found ${messages.length} messages for room ${room.id}`);
        // await logger.onMessages(messages);
        console.log(
          `Successfully inserted ${messages.length} messages for room ${room.id}`
        );
        console.log("First message:", messages[0]);
        console.log("Last message:", messages[messages.length - 1]);
      } else {
        console.log(
          `No messages found for room ${room.id} in the specified date range`
        );
      }
    }
  } catch (error) {
    console.error("Error fetching and inserting historical messages:", error);
  }
}

// Example usage:
// fetchAndInsertHistoricalMessages(30).finally(() => {
//   process.exit(0);
// });

// For running directly:
const daysBack = process.argv[2] ? parseInt(process.argv[2], 10) : 30;
fetchAndInsertHistoricalMessages(daysBack).finally(() => {
  process.exit(0);
});

import { isValid, parse } from "date-fns";
import { fetchArchivedMessages } from "../services/archive.js";
import { MessagesLogger } from "../services/logger.js";

type Room = {
  id: string;
  name: string;
  archiveUrl: string;
};

/**
 * Validates if a string is in the format yyyy-MM-dd
 * @param dateStr String to validate
 * @returns True if valid, false otherwise
 */
function isValidDateFormat(dateStr: string): boolean {
  // Regular expression for yyyy-MM-dd format
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateFormatRegex.test(dateStr)) {
    return false;
  }

  // Additional validation: check if it's a valid date
  const parsedDate = parse(dateStr, "yyyy-MM-dd", new Date());
  return isValid(parsedDate);
}

export async function fillArchivedMessages(
  dataDir: string,
  rooms: Room[],
  fromDate: string,
  toDate: string
) {
  // Validate date formats
  if (!isValidDateFormat(fromDate)) {
    throw new Error(
      `Invalid fromDate format: ${fromDate}. Expected format: yyyy-MM-dd`
    );
  }

  if (!isValidDateFormat(toDate)) {
    throw new Error(
      `Invalid toDate format: ${toDate}. Expected format: yyyy-MM-dd`
    );
  }

  console.log(`Fetching messages from ${fromDate} to ${toDate}`);

  const errors = [];
  for (const room of rooms) {
    try {
      console.log(`Fetching archived messages for room ${room.id}`);
      console.log(`Using archive URL: ${room.archiveUrl}`);

      const logger = new MessagesLogger(dataDir, room.name);

      // Fetch messages for the date range using string dates
      const messages = await fetchArchivedMessages(
        room.archiveUrl,
        room.id,
        fromDate,
        toDate
      );

      if (messages.length > 0) {
        console.log(`Found ${messages.length} messages for room ${room.id}`);
        await logger.onMessages(messages);
        console.log(
          `Successfully wrote ${messages.length} messages for room ${room.id}`
        );
        console.log("First message:", messages[0]);
        console.log("Last message:", messages[messages.length - 1]);
      } else {
        console.log(
          `No messages found for room ${room.id} in the specified date range`
        );
      }
    } catch (error) {
      console.error("Error fetching and writing messages:", error);
      errors.push(error);
    }
  }

  if (errors.length) {
    throw new AggregateError(
      errors,
      `Failed to fetch messages for ${errors.length} room(s)`
    );
  }
}

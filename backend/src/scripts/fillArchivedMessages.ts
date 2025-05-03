import { format, isValid, parse, subDays } from "date-fns";
import { db } from "../db/db.js";
import { fetchArchivedMessages } from "../services/archive.js";
import { MessagesLogger } from "../services/logger.js";

const ROOMS = [
  {
    id: "!ddsEwXlCWnreEGuqXZ:polkadot.io",
    archiveUrl:
      "https://paritytech.github.io/matrix-archiver/archive/_21ddsEwXlCWnreEGuqXZ_3Apolkadot.io/index.html",
  },
  {
    id: "!wBOJlzaOULZOALhaRh:polkadot.io",
    archiveUrl:
      "https://paritytech.github.io/matrix-archiver/archive/_21wBOJlzaOULZOALhaRh_3Apolkadot.io/index.html",
  },
];

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

export async function fillArchivedMessages(fromDate: string, toDate: string) {
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

  // Extract just the room IDs for the MessagesLogger
  const logger = new MessagesLogger({
    roomIds: ROOMS.map((room) => room.id),
    db,
  });

  console.log(`Fetching messages from ${fromDate} to ${toDate}`);

  try {
    for (const room of ROOMS) {
      console.log(`Fetching archived messages for room ${room.id}`);
      console.log(`Using archive URL: ${room.archiveUrl}`);

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

// For running directly:
if (process.argv.length >= 4) {
  // Case: From and To dates provided as arguments
  const fromDate = process.argv[2];
  const toDate = process.argv[3];
  fillArchivedMessages(fromDate, toDate).finally(() => {
    process.exit(0);
  });
} else {
  // Calculate dates based on daysBack or default to 1000 days
  const daysBack = process.argv[2]
    ? Number.parseInt(process.argv[2], 10)
    : 1000;
  const today = new Date();
  const pastDate = subDays(today, daysBack);

  const toDate = format(today, "yyyy-MM-dd");
  const fromDate = format(pastDate, "yyyy-MM-dd");

  console.log(`Using daysBack=${daysBack} to calculate date range`);
  fillArchivedMessages(fromDate, toDate).finally(() => {
    process.exit(0);
  });
}

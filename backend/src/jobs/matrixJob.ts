import { format, subDays } from "date-fns";
import * as matrix from "../../../shared/matrix.js";
import { fillArchivedMessages } from "../scripts/fillArchivedMessages.js";
import { findLatestIndexedDate } from "../scripts/latestIndexedDate.js";

const DATA_DIR = process.env.DATA_DIR || "./data";
// Minimum backfill window. Re-scanning is idempotent (writer dedupes by
// messageId), so we always look back at least this far to heal any older
// holes. The watermark extends the window further back when needed.
const MIN_BACKFILL_DAYS = 30;

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in matrix job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running matrix message fetch job at", new Date().toISOString());

  const yesterday = subDays(new Date(), 1);
  const toDate = format(yesterday, "yyyy-MM-dd");
  const defaultFrom = format(
    subDays(yesterday, MIN_BACKFILL_DAYS),
    "yyyy-MM-dd"
  );

  const errors: unknown[] = [];
  for (const room of matrix.ROOMS) {
    const latest = findLatestIndexedDate(DATA_DIR, room.name);
    // Always scan at least MIN_BACKFILL_DAYS (ISO dates compare lexicographically);
    // extend further back if the watermark is older than that window.
    const fromDate = latest && latest < defaultFrom ? latest : defaultFrom;

    console.log(
      `Backfilling ${room.name}: ${fromDate}..${toDate} (latest indexed: ${latest ?? "none"})`
    );

    try {
      await fillArchivedMessages(DATA_DIR, [room], fromDate, toDate);
    } catch (error) {
      console.error(`Error backfilling ${room.name}:`, error);
      // fillArchivedMessages wraps its own errors in AggregateError; unwrap
      // so CI logs show the root cause at one level, not two.
      if (error instanceof AggregateError) {
        errors.push(...error.errors);
      } else {
        errors.push(error);
      }
    }
  }

  if (errors.length) {
    throw new AggregateError(
      errors,
      `Matrix backfill failed for ${errors.length} room(s)`
    );
  }

  console.log("Message fetch job completed successfully");
}

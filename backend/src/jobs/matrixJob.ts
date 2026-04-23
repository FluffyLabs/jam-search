import { format, subDays } from "date-fns";
import * as matrix from "../../../shared/matrix.js";
import { fillArchivedMessages } from "../scripts/fillArchivedMessages.js";
import { findLatestIndexedDate } from "../scripts/latestIndexedDate.js";

const DATA_DIR = process.env.DATA_DIR || "./data";
// Fallback backfill window when a room has no indexed days yet. Bounds the
// work done for new/empty rooms; self-healing for outages up to ~a month.
const FALLBACK_BACKFILL_DAYS = 30;

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
  const fallbackFrom = format(
    subDays(yesterday, FALLBACK_BACKFILL_DAYS),
    "yyyy-MM-dd"
  );

  const errors: unknown[] = [];
  for (const room of matrix.ROOMS) {
    const latest = findLatestIndexedDate(DATA_DIR, room.name);
    // Start from the watermark day itself: the writer deduplicates by
    // messageId, so re-fetching it catches late-arriving messages safely.
    const fromDate = latest ?? fallbackFrom;

    if (fromDate > toDate) {
      console.log(
        `Skipping ${room.name}: latest indexed day ${fromDate} is after ${toDate}`
      );
      continue;
    }

    console.log(
      `Backfilling ${room.name}: ${fromDate}..${toDate}` +
        (latest ? ` (watermark)` : ` (fallback, no prior data)`)
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

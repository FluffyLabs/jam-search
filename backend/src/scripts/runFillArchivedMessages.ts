import { format, subDays } from "date-fns";
import { fillArchivedMessages } from "./fillArchivedMessages.js";

const N_DAYS = 1000;
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
    : N_DAYS;
  const today = new Date();
  const pastDate = subDays(today, daysBack);

  const toDate = format(today, "yyyy-MM-dd");
  const fromDate = format(pastDate, "yyyy-MM-dd");

  console.log(`Using daysBack=${daysBack} to calculate date range`);
  fillArchivedMessages(fromDate, toDate).finally(() => {
    process.exit(0);
  });
}

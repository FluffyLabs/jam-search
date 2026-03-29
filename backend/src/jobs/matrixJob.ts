import { format, subDays } from "date-fns";
import * as matrix from "../../../shared/matrix.js";
import { fillArchivedMessages } from "../scripts/fillArchivedMessages.js";

const DATA_DIR = process.env.DATA_DIR || "./data";

try {
  await main();
  process.exit(0);
} catch (error) {
  console.error("Error in matrix job:", error);
  process.exit(1);
}

async function main() {
  console.log("Running matrix message fetch job at", new Date().toISOString());
  try {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const yesterdayStr = format(yesterday, "yyyy-MM-dd");

    await fillArchivedMessages(
      DATA_DIR,
      matrix.ROOMS,
      yesterdayStr,
      yesterdayStr
    );
    console.log("Message fetch job completed successfully");
  } catch (error) {
    console.error("Error in message fetch job:", error);
  }
}

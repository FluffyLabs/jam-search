import { format, subDays } from "date-fns";
import { type Job, scheduleJob } from "node-schedule";
import { fillArchivedMessages } from "../scripts/fillArchivedMessages.js";
import { processBatchEmbeddings } from "../scripts/generateEmbeddingsBatch.js";

export function setupMatrixJob(): Job {
  return scheduleJob("0 4 * * *", async () => {
    console.log(
      "Running scheduled message fetch job at",
      new Date().toISOString()
    );
    try {
      const today = new Date();
      const yesterday = subDays(today, 1);
      const yesterdayStr = format(yesterday, "yyyy-MM-dd");

      await fillArchivedMessages(yesterdayStr, yesterdayStr);
      await processBatchEmbeddings();
      console.log("Message fetch job completed successfully");
    } catch (error) {
      console.error("Error in message fetch job:", error);
    }
  });
}

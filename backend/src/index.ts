import { serve } from "@hono/node-server";
import { format, subDays } from "date-fns";
import { type Job, scheduleJob } from "node-schedule";
import { createApp } from "./api.js";
import { env } from "./env.js";
import { fillArchivedMessages } from "./scripts/fillArchivedMessages.js";
import { updateGraypapers } from "./scripts/updateGraypapers.js";
import { processBatchEmbeddings } from "./scripts/generateEmbeddingsBatch.js";

const isDev = process.env.NODE_ENV === "development";
async function main() {
  let matrixJob: Job | null = null;
  let graypaperJob: Job | null = null;
  const app = createApp();

  if (!isDev) {
    // Schedule daily job to fetch messages from yesterday at 4:00 UTC
    // Immediately after https://github.com/paritytech/matrix-archiver/blob/master/.github/workflows/archive.yml#L10
    matrixJob = scheduleJob("0 4 * * *", async () => {
      console.log(
        "Running scheduled message fetch job at",
        new Date().toISOString()
      );
      try {
        // Calculate yesterday and today dates
        const today = new Date();
        const yesterday = subDays(today, 1);
        const yesterdayStr = format(yesterday, "yyyy-MM-dd");

        // Fetch messages from yesterday to today
        await fillArchivedMessages(yesterdayStr, yesterdayStr);
        await processBatchEmbeddings();
        console.log("Message fetch job completed successfully");
      } catch (error) {
        console.error("Error in message fetch job:", error);
      }
    });

    graypaperJob = scheduleJob("0 0 * * *", async () => {
      console.log(
        "Running scheduled graypaper update job at",
        new Date().toISOString()
      );
      try {
        await updateGraypapers();
        console.log("Graypaper update job completed successfully");
      } catch (error) {
        console.error("Error in graypaper update job:", error);
      }
    });
  }

  // Start HTTP server
  const server = serve({
    fetch: app.fetch,
    port: env.PORT,
  });

  console.log(`🚀 Server running on http://localhost:${env.PORT}`);

  // Handle graceful shutdown
  const shutdown = async () => {
    console.log("🛑 Shutting down...");
    server.close();
    matrixJob?.cancel();
    graypaperJob?.cancel();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

import { serve } from "@hono/node-server";
import { type Job, scheduleJob } from "node-schedule";
import { createApp } from "./api.js";
import { db } from "./db/db.js";
import { env } from "./env.js";
import { updateGraypapers } from "./scripts/updateGraypapers.js";
import { MessagesLogger } from "./services/logger.js";
import { fetchArchivedMessages } from "./services/archiveService.js";

const isDev = process.env.NODE_ENV === "development";
async function main() {
  const msgLog = new MessagesLogger({ roomIds: env.ROOM_IDS, db: db });
  let job: Job | null = null;
  const app = createApp();

  if (!isDev) {
    // Schedule job to fetch archived messages at 4 UTC
    job = scheduleJob("0 4 * * *", async () => {
      console.log(
        "Running scheduled message archive fetch job at",
        new Date().toISOString()
      );
      try {
        // Get yesterday's date (messages from previous day)
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        // Define archive URLs for the rooms
        // First entry is graypaper room, second is JAM room
        const archiveUrls = [
          "https://paritytech.github.io/matrix-archiver/archive/_21ddsEwXlCWnreEGuqXZ_3Apolkadot.io/index.html",
          "https://paritytech.github.io/matrix-archiver/archive/_21wBOJlzaOULZOALhaRh_3Apolkadot.io/index.html",
        ];

        // Make sure we don't try to fetch more rooms than we have archive URLs for
        const roomCount = Math.min(env.ROOM_IDS.length, archiveUrls.length);

        // Fetch messages from archives and store them
        for (let i = 0; i < roomCount; i++) {
          const roomId = env.ROOM_IDS[i];
          const archiveUrl = archiveUrls[i];

          const messages = await fetchArchivedMessages(
            archiveUrl,
            roomId,
            yesterday
          );
          if (messages.length > 0) {
            await msgLog.onMessages(messages);
            console.log(
              `Added ${messages.length} messages from room ${roomId}`
            );
          } else {
            console.log(`No new messages found for room ${roomId}`);
          }
        }

        // Also update graypapers
        await updateGraypapers();
        console.log(
          "Archive fetch and graypaper update job completed successfully"
        );
      } catch (error) {
        console.error("Error in archive fetch job:", error);
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
    job?.cancel();
    process.exit(0);
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

main().catch((err) => {
  console.error("❌ Error:", err);
  process.exit(1);
});

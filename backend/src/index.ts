import { serve } from "@hono/node-server";
import { type Job, scheduleJob } from "node-schedule";
import { createApp } from "./api.js";
import { db } from "./db/db.js";
import { env } from "./env.js";
import { updateGraypapers } from "./scripts/updateGraypapers.js";
import { MessagesLogger } from "./services/logger.js";
import { fetchArchivedMessages } from "./services/archiveService.js";
import { format } from "date-fns";

const isDev = process.env.NODE_ENV === "development";
async function main() {
  // Extract just the room IDs for the MessagesLogger
  const roomIds = env.ROOM_IDS.map((room) => room.id);
  const msgLog = new MessagesLogger({ roomIds, db: db });
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
        // Get yesterday's date as string
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const yesterdayString = format(yesterday, "yyyy-MM-dd");

        // Fetch messages from archives and store them
        for (const room of env.ROOM_IDS) {
          console.log(
            `Processing room ${room.id} with archive URL ${room.archiveUrl}`
          );

          const messages = await fetchArchivedMessages(
            room.archiveUrl,
            room.id,
            yesterdayString,
            yesterdayString // Use same date for both from and to to get just yesterday's messages
          );

          if (messages.length > 0) {
            await msgLog.onMessages(messages);
            console.log(
              `Added ${messages.length} messages from room ${room.id}`
            );
          } else {
            console.log(`No new messages found for room ${room.id}`);
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

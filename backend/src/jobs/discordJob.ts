import { format, subDays } from "date-fns";
import { type Job, scheduleJob } from "node-schedule";
import {
  type DiscordConfig,
  fetchDiscordContent,
  storeContentInDatabase,
} from "../scripts/fetchDiscordMessages.js";
import { processBatchEmbeddings } from "../scripts/generateEmbeddingsBatch.js";

export function setupDiscordJob(): Job {
  return scheduleJob("0 5 * * *", async () => {
    console.log(
      "Running scheduled Discord fetch job at",
      new Date().toISOString()
    );
    try {
      // Get Discord configuration from environment variables
      const discordToken = process.env.DISCORD_TOKEN;
      const discordChannels = [
        { serverId: "1354783684867264604", channelId: "1357838246276497590" },
      ];

      if (!discordToken) {
        console.log("Discord token not configured, skipping Discord job");
        return;
      }

      if (discordChannels.length === 0) {
        console.log("No Discord channels configured, skipping Discord job");
        return;
      }

      // Fetch messages from the last 2 days to ensure we don't miss anything
      const today = new Date();
      const twoDaysAgo = subDays(today, 2);
      const startDate = format(twoDaysAgo, "yyyy-MM-dd");

      const config: DiscordConfig = {
        token: discordToken,
        channels: discordChannels,
        startDate: startDate,
        maxMessages: 1000,
        includeThreads: false,
      };

      console.log(
        `Fetching Discord messages from ${discordChannels.length} channels since ${startDate}`
      );
      const messages = await fetchDiscordContent(config);

      if (messages.length > 0) {
        console.log(`Storing ${messages.length} Discord messages in database`);
        await storeContentInDatabase(messages);

        // Generate embeddings for new messages
        await processBatchEmbeddings();
        console.log("Discord fetch job completed successfully");
      } else {
        console.log("No new Discord messages found");
      }
    } catch (error) {
      console.error("Error in Discord fetch job:", error);
    }
  });
}

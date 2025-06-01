import {
  Client,
  GatewayIntentBits,
  TextChannel,
  Message,
  Collection,
} from "discord.js";
import { db } from "../db/db.js";
import { discordsTable } from "../db/schema.js";
import { sql } from "drizzle-orm";

export interface DiscordConfig {
  token: string;
  channels: string[]; // Channel IDs to fetch messages from
  startDate?: string; // Start date in yyyy-MM-dd format (optional)
  endDate?: string; // End date in yyyy-MM-dd format (optional)
  maxMessages?: number; // Maximum number of messages to fetch per channel (optional, default: 1000)
}

export interface DiscordMessage {
  id: string;
  channelId: string;
  content: string;
  author: {
    username: string;
    id: string;
  };
  timestamp: Date;
}

async function fetchChannelMessages(
  client: Client,
  channelId: string,
  config: {
    startDate?: string;
    endDate?: string;
    maxMessages?: number;
  } = {}
): Promise<DiscordMessage[]> {
  const channel = await client.channels.fetch(channelId);
  if (!channel || !(channel instanceof TextChannel)) {
    throw new Error(`Channel ${channelId} not found or not a text channel`);
  }

  const maxMessages = config.maxMessages || 1000;
  const startDate = config.startDate
    ? new Date(config.startDate + "T00:00:00.000Z")
    : null;
  const endDate = config.endDate
    ? new Date(config.endDate + "T23:59:59.999Z")
    : null;

  const allMessages: DiscordMessage[] = [];
  let lastMessageId: string | undefined;
  let fetchedCount = 0;

  console.log(`Fetching messages from channel ${channelId}...`);
  if (startDate) console.log(`  Start date: ${startDate.toISOString()}`);
  if (endDate) console.log(`  End date: ${endDate.toISOString()}`);
  console.log(`  Max messages: ${maxMessages}`);

  while (fetchedCount < maxMessages) {
    const limit = Math.min(100, maxMessages - fetchedCount); // Discord API limit is 100
    const fetchOptions: { limit: number; before?: string } = { limit };

    if (lastMessageId) {
      fetchOptions.before = lastMessageId;
    }

    const messages = await channel.messages.fetch(fetchOptions);

    if (messages.size === 0) {
      console.log(`  No more messages available`);
      break;
    }

    const messageArray = Array.from(messages.values());
    let addedInThisBatch = 0;

    for (const msg of messageArray) {
      const messageDate = msg.createdAt;

      // Check if message is within date range
      if (endDate && messageDate > endDate) {
        continue; // Skip messages newer than end date
      }

      if (startDate && messageDate < startDate) {
        console.log(`  Reached messages older than start date, stopping fetch`);
        return allMessages;
      }

      // Convert to our format
      const discordMessage: DiscordMessage = {
        id: msg.id,
        channelId: msg.channelId,
        content: msg.content,
        author: {
          username: msg.author.username,
          id: msg.author.id,
        },
        timestamp: msg.createdAt,
      };

      allMessages.push(discordMessage);
      addedInThisBatch++;
      fetchedCount++;

      if (fetchedCount >= maxMessages) {
        break;
      }
    }

    console.log(
      `  Fetched batch: ${addedInThisBatch} messages (total: ${fetchedCount})`
    );

    if (addedInThisBatch === 0) {
      console.log(`  No messages in date range found in this batch, stopping`);
      break;
    }

    // Set the last message ID for pagination
    lastMessageId = messageArray[messageArray.length - 1].id;

    // If we got fewer messages than requested, we've reached the end
    if (messages.size < limit) {
      console.log(`  Reached end of channel messages`);
      break;
    }
  }

  console.log(`  Total messages fetched: ${allMessages.length}`);
  return allMessages;
}

export async function fetchDiscordContent(
  config: DiscordConfig
): Promise<DiscordMessage[]> {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  try {
    await client.login(config.token);
    console.log("Successfully logged in to Discord");

    const allMessages: DiscordMessage[] = [];
    for (const channelId of config.channels) {
      console.log(`Fetching messages from channel ${channelId}`);
      const messages = await fetchChannelMessages(client, channelId, {
        startDate: config.startDate,
        endDate: config.endDate,
        maxMessages: config.maxMessages,
      });
      allMessages.push(...messages);
    }

    return allMessages;
  } finally {
    client.destroy();
  }
}

export async function storeContentInDatabase(
  messages: DiscordMessage[],
  roomId: string
) {
  await db.transaction(async (tx) => {
    for (const message of messages) {
      // Skip empty messages
      if (!message.content.trim()) continue;

      await tx
        .insert(discordsTable)
        .values({
          messageid: message.id,
          channelid: message.channelId,
          roomid: roomId,
          sender: message.author.username,
          author_id: message.author.id,
          content: message.content,
          timestamp: message.timestamp,
        })
        .onConflictDoUpdate({
          target: discordsTable.messageid,
          set: {
            content: message.content,
            sender: message.author.username,
            author_id: message.author.id,
            channelid: message.channelId,
            timestamp: message.timestamp,
          },
        });
    }

    console.log("Reindexing discords_search_idx");
    await tx.execute(sql`REINDEX INDEX discords_search_idx;`);
  });
}

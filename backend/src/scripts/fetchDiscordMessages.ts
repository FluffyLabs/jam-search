import { Client, GatewayIntentBits, TextChannel, Message } from "discord.js";
import { db } from "../db/db.js";
import { messagesTable } from "../db/schema.js";
import { sql } from "drizzle-orm";

export interface DiscordConfig {
  token: string;
  channels: string[]; // Channel IDs to fetch messages from
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
  limit: number = 100
): Promise<DiscordMessage[]> {
  const channel = await client.channels.fetch(channelId);
  if (!channel || !(channel instanceof TextChannel)) {
    throw new Error(`Channel ${channelId} not found or not a text channel`);
  }

  const messages = await channel.messages.fetch({ limit });
  return Array.from(messages.values()).map((msg: Message) => ({
    id: msg.id,
    channelId: msg.channelId,
    content: msg.content,
    author: {
      username: msg.author.username,
      id: msg.author.id,
    },
    timestamp: msg.createdAt,
  }));
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
      const messages = await fetchChannelMessages(client, channelId);
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
        .insert(messagesTable)
        .values({
          messageid: message.id,
          roomid: roomId,
          sender: message.author.username,
          content: message.content,
          timestamp: message.timestamp,
        })
        .onConflictDoUpdate({
          target: messagesTable.messageid,
          set: {
            content: message.content,
            sender: message.author.username,
            timestamp: message.timestamp,
          },
        });
    }

    console.log("Reindexing messages_search_idx");
    await tx.execute(sql`REINDEX INDEX messages_search_idx;`);
  });
}

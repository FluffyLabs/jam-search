import "dotenv/config";
import { eq } from "drizzle-orm";
import type { DbClient } from "../db/db.js";
import { messagesTable } from "../db/schema.js";

export interface Message {
  messageId: string;
  roomId: string;
  sender: string;
  content: string;
  timestamp: Date;
}

type Dependencies = {
  db: DbClient;
  roomIds: string[];
};

const toDbMessage = (newMessage: Message) => {
  return {
    messageid: newMessage.messageId,
    roomid: newMessage.roomId,
    sender: newMessage.sender,
    content: newMessage.content,
    timestamp: newMessage.timestamp,
  };
};

export class MessagesLogger {
  private roomIds: string[];
  private db: DbClient;

  constructor({ roomIds, db }: Dependencies) {
    this.roomIds = roomIds;
    this.db = db;
  }

  public getRoomIds(): string[] {
    return this.roomIds;
  }

  private generatePermalink(eventId: string, roomId: string): string {
    return `https://matrix.to/#/${roomId}/${eventId}`;
  }

  async onMessage(
    roomId: string,
    msg: string,
    sender: string | undefined,
    messageId: string | undefined,
    date: Date | null
  ) {
    if (!messageId || !date) {
      return;
    }
    const newMessage: Message = {
      messageId,
      roomId: roomId,
      sender: sender || "unknown",
      content: msg,
      timestamp: date,
    };

    try {
      await this.db.insert(messagesTable).values(toDbMessage(newMessage));
    } catch (error) {
      console.error(
        "error indexing message",
        `${newMessage.timestamp.toISOString()}`,
        error
      );
    }
  }

  async updateMessage(
    roomId: string,
    originalMessageId: string,
    newContent: string,
    sender: string | undefined,
    editMessageId: string | undefined,
    date: Date | null
  ) {
    if (!originalMessageId || !date || !editMessageId) {
      return;
    }

    try {
      // Update the message content in the database
      await this.db
        .update(messagesTable)
        .set({
          content: newContent,
          messageid: editMessageId,
          // Optionally track edit timestamp, but keeping original message ID
        })
        .where(eq(messagesTable.messageid, originalMessageId));

      console.log(`Updated message ${originalMessageId} with new content`);
    } catch (error) {
      console.error("Error updating edited message", originalMessageId, error);
    }
  }

  async onMessages(
    events: {
      roomId: string;
      msg: string;
      sender: string | undefined;
      messageId: string | undefined;
      date: Date | null;
    }[]
  ) {
    if (events.length === 0) {
      return;
    }

    try {
      const messages: Message[] = events
        .filter(
          (
            event
          ): event is {
            roomId: string;
            msg: string;
            sender: string | undefined;
            messageId: string;
            date: Date;
          } => Boolean(event.messageId && event.date)
        )
        .map((event) => ({
          messageId: event.messageId,
          roomId: event.roomId,
          sender: event.sender || "unknown",
          content: event.msg,
          timestamp: event.date,
        }));

      console.log(
        "Inserting messages",
        messages.length,
        JSON.stringify(messages, null, 2)
      );
      await this.db
        .insert(messagesTable)
        .values(messages.map(toDbMessage))
        .onConflictDoNothing();
    } catch (error) {
      console.error("error indexing multiple messages", error);
    }
  }
}

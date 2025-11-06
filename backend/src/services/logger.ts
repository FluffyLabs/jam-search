import "dotenv/config";
import type { DbClient } from "../db/db.js";
import { messagesTable } from "../db/schema.js";

export interface Message {
  messageId: string;
  roomId: string;
  sender: string;
  content: string;
  timestamp: Date;
}

const toDbMessage = (newMessage: Message) => {
  return {
    messageId: newMessage.messageId,
    roomId: newMessage.roomId,
    sender: newMessage.sender,
    content: newMessage.content,
    timestamp: newMessage.timestamp,
  };
};

export class MessagesLogger {
  constructor(private readonly db: DbClient) {}

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

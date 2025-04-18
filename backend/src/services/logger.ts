import "dotenv/config";
import { DbClient } from "../db/db.js";
import { messagesTable } from "../db/schema.js";

export interface Message {
  messageId: string;
  roomId: string;
  sender: string;
  link: string;
  content: string;
  timestamp: Date;
}

type Dependencies = {
  db: DbClient;
  roomIds: string[];
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
    eventId: string | undefined,
    date: Date | null
  ) {
    if (!eventId || !date) {
      return;
    }
    const encodedMessageId = Buffer.from(eventId).toString("base64url");
    const link = this.generatePermalink(eventId, roomId);
    const newMessage: Message = {
      messageId: encodedMessageId,
      roomId: roomId,
      sender: sender || "unknown",
      link: link,
      content: msg,
      timestamp: date,
    };

    try {
      await this.db.insert(messagesTable).values({
        messageid: newMessage.messageId,
        roomid: newMessage.roomId,
        sender: newMessage.sender,
        link: newMessage.link,
        content: newMessage.content,
        timestamp: newMessage.timestamp,
      });
    } catch (error) {
      console.error(
        "error indexing message",
        `${newMessage.timestamp.toISOString()}`,
        error
      );
    }
  }
}

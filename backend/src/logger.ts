// src/logger.ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

export interface Message {
  messageId: string;
  roomId: string;
  sender: string;
  link: string;
  content: string;
  timestamp: Date;
}

export class MessagesLogger {
  private roomIds: string[];

  constructor(roomIds: string[]) {
    this.roomIds = roomIds;
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
      const query = `
        INSERT INTO public.messages (messageid, roomid, sender, link, content, "timestamp", searchable)
        VALUES ($1, $2, $3, $4, $5, $6::timestamp, to_tsvector($7))
      `;
      const values = [
        newMessage.messageId,
        newMessage.roomId,
        newMessage.sender,
        newMessage.link,
        newMessage.content,
        newMessage.timestamp.toISOString(),
        `${newMessage.sender} ${newMessage.content}`,
      ];
      await pool.query(query, values);
    } catch (error) {
      console.error(
        "error indexing message",
        `${newMessage.timestamp.toISOString()}`,
        error
      );
    }
  }
}

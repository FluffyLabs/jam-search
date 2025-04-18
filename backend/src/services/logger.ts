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

  async onMessages(
    events: {
      roomId: string;
      msg: string;
      sender: string | undefined;
      eventId: string | undefined;
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
            eventId: string;
            date: Date;
          } => Boolean(event.eventId && event.date)
        )
        .map((event) => ({
          messageId: Buffer.from(event.eventId).toString("base64url"),
          roomId: event.roomId,
          sender: event.sender || "unknown",
          link: this.generatePermalink(event.eventId, event.roomId),
          content: event.msg,
          timestamp: event.date,
        }));

      await this.db.insert(messagesTable).values(messages);
    } catch (error) {
      console.error("error indexing multiple messages", error);
    }
  }
}

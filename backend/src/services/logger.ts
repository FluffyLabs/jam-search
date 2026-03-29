import "dotenv/config";
import { type ChatMessage, writeMatrixDayFile } from "../data/writer.js";

export interface Message {
  messageId: string;
  roomId: string;
  sender: string;
  content: string;
  timestamp: Date;
}

export class MessagesLogger {
  constructor(
    private readonly dataDir: string,
    private readonly roomName: string
  ) {}

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

      console.log("Writing messages", messages.length);

      // Group by date
      const byDate = new Map<string, ChatMessage[]>();
      for (const msg of messages) {
        const date = msg.timestamp.toISOString().split("T")[0];
        if (!byDate.has(date)) {
          byDate.set(date, []);
        }
        byDate.get(date)?.push({
          sender: msg.sender,
          timestamp: msg.timestamp,
          messageId: msg.messageId,
          content: msg.content,
        });
      }

      const roomId = messages[0]?.roomId;
      for (const [date, msgs] of byDate) {
        writeMatrixDayFile(this.dataDir, this.roomName, roomId, date, msgs);
      }
    } catch (error) {
      console.error("error writing messages to markdown", error);
    }
  }
}

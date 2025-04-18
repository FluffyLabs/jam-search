import { ClientEvent, RoomEvent, createClient } from "matrix-js-sdk";
import { MessagesLogger } from "./logger.js";

export class MatrixService {
  private client: any;

  constructor(
    private homeserverUrl: string,
    private accessToken: string,
    private userId: string,
    private msgLog: MessagesLogger
  ) {}

  async start() {
    this.client = createClient({
      baseUrl: this.homeserverUrl,
      accessToken: this.accessToken,
      userId: this.userId,
    });

    this.client.startClient();

    this.client.once(ClientEvent.Sync, (state: string) => {
      if (state === "PREPARED") {
        console.log("✅ Matrix client is ready and synced!");
      }
    });

    this.client.on(RoomEvent.Timeline, (event: any, room: any) => {
      const roomId = room?.roomId;
      const messageContent = event.getContent().body;

      if (
        !roomId ||
        !this.msgLog.getRoomIds().includes(roomId) ||
        !messageContent
      ) {
        return;
      }

      const sender = event.getSender();
      const eventId = event.getId();
      const timestamp = event.getDate();

      if (typeof messageContent === "string") {
        this.msgLog.onMessage(
          roomId,
          messageContent,
          sender,
          eventId,
          timestamp
        );
      }
    });

    return this.client;
  }

  async stop() {
    if (this.client) {
      await this.client.stopClient();
    }
  }
}

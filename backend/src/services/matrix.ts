import {
  ClientEvent,
  type MatrixClient,
  RoomEvent,
  createClient,
} from "matrix-js-sdk";
import type { MessagesLogger } from "./logger.js";

export class MatrixService {
  private client: MatrixClient;

  constructor(
    private homeserverUrl: string,
    private accessToken: string,
    private userId: string,
    private msgLog: MessagesLogger,
  ) {
    this.client = createClient({
      baseUrl: this.homeserverUrl,
      accessToken: this.accessToken,
      userId: this.userId,
    });
  }

  async start() {
    this.client.startClient();

    await new Promise<void>((resolve) => {
      this.client.once(ClientEvent.Sync, (state: string) => {
        if (state === "PREPARED") {
          console.log("✅ Matrix client is ready and synced!");
          resolve();
        }
      });
    });

    this.client.on(RoomEvent.Timeline, (event, room) => {
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
          timestamp,
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

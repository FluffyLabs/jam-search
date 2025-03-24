import { MatrixClient, AutojoinRoomsMixin, SimpleFsStorageProvider } from "matrix-bot-sdk";
import { MessagesLogger } from "./logger";

export async function listenToMessages(
  homeserverUrl: string,
  accessToken: string,
  userId: string,
  roomId: string,
  msgLog: MessagesLogger
) {
  const storage = new SimpleFsStorageProvider("bot-storage.json");
  const client = new MatrixClient(homeserverUrl, accessToken, storage);

  AutojoinRoomsMixin.setupOnClient(client);

  client.on("room.message", (incomingRoomId, event) => {
    if (incomingRoomId !== msgLog.getRoomId() || !event["content"]) return;

    const sender = event["sender"];
    const messageContent = event["content"]["body"];
    const eventId = event["event_id"];
    const timestamp = new Date(event["origin_server_ts"]);

    if (typeof messageContent === "string") {
      msgLog.onMessage(messageContent, sender, eventId, timestamp);
    }
  });

  await client.start();
  console.log("Backend job start");
}

import type { MessagesLogger } from "./logger";

export async function listenToMessages(
  homeserverUrl: string,
  accessToken: string,
  userId: string,
  msgLog: MessagesLogger
) {
  const { ClientEvent, RoomEvent, createClient } = await import(
    "matrix-js-sdk"
  );

  const client = createClient({
    baseUrl: homeserverUrl,
    accessToken: accessToken,
    userId,
  });

  // Start the client
  client.startClient();

  // Wait for the client to be ready
  client.once(ClientEvent.Sync, (state: string) => {
    if (state === "PREPARED") {
      console.log("Client is ready and synced!");
    }
  });

  client.on(RoomEvent.Timeline, (event, room) => {
    const roomId = room?.roomId;
    const messageContent = event.getContent().body;

    if (!roomId || !msgLog.getRoomIds().includes(roomId) || !messageContent)
      return;

    const sender = event.getSender();
    const eventId = event.getId();
    const timestamp = event.getDate();

    if (typeof messageContent === "string") {
      msgLog.onMessage(roomId, messageContent, sender, eventId, timestamp);
    }
  });

  return client;
}

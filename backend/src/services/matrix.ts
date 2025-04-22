import {
  ClientEvent,
  type MatrixClient,
  RoomEvent,
  createClient,
  MatrixError,
} from "matrix-js-sdk";
import type { MessagesLogger } from "./logger.js";
import { ISyncStateData, SyncState } from "matrix-js-sdk/lib/sync.js";

export class MatrixService {
  private client?: MatrixClient;

  constructor(
    private homeserverUrl: string,
    private accessToken: string | undefined,
    private userId: string,
    private msgLog: MessagesLogger,
    private username: string,
    private password: string
  ) {}

  /**
   * Creates a Matrix client. If accessToken is provided, uses it.
   * Otherwise, performs a login with username/password and creates a client
   * with all necessary tokens, letting Matrix handle refreshes
   */
  async createMatrixClient(): Promise<MatrixClient> {
    // If we have an access token, try using it first
    // This way we can avoid the login process for short leaving tasks - like filling DB
    if (this.accessToken) {
      console.log("🔑 Using provided access token");
      return createClient({
        baseUrl: this.homeserverUrl,
        accessToken: this.accessToken,
        userId: this.userId,
      });
    }

    // No access token available - need to authenticate
    if (!this.username || !this.password) {
      throw new Error("Matrix username or password not set");
    }

    console.log("🔑 Performing Matrix login...");

    // Create a temporary client without token for login
    const tempClient = createClient({
      baseUrl: this.homeserverUrl,
    });

    // Perform login to get a fresh token
    const response = await tempClient.loginRequest({
      type: "m.login.password",
      user: this.username,
      password: this.password,
      refresh_token: true, // Request a refresh token
    });

    console.log("✅ Successfully authenticated with Matrix");

    // Check if expires_in_ms is available in the response
    if (response.expires_in_ms) {
      console.log(
        `✓ Token will expire in ${Math.round(
          response.expires_in_ms / (1000 * 60 * 60)
        )} hours`
      );
    }

    // Create a client with accessToken and refreshToken
    // The matrix-js-sdk will handle token refresh automatically
    return createClient({
      baseUrl: this.homeserverUrl,
      accessToken: response.access_token,
      refreshToken: response.refresh_token,
      userId: response.user_id || this.userId,
    });
  }

  async start(): Promise<MatrixClient> {
    try {
      this.client = await this.createMatrixClient();

      // Start the client
      this.client.startClient();

      await new Promise<void>((resolve, reject) => {
        this.client!.once(
          ClientEvent.Sync,
          (
            state: SyncState,
            prevState: SyncState | null,
            data?: ISyncStateData
          ) => {
            console.log("state", state, prevState, data?.error?.name);
            if (state === "ERROR" && data?.error?.name === "M_UNKNOWN_TOKEN") {
              console.log("🚨 Matrix client is in error state");
              reject("Matrix token expired - incorrect initial credentials");
            } else if (state === "PREPARED") {
              console.log("✅ Matrix client is ready and synced!");
              resolve();
            }
          }
        );
      });

      // Set up error handler for token issues
      this.client.on(ClientEvent.SyncUnexpectedError, async (error: Error) => {
        console.log(
          "🚨 Matrix token expired, attempting to re-authenticate..."
        );
        if (error instanceof MatrixError && error.name === "M_UNKNOWN_TOKEN") {
          console.warn(
            "🚨 Matrix token expired, attempting to re-authenticate..."
          );
          await this.stop();

          this.client = await this.createMatrixClient();
          this.client.startClient();
        }
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
            timestamp
          );
        }
      });

      return this.client;
    } catch (error) {
      console.warn("🚨 Matrix token expired, attempting to re-authenticate...");
      console.error("❌ Error starting Matrix client:", error);
      if (error instanceof MatrixError && error.name === "M_UNKNOWN_TOKEN") {
        this.client = await this.createMatrixClient();
        return this.start();
      }
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.client) {
      await this.client.stopClient();
      this.client = undefined;
    }
  }
}

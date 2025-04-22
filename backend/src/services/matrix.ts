import {
  ClientEvent,
  type MatrixClient,
  RoomEvent,
  createClient,
  MatrixError,
} from "matrix-js-sdk";
import type { MessagesLogger } from "./logger.js";

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  userId: string;
  expiresInMs?: number;
}

export class MatrixService {
  private client?: MatrixClient;
  private isRefreshing = false;
  private refreshToken?: string;
  private tokenExpiryTime?: number;

  constructor(
    private homeserverUrl: string,
    private accessToken: string | undefined,
    private userId: string,
    private msgLog: MessagesLogger,
    private username: string,
    private password: string
  ) {}

  private async authenticate(): Promise<AuthTokens> {
    if (!this.username || !this.password) {
      throw new Error("Matrix username or password not set");
    }

    console.log("🔑 Performing Matrix login...");

    // Create a temporary client without token for login
    const tempClient = createClient({
      baseUrl: this.homeserverUrl,
    });

    try {
      // Perform login to get a fresh token
      const response = await tempClient.loginRequest({
        type: "m.login.password",
        user: this.username,
        password: this.password,
        refresh_token: true,
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

      return {
        accessToken: response.access_token,
        refreshToken: response.refresh_token || "",
        userId: response.user_id || this.userId,
        expiresInMs: response.expires_in_ms,
      };
    } catch (error) {
      console.error("❌ Matrix authentication failed:", error);
      throw error;
    }
  }

  private async refreshAccessToken(): Promise<AuthTokens> {
    if (!this.refreshToken) {
      // If no refresh token, fall back to password authentication
      return this.authenticate();
    }

    try {
      console.log("🔄 Refreshing Matrix access token using refresh token...");

      // Create temporary client for token refresh
      const tempClient = createClient({
        baseUrl: this.homeserverUrl,
      });

      // The refreshToken method in matrix-js-sdk
      const response = await tempClient.refreshToken(this.refreshToken);

      console.log("✅ Successfully refreshed Matrix access token");

      // Check if expires_in_ms is available in the response
      if (response.expires_in_ms) {
        console.log(
          `✓ Refreshed token will expire in ${Math.round(
            response.expires_in_ms / (1000 * 60 * 60)
          )} hours`
        );
      }

      return {
        accessToken: response.access_token,
        refreshToken: response.refresh_token || this.refreshToken,
        userId: this.userId,
        expiresInMs: response.expires_in_ms,
      };
    } catch (error) {
      console.error(
        "❌ Failed to refresh token, falling back to password auth:",
        error
      );
      // If refresh token is invalid or expired, fall back to password authentication
      return this.authenticate();
    }
  }

  async createMatrixClient(): Promise<MatrixClient> {
    if (this.isRefreshing) {
      throw new Error("Already refreshing client");
    }

    this.isRefreshing = true;

    try {
      let tokens: AuthTokens;

      // Use existing token if valid, otherwise authenticate
      if (this.accessToken && !this.tokenExpired()) {
        tokens = {
          accessToken: this.accessToken,
          refreshToken: this.refreshToken || "",
          userId: this.userId,
        };
      } else if (this.refreshToken) {
        // Try to refresh using refresh token
        tokens = await this.refreshAccessToken();
      } else {
        // First time or fallback: authenticate with username/password
        tokens = await this.authenticate();
      }

      // Update internal state with new tokens
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;
      this.userId = tokens.userId;

      // Calculate token expiry time based on expires_in_ms from the response
      // If expires_in_ms is not available, use a reasonable default of 12 hours
      // Add a 5-minute buffer to refresh slightly before actual expiration
      const buffer = 5 * 60 * 1000; // 5 minutes in milliseconds
      const defaultExpiry = 12 * 60 * 60 * 1000; // 12 hours in milliseconds

      this.tokenExpiryTime =
        Date.now() +
        (tokens.expiresInMs ? tokens.expiresInMs - buffer : defaultExpiry);

      console.log(
        `⏰ Token expiry set to ${new Date(this.tokenExpiryTime).toISOString()}`
      );

      // Create client with the new tokens
      return createClient({
        baseUrl: this.homeserverUrl,
        accessToken: this.accessToken,
        userId: this.userId,
      });
    } finally {
      this.isRefreshing = false;
    }
  }

  private tokenExpired(): boolean {
    return (
      !this.accessToken ||
      (this.tokenExpiryTime !== undefined && Date.now() >= this.tokenExpiryTime)
    );
  }

  async start() {
    try {
      this.client = await this.createMatrixClient();

      // Start the client
      this.client.startClient();

      await new Promise<void>((resolve) => {
        this.client!.once(ClientEvent.Sync, (state: string) => {
          if (state === "PREPARED") {
            console.log("✅ Matrix client is ready and synced!");
            resolve();
          }
        });
      });

      // Set up error handler for token issues
      this.client.on("sync.error" as any, async (error: Error) => {
        if (error instanceof MatrixError) {
          if (
            error.errcode === "M_UNKNOWN_TOKEN" ||
            error.message.includes("Token is not active") ||
            error.data?.error?.includes("Token is not active")
          ) {
            console.warn("🚨 Matrix token expired, attempting to refresh...");
            await this.stop();
            await this.handleTokenRefresh();
          }
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
      console.error("❌ Error starting Matrix client:", error);
      if (
        error instanceof MatrixError &&
        (error.errcode === "M_UNKNOWN_TOKEN" ||
          error.message.includes("Token is not active") ||
          error.data?.error?.includes("Token is not active"))
      ) {
        await this.handleTokenRefresh();
      }
      throw error;
    }
  }

  private async handleTokenRefresh() {
    try {
      this.client = await this.createMatrixClient();
      await this.start();
    } catch (error) {
      console.error("❌ Failed to refresh client after token expiry:", error);
      throw error;
    }
  }

  async stop() {
    if (this.client) {
      await this.client.stopClient();
      this.client = undefined;
    }
  }
}

// src/logger.ts
import { SearchClient, AzureKeyCredential } from "@azure/search-documents";

export interface Message {
  messageId: string;
  roomId: string;
  sender: string;
  link: string;
  content: string;
  timestamp: Date;
}

export class MessagesLogger {
  private searchClient: SearchClient<Message>;
  private roomId: string;

  constructor(roomId: string, searchEndpoint: string, indexName: string, apiKey: string) {
    this.roomId = roomId;
    this.searchClient = new SearchClient<Message>(
      searchEndpoint,
      indexName,
      new AzureKeyCredential(apiKey)
    );
  }

  public getRoomId(): string {
    return this.roomId;
  }

  private generatePermalink(eventId: string): string {
    return `https://matrix.to/#/${this.roomId}/${eventId}`;
  }

  async onMessage(
    msg: string,
    sender: string | undefined,
    eventId: string | undefined,
    date: Date | null
  ) {
    if (!eventId || !date) {
      return;
    }
    const encodedMessageId = Buffer.from(eventId).toString('base64url');
    const link = this.generatePermalink(eventId);
    const newMessage: Message = {
      messageId: encodedMessageId,
      roomId: this.roomId,
      sender: sender || "unknown",
      link: link,
      content: msg,
      timestamp: date,
    };

    try {
        const result = await this.searchClient.uploadDocuments([newMessage]);
        if (result.results.length > 0) {
          console.log(`Indexed message: ${result.results[0].key}`);
        } else {
          console.log('No indexed message.');
        }
      } catch (error) {
        console.error("error indexing message", error);
      }
  }
}

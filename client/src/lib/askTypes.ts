export type SourceType = "graypaper" | "discord" | "matrix" | "page";

/** Raw agent events streamed from the backend `/ask` SSE endpoint. */
export type AgentEvent =
  | { type: "tool_call"; name: string; args: unknown }
  | {
      type: "tool_result";
      name: string;
      resultCount: number;
      payload: unknown;
    }
  | { type: "content_delta"; text: string }
  | { type: "citation"; n: number; docId: string; sourceType: SourceType }
  | { type: "done" }
  | { type: "error"; message: string };

/** A single card the citations panel can render. Derived from a search_all
 *  result or get_full_document result by the reducer. */
export interface CitationCardData {
  docId: string;
  sourceType: SourceType;
  title?: string;
  preview?: string;
  url?: string;
  sender?: string;
  channelName?: string;
  roomName?: string;
  timestamp?: number | null;
}

/** A tool step shown inline in an assistant message. */
export interface ToolStep {
  id: string; // unique client-side id for React keys
  toolName: string;
  args: unknown;
  resultCount?: number;
}

/** A citation anchor in an assistant message. */
export interface Citation {
  n: number;
  docId: string;
  sourceType: SourceType;
}

export interface UserMessage {
  id: string;
  role: "user";
  content: string;
}

export interface AssistantMessage {
  id: string;
  role: "assistant";
  content: string;
  toolSteps: ToolStep[];
  citations: Citation[];
  error?: string;
  isStreaming: boolean;
}

export type ChatMessage = UserMessage | AssistantMessage;

/** Top-level conversation state held in sessionStorage. */
export interface AskConversationState {
  messages: ChatMessage[];
  /** Map from docId to card data, populated from tool_result payloads. */
  cards: Record<string, CitationCardData>;
  /** Currently-selected model id (from the curated list). */
  model: string;
}

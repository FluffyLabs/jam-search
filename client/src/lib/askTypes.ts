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

/**
 * A single ordered part of an assistant message. Parts appear in the order they
 * were produced, so tool calls naturally interleave with the text segments the
 * model streams between them.
 */
export type AssistantPart = TextPart | ToolPart;

export interface TextPart {
  kind: "text";
  id: string;
  content: string;
}

export interface ToolPart {
  kind: "tool";
  id: string;
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
  parts: AssistantPart[];
  citations: Citation[];
  error?: string;
  isStreaming: boolean;
}

/** Flatten an assistant message's text parts into a single string. Used when
 *  we need the assistant's content as a blob (e.g., to send prior turns back
 *  to the backend). */
export function assistantText(m: AssistantMessage): string {
  return m.parts
    .filter((p): p is TextPart => p.kind === "text")
    .map((p) => p.content)
    .join("");
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

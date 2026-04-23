import type {
  AskConversationState,
  AssistantMessage,
  AssistantPart,
  ChatMessage,
  CitationCardData,
  ErrorKind,
  SourceType,
  TextPart,
  ToolPart,
  UserMessage,
} from "./askTypes";
import { DEFAULT_MODEL } from "./models";

export const initialState: AskConversationState = {
  messages: [],
  cards: {},
  model: DEFAULT_MODEL,
};

export type AskAction =
  | { type: "sendUserMessage"; text: string }
  | { type: "appendContent"; text: string }
  | { type: "addToolStep"; toolName: string; args: unknown }
  | {
      type: "completeToolStep";
      toolName: string;
      resultCount: number;
      payload: unknown;
    }
  | {
      type: "addCitation";
      n: number;
      docId: string;
      sourceType: SourceType;
    }
  | { type: "finishStreaming" }
  | { type: "setError"; message: string; kind?: ErrorKind }
  | { type: "setModel"; model: string }
  | { type: "reset" }
  | { type: "hydrate"; state: AskConversationState };

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `${Date.now().toString(36)}-${idCounter}`;
}

function isAssistant(m: ChatMessage): m is AssistantMessage {
  return m.role === "assistant";
}

function mapLastAssistant(
  messages: ChatMessage[],
  update: (msg: AssistantMessage) => AssistantMessage
): ChatMessage[] {
  // Find last assistant index.
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (isAssistant(m)) {
      const next = update(m);
      return [...messages.slice(0, i), next, ...messages.slice(i + 1)];
    }
  }
  return messages;
}

/** Extracts per-doc CitationCardData from a tool payload, if possible. */
function extractCards(payload: unknown): Record<string, CitationCardData> {
  const out: Record<string, CitationCardData> = {};
  if (Array.isArray(payload)) {
    for (const item of payload) {
      const card = toCard(item);
      if (card) out[card.docId] = card;
    }
  } else if (payload && typeof payload === "object") {
    const card = toCard(payload);
    if (card) out[card.docId] = card;
  }
  return out;
}

function toCard(item: unknown): CitationCardData | null {
  if (!item || typeof item !== "object") return null;
  const r = item as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.sourceType !== "string") return null;
  const sourceType = r.sourceType as SourceType;
  if (
    sourceType !== "graypaper" &&
    sourceType !== "discord" &&
    sourceType !== "matrix" &&
    sourceType !== "page"
  ) {
    return null;
  }
  // Prefer explicit "content" (from get_full_document) then "preview" (from search_all).
  const preview =
    (typeof r.content === "string" && r.content) ||
    (typeof r.preview === "string" && r.preview) ||
    "";
  return {
    docId: r.id,
    sourceType,
    preview,
    title: typeof r.title === "string" ? r.title : undefined,
    url: typeof r.url === "string" ? r.url : undefined,
    sender: typeof r.sender === "string" ? r.sender : undefined,
    channelName: typeof r.channelName === "string" ? r.channelName : undefined,
    roomName: typeof r.roomName === "string" ? r.roomName : undefined,
    timestamp:
      typeof r.timestamp === "number"
        ? r.timestamp
        : r.timestamp === null
          ? null
          : undefined,
  };
}

function appendToParts(parts: AssistantPart[], text: string): AssistantPart[] {
  if (parts.length === 0) {
    return [{ kind: "text", id: nextId(), content: text }];
  }
  const last = parts[parts.length - 1];
  if (last.kind === "text") {
    const merged: TextPart = { ...last, content: last.content + text };
    return [...parts.slice(0, -1), merged];
  }
  return [...parts, { kind: "text", id: nextId(), content: text }];
}

export function askReducer(
  state: AskConversationState,
  action: AskAction
): AskConversationState {
  switch (action.type) {
    case "hydrate":
      return action.state;

    case "sendUserMessage": {
      const user: UserMessage = {
        id: nextId(),
        role: "user",
        content: action.text,
      };
      const assistant: AssistantMessage = {
        id: nextId(),
        role: "assistant",
        parts: [],
        citations: [],
        isStreaming: true,
      };
      return {
        ...state,
        messages: [...state.messages, user, assistant],
      };
    }

    case "appendContent":
      return {
        ...state,
        messages: mapLastAssistant(state.messages, (m) => ({
          ...m,
          parts: appendToParts(m.parts, action.text),
        })),
      };

    case "addToolStep": {
      const newPart: ToolPart = {
        kind: "tool",
        id: nextId(),
        toolName: action.toolName,
        args: action.args,
      };
      return {
        ...state,
        messages: mapLastAssistant(state.messages, (m) => ({
          ...m,
          parts: [...m.parts, newPart],
        })),
      };
    }

    case "completeToolStep": {
      const extracted = extractCards(action.payload);
      return {
        ...state,
        cards: { ...state.cards, ...extracted },
        messages: mapLastAssistant(state.messages, (m) => {
          // Find newest tool part matching toolName that has no resultCount yet.
          const parts = [...m.parts];
          for (let i = parts.length - 1; i >= 0; i--) {
            const p = parts[i];
            if (
              p.kind === "tool" &&
              p.toolName === action.toolName &&
              p.resultCount === undefined
            ) {
              parts[i] = { ...p, resultCount: action.resultCount };
              break;
            }
          }
          return { ...m, parts };
        }),
      };
    }

    case "addCitation":
      return {
        ...state,
        messages: mapLastAssistant(state.messages, (m) => {
          if (m.citations.some((c) => c.n === action.n)) return m;
          return {
            ...m,
            citations: [
              ...m.citations,
              {
                n: action.n,
                docId: action.docId,
                sourceType: action.sourceType,
              },
            ],
          };
        }),
      };

    case "finishStreaming":
      return {
        ...state,
        messages: mapLastAssistant(state.messages, (m) => ({
          ...m,
          isStreaming: false,
        })),
      };

    case "setError":
      return {
        ...state,
        messages: mapLastAssistant(state.messages, (m) => ({
          ...m,
          isStreaming: false,
          error: action.message,
          errorKind: action.kind,
        })),
      };

    case "setModel":
      return { ...state, model: action.model };

    case "reset":
      return { ...initialState, model: state.model };
  }
}

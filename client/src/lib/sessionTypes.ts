import type {
  AskConversationState,
  AssistantMessage,
  ChatMessage,
  CitationCardData,
} from "@/lib/askTypes";

export interface AskSessionSummary {
  id: string;
  userId: string;
  title: string | null;
  isPublic: boolean;
  model: string;
  createdAt: string;
  updatedAt: string;
}

export interface AskSessionRecord extends AskSessionSummary {
  state: AskConversationState;
}

export interface AskSessionRow {
  id: string;
  user_id: string;
  title: string | null;
  is_public: boolean;
  model: string;
  messages: ChatMessage[];
  cards: Record<string, CitationCardData>;
  created_at: string;
  updated_at: string;
}

/** Strip transient UI-only fields (isStreaming, error) from assistant messages
 *  before writing to the DB. Called on every persist. */
export function stateToMessages(state: AskConversationState): ChatMessage[] {
  return state.messages.map((m) => {
    if (m.role === "user") return m;
    return {
      id: m.id,
      role: "assistant",
      parts: m.parts,
      citations: m.citations,
    } as ChatMessage;
  });
}

export function toRow(input: {
  id: string;
  userId: string;
  title: string | null;
  isPublic: boolean;
  state: AskConversationState;
}): Omit<AskSessionRow, "created_at" | "updated_at"> {
  return {
    id: input.id,
    user_id: input.userId,
    title: input.title,
    is_public: input.isPublic,
    model: input.state.model,
    messages: stateToMessages(input.state),
    cards: input.state.cards,
  };
}

export function fromRow(row: AskSessionRow): AskSessionRecord | null {
  if (!row || !Array.isArray(row.messages) || typeof row.cards !== "object") {
    return null;
  }
  const messages: ChatMessage[] = row.messages.map((m) => {
    if (m.role === "assistant") {
      return {
        ...(m as AssistantMessage),
        isStreaming: false,
      } satisfies AssistantMessage;
    }
    return m;
  });
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    isPublic: row.is_public,
    model: row.model,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    state: {
      messages,
      cards: row.cards ?? {},
      model: row.model,
    },
  };
}

/** Generate a sidebar-friendly title from the first user message. Used as an
 *  immediate fallback while the LLM-generated title is in flight, and as the
 *  final title if generation fails. */
export function deriveTitle(state: AskConversationState): string | null {
  const first = state.messages.find((m) => m.role === "user");
  if (!first || first.role !== "user") return null;
  const trimmed = first.content.trim().replace(/\s+/g, " ");
  if (!trimmed) return null;
  if (trimmed.length <= 60) return trimmed;
  const cut = trimmed.slice(0, 60);
  const lastSpace = cut.lastIndexOf(" ");
  const base = lastSpace > 30 ? cut.slice(0, lastSpace) : cut;
  return `${base.trimEnd()}…`;
}

import { describe, expect, it } from "vitest";
import type { AskConversationState, AssistantMessage } from "@/lib/askTypes";
import {
  deriveTitle,
  fromRow,
  stateToMessages,
  toRow,
} from "@/lib/sessionTypes";

const baseState: AskConversationState = {
  model: "anthropic/claude-haiku-4-5",
  cards: { docA: { docId: "docA", sourceType: "graypaper", title: "A" } },
  messages: [
    { id: "u1", role: "user", content: "hello" },
    {
      id: "a1",
      role: "assistant",
      parts: [{ kind: "text", id: "t1", content: "hi" }],
      citations: [],
      isStreaming: false,
    } satisfies AssistantMessage,
  ],
};

describe("stateToMessages", () => {
  it("drops isStreaming and error from assistant messages", () => {
    const streaming: AssistantMessage = {
      id: "a2",
      role: "assistant",
      parts: [{ kind: "text", id: "t1", content: "..." }],
      citations: [],
      isStreaming: true,
      error: "boom",
    };
    const result = stateToMessages({ ...baseState, messages: [streaming] });
    expect(result).toEqual([
      {
        id: "a2",
        role: "assistant",
        parts: [{ kind: "text", id: "t1", content: "..." }],
        citations: [],
      },
    ]);
  });

  it("preserves user messages verbatim", () => {
    const result = stateToMessages(baseState);
    expect(result[0]).toEqual({ id: "u1", role: "user", content: "hello" });
  });
});

describe("toRow / fromRow", () => {
  it("round-trips a session through the DB shape", () => {
    const row = toRow({
      id: "11111111-1111-1111-1111-111111111111",
      userId: "u",
      title: "Hi",
      isPublic: false,
      state: baseState,
    });
    expect(row).toMatchObject({
      id: "11111111-1111-1111-1111-111111111111",
      user_id: "u",
      title: "Hi",
      is_public: false,
      model: baseState.model,
      cards: baseState.cards,
    });
    expect(row.messages).toEqual(stateToMessages(baseState));

    const hydrated = fromRow({
      ...row,
      created_at: "2026-04-23T00:00:00Z",
      updated_at: "2026-04-23T00:00:00Z",
    });
    expect(hydrated).not.toBeNull();
    // biome-ignore lint/style/noNonNullAssertion: asserted above
    const record = hydrated!;
    // Assistant messages re-gain isStreaming=false on hydration.
    expect(record.state.messages[1]).toMatchObject({
      id: "a1",
      isStreaming: false,
    });
    expect(record.state.cards).toEqual(baseState.cards);
    expect(record.state.model).toBe(baseState.model);
  });

  it("fromRow returns null for non-array messages", () => {
    expect(
      fromRow({
        id: "x",
        user_id: "u",
        title: null,
        is_public: false,
        model: "m",
        messages: "not-array" as never,
        cards: {},
        created_at: "",
        updated_at: "",
      }),
    ).toBeNull();
  });
});

describe("deriveTitle", () => {
  it("returns null for empty state", () => {
    expect(
      deriveTitle({ model: "m", cards: {}, messages: [] }),
    ).toBeNull();
  });

  it("returns first user message verbatim when short", () => {
    expect(
      deriveTitle({
        model: "m",
        cards: {},
        messages: [{ id: "u1", role: "user", content: "Hi there" }],
      }),
    ).toBe("Hi there");
  });

  it("truncates at word boundary with ellipsis when long", () => {
    const longQ =
      "This is a very long question about accumulation semantics in the JAM protocol and what happens during parachain bonding.";
    const t = deriveTitle({
      model: "m",
      cards: {},
      messages: [{ id: "u1", role: "user", content: longQ }],
    });
    expect(t).toMatch(/…$/);
    expect(t!.length).toBeLessThanOrEqual(61);
    expect(t).not.toMatch(/\s…$/);
  });
});

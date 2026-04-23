import { describe, expect, it } from "vitest";
import { askReducer, initialState } from "../askReducer";
import { type AssistantMessage, assistantText } from "../askTypes";

function freshAssistant(state = initialState) {
  // Helper: send a user message then an empty assistant placeholder.
  return askReducer(state, { type: "sendUserMessage", text: "hello" });
}

function lastAssistant(state = initialState): AssistantMessage {
  const last = state.messages[state.messages.length - 1];
  if (!last || last.role !== "assistant") {
    throw new Error("last message is not an assistant");
  }
  return last;
}

describe("askReducer", () => {
  it("sendUserMessage appends a user message and a streaming assistant message", () => {
    const next = askReducer(initialState, {
      type: "sendUserMessage",
      text: "hi",
    });
    expect(next.messages.length).toBe(2);
    const user = next.messages[0];
    expect(user.role).toBe("user");
    if (user.role === "user") {
      expect(user.content).toBe("hi");
    }
    expect(next.messages[1].role).toBe("assistant");
    const last = lastAssistant(next);
    expect(last.parts).toEqual([]);
    expect(last.isStreaming).toBe(true);
  });

  it("appendContent merges consecutive text deltas into a single text part", () => {
    let s = freshAssistant();
    s = askReducer(s, { type: "appendContent", text: "foo" });
    s = askReducer(s, { type: "appendContent", text: "bar" });
    const last = lastAssistant(s);
    expect(last.parts.length).toBe(1);
    expect(last.parts[0].kind).toBe("text");
    expect(assistantText(last)).toBe("foobar");
  });

  it("addToolStep appends a tool part with a client-generated id", () => {
    let s = freshAssistant();
    s = askReducer(s, {
      type: "addToolStep",
      toolName: "search_all",
      args: { query: "q" },
    });
    const last = lastAssistant(s);
    expect(last.parts.length).toBe(1);
    const p = last.parts[0];
    expect(p.kind).toBe("tool");
    if (p.kind === "tool") {
      expect(p.toolName).toBe("search_all");
      expect(p.id).toMatch(/\S/);
    }
  });

  it("interleaves text and tool parts in timeline order", () => {
    let s = freshAssistant();
    s = askReducer(s, { type: "appendContent", text: "first " });
    s = askReducer(s, {
      type: "addToolStep",
      toolName: "search_all",
      args: { query: "q" },
    });
    s = askReducer(s, { type: "appendContent", text: "second" });
    const last = lastAssistant(s);
    expect(last.parts.map((p) => p.kind)).toEqual(["text", "tool", "text"]);
    const texts = last.parts
      .filter((p) => p.kind === "text")
      .map((p) => (p.kind === "text" ? p.content : ""));
    expect(texts).toEqual(["first ", "second"]);
    expect(assistantText(last)).toBe("first second");
  });

  it("completeToolStep fills resultCount on the newest pending tool part", () => {
    let s = freshAssistant();
    s = askReducer(s, {
      type: "addToolStep",
      toolName: "search_all",
      args: { query: "q" },
    });
    s = askReducer(s, {
      type: "completeToolStep",
      toolName: "search_all",
      resultCount: 7,
      payload: [
        {
          id: "d1",
          sourceType: "graypaper",
          preview: "prev",
          title: "T",
        },
      ],
    });
    const last = lastAssistant(s);
    const tool = last.parts[0];
    expect(tool.kind).toBe("tool");
    if (tool.kind === "tool") {
      expect(tool.resultCount).toBe(7);
    }
    // The payload is cached into state.cards by docId.
    expect(s.cards.d1).toMatchObject({
      docId: "d1",
      sourceType: "graypaper",
      title: "T",
      preview: "prev",
    });
  });

  it("addCitation appends to the assistant's citations list and skips duplicates", () => {
    let s = freshAssistant();
    s = askReducer(s, {
      type: "addCitation",
      n: 1,
      docId: "d1",
      sourceType: "graypaper",
    });
    s = askReducer(s, {
      type: "addCitation",
      n: 1,
      docId: "d1",
      sourceType: "graypaper",
    });
    const last = lastAssistant(s);
    expect(last.citations.length).toBe(1);
  });

  it("finishStreaming marks the last assistant message as done", () => {
    let s = freshAssistant();
    s = askReducer(s, { type: "finishStreaming" });
    expect(lastAssistant(s).isStreaming).toBe(false);
  });

  it("setError sets error and stops streaming on the last assistant message", () => {
    let s = freshAssistant();
    s = askReducer(s, { type: "setError", message: "boom" });
    const last = lastAssistant(s);
    expect(last.isStreaming).toBe(false);
    expect(last.error).toBe("boom");
  });

  it("setError stores errorKind when provided", () => {
    let s = freshAssistant();
    s = askReducer(s, {
      type: "setError",
      message: "No OpenRouter API key found. Add one in Settings to begin.",
      kind: "missingApiKey",
    });
    const last = lastAssistant(s);
    expect(last.error).toBe(
      "No OpenRouter API key found. Add one in Settings to begin."
    );
    expect(last.errorKind).toBe("missingApiKey");
    expect(last.isStreaming).toBe(false);
  });

  it("setError leaves errorKind undefined when kind is omitted", () => {
    let s = freshAssistant();
    s = askReducer(s, { type: "setError", message: "boom" });
    const last = lastAssistant(s);
    expect(last.error).toBe("boom");
    expect(last.errorKind).toBeUndefined();
  });

  it("setModel updates only the model field", () => {
    const s = askReducer(initialState, {
      type: "setModel",
      model: "openai/gpt-5",
    });
    expect(s.model).toBe("openai/gpt-5");
    expect(s.messages).toEqual(initialState.messages);
  });

  it("reset clears messages and cards but keeps the model", () => {
    let s = askReducer(initialState, {
      type: "setModel",
      model: "openai/gpt-5",
    });
    s = askReducer(s, { type: "sendUserMessage", text: "hi" });
    s = askReducer(s, { type: "reset" });
    expect(s.messages).toEqual([]);
    expect(s.cards).toEqual({});
    expect(s.model).toBe("openai/gpt-5");
  });
});

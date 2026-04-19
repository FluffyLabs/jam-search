import { describe, expect, it } from "vitest";
import { askReducer, initialState } from "../askReducer";

function freshAssistant(state = initialState) {
  // Helper: send a user message then an empty assistant placeholder.
  return askReducer(state, { type: "sendUserMessage", text: "hello" });
}

describe("askReducer", () => {
  it("sendUserMessage appends a user message and a streaming assistant message", () => {
    const next = askReducer(initialState, {
      type: "sendUserMessage",
      text: "hi",
    });
    expect(next.messages.length).toBe(2);
    expect(next.messages[0].role).toBe("user");
    expect(next.messages[0].content).toBe("hi");
    expect(next.messages[1].role).toBe("assistant");
    expect(next.messages[1].content).toBe("");
    expect((next.messages[1] as { isStreaming: boolean }).isStreaming).toBe(
      true
    );
  });

  it("appendContent adds to the last assistant message", () => {
    let s = freshAssistant();
    s = askReducer(s, { type: "appendContent", text: "foo" });
    s = askReducer(s, { type: "appendContent", text: "bar" });
    const last = s.messages[s.messages.length - 1];
    expect(last.content).toBe("foobar");
  });

  it("addToolStep appends a step with a client-generated id", () => {
    let s = freshAssistant();
    s = askReducer(s, {
      type: "addToolStep",
      toolName: "search_all",
      args: { query: "q" },
    });
    const last = s.messages[s.messages.length - 1] as {
      toolSteps: { toolName: string; id: string }[];
    };
    expect(last.toolSteps.length).toBe(1);
    expect(last.toolSteps[0].toolName).toBe("search_all");
    expect(last.toolSteps[0].id).toMatch(/\S/);
  });

  it("completeToolStep fills resultCount on the newest pending step", () => {
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
    const last = s.messages[s.messages.length - 1] as {
      toolSteps: { resultCount?: number }[];
    };
    expect(last.toolSteps[0].resultCount).toBe(7);
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
    const last = s.messages[s.messages.length - 1] as {
      citations: { n: number }[];
    };
    expect(last.citations.length).toBe(1);
  });

  it("finishStreaming marks the last assistant message as done", () => {
    let s = freshAssistant();
    s = askReducer(s, { type: "finishStreaming" });
    const last = s.messages[s.messages.length - 1] as {
      isStreaming: boolean;
    };
    expect(last.isStreaming).toBe(false);
  });

  it("setError sets error and stops streaming on the last assistant message", () => {
    let s = freshAssistant();
    s = askReducer(s, { type: "setError", message: "boom" });
    const last = s.messages[s.messages.length - 1] as {
      isStreaming: boolean;
      error?: string;
    };
    expect(last.isStreaming).toBe(false);
    expect(last.error).toBe("boom");
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

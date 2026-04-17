import { describe, expect, it, vi } from "vitest";
import { MAX_ITERATIONS, runAgentLoop } from "../../ask/agentLoop.js";
import type { AgentEvent } from "../../ask/types.js";
import { createSearchDB, insertDoc } from "../../data/searchIndex.js";

// Helper: build a fake OpenAI-shaped client whose chat.completions.create
// returns a scripted async iterable of Chat Completion chunks.
function fakeOpenAI(scripts: AsyncIterable<unknown>[]) {
  let i = 0;
  return {
    chat: {
      completions: {
        create: vi.fn(async () => scripts[i++]),
      },
    },
  };
}

async function* toAsyncIterable<T>(items: T[]): AsyncIterable<T> {
  for (const item of items) {
    yield item;
  }
}

async function collect(gen: AsyncGenerator<AgentEvent>): Promise<AgentEvent[]> {
  const out: AgentEvent[] = [];
  for await (const e of gen) out.push(e);
  return out;
}

describe("runAgentLoop", () => {
  it("emits content_delta then done for a direct answer (no tool calls)", async () => {
    const client = fakeOpenAI([
      toAsyncIterable([
        { choices: [{ delta: { content: "Hello" }, finish_reason: null }] },
        { choices: [{ delta: { content: " world" }, finish_reason: "stop" }] },
      ]),
    ]);
    const db = createSearchDB();

    const events = await collect(
      runAgentLoop({
        messages: [{ role: "user", content: "hi" }],
        model: "test-model",
        openai: client as never,
        db,
        dataDir: "./data",
      })
    );

    expect(events).toEqual([
      { type: "content_delta", text: "Hello" },
      { type: "content_delta", text: " world" },
      { type: "done" },
    ]);
  });

  it("executes a tool call and emits tool_call + tool_result", async () => {
    const db = createSearchDB();
    insertDoc(db, {
      type: "graypaper_section",
      title: "Accumulate",
      content: "Accumulate body",
    });

    const client = fakeOpenAI([
      // First stream: a single tool call request.
      toAsyncIterable([
        {
          choices: [
            {
              delta: {
                tool_calls: [
                  {
                    index: 0,
                    id: "call_1",
                    type: "function",
                    function: {
                      name: "search_all",
                      arguments: '{"query":"accumulate"}',
                    },
                  },
                ],
              },
              finish_reason: null,
            },
          ],
        },
        { choices: [{ delta: {}, finish_reason: "tool_calls" }] },
      ]),
      // Second stream: the final answer.
      toAsyncIterable([
        { choices: [{ delta: { content: "done." }, finish_reason: "stop" }] },
      ]),
    ]);

    const events = await collect(
      runAgentLoop({
        messages: [{ role: "user", content: "q" }],
        model: "test-model",
        openai: client as never,
        db,
        dataDir: "./data",
      })
    );

    expect(events[0]).toEqual({
      type: "tool_call",
      name: "search_all",
      args: { query: "accumulate" },
    });
    expect(events[1].type).toBe("tool_result");
    expect(events[1]).toMatchObject({ name: "search_all" });
    expect(events[2]).toEqual({ type: "content_delta", text: "done." });
    expect(events[3]).toEqual({ type: "done" });
  });

  it("parses <cite> tags out of streamed content and emits citation events", async () => {
    const client = fakeOpenAI([
      toAsyncIterable([
        {
          choices: [
            {
              delta: {
                content:
                  'pre <cite n="1" doc="abc" sourceType="graypaper" />[1] post',
              },
              finish_reason: "stop",
            },
          ],
        },
      ]),
    ]);

    const events = await collect(
      runAgentLoop({
        messages: [{ role: "user", content: "q" }],
        model: "test-model",
        openai: client as never,
        db: createSearchDB(),
        dataDir: "./data",
      })
    );

    const types = events.map((e) => e.type);
    expect(types).toContain("citation");
    expect(types).toContain("content_delta");
    const citation = events.find((e) => e.type === "citation");
    expect(citation).toMatchObject({
      type: "citation",
      n: 1,
      docId: "abc",
      sourceType: "graypaper",
    });
    // The <cite> tag must be stripped from visible text.
    const text = events
      .filter((e) => e.type === "content_delta")
      .map((e) => (e as { text: string }).text)
      .join("");
    expect(text).toBe("pre [1] post");
  });

  it("emits error when the client throws", async () => {
    const client = {
      chat: {
        completions: {
          create: vi.fn(async () => {
            throw new Error("invalid api key");
          }),
        },
      },
    };

    const events = await collect(
      runAgentLoop({
        messages: [{ role: "user", content: "q" }],
        model: "test-model",
        openai: client as never,
        db: createSearchDB(),
        dataDir: "./data",
      })
    );

    expect(events.find((e) => e.type === "error")).toMatchObject({
      type: "error",
      message: expect.stringContaining("invalid api key"),
    });
  });

  it("stops after MAX_ITERATIONS and emits error event", async () => {
    const db = createSearchDB();

    const makeToolCallStream = () =>
      toAsyncIterable([
        {
          choices: [
            {
              delta: {
                tool_calls: [
                  {
                    index: 0,
                    id: "call_x",
                    type: "function",
                    function: {
                      name: "search_all",
                      arguments: '{"query":"x"}',
                    },
                  },
                ],
              },
              finish_reason: null,
            },
          ],
        },
        { choices: [{ delta: {}, finish_reason: "tool_calls" }] },
      ]);

    const scripts = Array.from({ length: MAX_ITERATIONS + 1 }, () =>
      makeToolCallStream()
    );
    const client = fakeOpenAI(scripts);

    const events = await collect(
      runAgentLoop({
        messages: [{ role: "user", content: "q" }],
        model: "test-model",
        openai: client as never,
        db,
        dataDir: "./data",
      })
    );

    const errorEvt = events.find((e) => e.type === "error");
    expect(errorEvt).toBeDefined();
    expect((errorEvt as { message: string }).message).toMatch(
      /exceeded.*iterations/i
    );
  });
});

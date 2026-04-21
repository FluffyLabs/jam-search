import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the openrouter factory so the app uses our fake client.
const createMock = vi.fn();
vi.mock("../../ask/openrouter.js", () => ({
  createOpenRouterClient: () => ({
    chat: { completions: { create: createMock } },
  }),
}));

import { createApp } from "../../api.js";
import { createSearchDB, insertDoc } from "../../data/searchIndex.js";

async function* asyncIter<T>(items: T[]): AsyncIterable<T> {
  for (const item of items) yield item;
}

async function readSSE(
  body: ReadableStream<Uint8Array>
): Promise<Array<{ event: string; data: unknown }>> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  const out: Array<{ event: string; data: unknown }> = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value);
    const frames = buf.split("\n\n");
    buf = frames.pop() ?? "";
    for (const frame of frames) {
      const lines = frame.split("\n");
      let event = "message";
      let data = "";
      for (const line of lines) {
        if (line.startsWith("event:")) event = line.slice(6).trim();
        else if (line.startsWith("data:")) data += line.slice(5).trim();
      }
      if (data) out.push({ event, data: JSON.parse(data) });
    }
  }
  return out;
}

describe("POST /ask", () => {
  beforeEach(() => {
    createMock.mockReset();
  });

  it("streams tool_call → tool_result → content_delta → done", async () => {
    const db = createSearchDB();
    insertDoc(db, {
      type: "graypaper_section",
      title: "Accumulate",
      content: "Accumulate body",
    });

    // Script two completions: first calls search_all, second produces the answer.
    createMock
      .mockReturnValueOnce(
        asyncIter([
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
        ])
      )
      .mockReturnValueOnce(
        asyncIter([
          {
            choices: [
              { delta: { content: "Here you go." }, finish_reason: "stop" },
            ],
          },
        ])
      );

    const app = createApp(db, "./data");

    const res = await app.request("/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        messages: [{ role: "user", content: "How does accumulate work?" }],
        model: "test-model",
        openrouterKey: "sk-test",
      }),
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toMatch(/text\/event-stream/);
    expect(res.body).not.toBeNull();
    const events = await readSSE(res.body as ReadableStream<Uint8Array>);

    const names = events.map((e) => e.event);
    expect(names[0]).toBe("tool_call");
    expect(names).toContain("tool_result");
    expect(names).toContain("content_delta");
    expect(names[names.length - 1]).toBe("done");
  });

  it("rejects missing fields with 400", async () => {
    const db = createSearchDB();
    const app = createApp(db, "./data");
    const res = await app.request("/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ messages: [] }),
    });
    expect(res.status).toBe(400);
  });
});

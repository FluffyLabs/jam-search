import type OpenAI from "openai";
import type { SearchDB } from "../data/searchIndex.js";
import { createCiteParser } from "./citations.js";
import { SYSTEM_PROMPT } from "./systemPrompt.js";
import {
  executeGetFullDocument,
  executeSearchAll,
  TOOL_DEFINITIONS,
} from "./tools.js";
import type { AgentEvent, ChatMessage } from "./types.js";

export const MAX_ITERATIONS = 20;

export interface AgentLoopParams {
  messages: ChatMessage[];
  model: string;
  openai: OpenAI;
  db: SearchDB;
  dataDir: string;
}

interface AccumulatedToolCall {
  index: number;
  id: string;
  name: string;
  arguments: string;
}

export async function* runAgentLoop(
  params: AgentLoopParams
): AsyncGenerator<AgentEvent> {
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_PROMPT },
    ...params.messages,
  ];

  let iterations = 0;
  try {
    while (true) {
      iterations++;
      if (iterations > MAX_ITERATIONS) {
        yield {
          type: "error",
          message: `Agent loop exceeded ${MAX_ITERATIONS} iterations. Aborting to prevent runaway costs.`,
        };
        return;
      }

      const stream = await params.openai.chat.completions.create({
        model: params.model,
        messages: messages as never,
        tools: TOOL_DEFINITIONS as never,
        stream: true,
      });

      const assistantContent: string[] = [];
      const toolCallsByIndex = new Map<number, AccumulatedToolCall>();
      const citeParser = createCiteParser();

      for await (const chunk of stream as AsyncIterable<{
        choices: Array<{
          delta: {
            content?: string;
            tool_calls?: Array<{
              index: number;
              id?: string;
              type?: string;
              function?: { name?: string; arguments?: string };
            }>;
          };
          finish_reason: string | null;
        }>;
      }>) {
        const choice = chunk.choices?.[0];
        if (!choice) continue;
        const delta = choice.delta;

        if (delta.content) {
          assistantContent.push(delta.content);
          const parsed = citeParser.feed(delta.content);
          for (const cite of parsed.citations) {
            yield {
              type: "citation",
              n: cite.n,
              docId: cite.docId,
              sourceType: cite.sourceType ?? "page",
            };
          }
          if (parsed.text) {
            yield { type: "content_delta", text: parsed.text };
          }
        }

        if (delta.tool_calls) {
          for (const tc of delta.tool_calls) {
            const existing = toolCallsByIndex.get(tc.index) ?? {
              index: tc.index,
              id: "",
              name: "",
              arguments: "",
            };
            if (tc.id) existing.id = tc.id;
            if (tc.function?.name) existing.name = tc.function.name;
            if (tc.function?.arguments)
              existing.arguments += tc.function.arguments;
            toolCallsByIndex.set(tc.index, existing);
          }
        }
      }

      // Flush any buffered cite-parser text.
      const flushed = citeParser.flush();
      if (flushed.text) {
        yield { type: "content_delta", text: flushed.text };
      }

      const toolCalls = [...toolCallsByIndex.values()].sort(
        (a, b) => a.index - b.index
      );

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: assistantContent.join(""),
        ...(toolCalls.length > 0 && {
          tool_calls: toolCalls.map((tc) => ({
            id: tc.id,
            type: "function" as const,
            function: { name: tc.name, arguments: tc.arguments },
          })),
        }),
      };
      messages.push(assistantMsg);

      if (toolCalls.length === 0) {
        yield { type: "done" };
        return;
      }

      for (const tc of toolCalls) {
        const args = safeJsonParse(tc.arguments);
        yield { type: "tool_call", name: tc.name, args };

        const { resultCount, payload } = await executeToolByName(
          tc.name,
          args,
          params.db,
          params.dataDir
        );

        yield { type: "tool_result", name: tc.name, resultCount };
        messages.push({
          role: "tool",
          tool_call_id: tc.id,
          content: JSON.stringify(payload),
        });
      }
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    yield { type: "error", message };
  }
}

function safeJsonParse(s: string): unknown {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}

async function executeToolByName(
  name: string,
  args: unknown,
  db: SearchDB,
  dataDir: string
): Promise<{ resultCount: number; payload: unknown }> {
  const a = (args ?? {}) as Record<string, unknown>;
  if (name === "search_all") {
    const results = await executeSearchAll(
      { query: String(a.query ?? ""), limit: Number(a.limit ?? 10) || 10 },
      db,
      dataDir
    );
    return { resultCount: results.length, payload: results };
  }
  if (name === "get_full_document") {
    const doc = await executeGetFullDocument({ id: String(a.id ?? "") }, db);
    return { resultCount: doc ? 1 : 0, payload: doc ?? { error: "not found" } };
  }
  return {
    resultCount: 0,
    payload: { error: `unknown tool: ${name}` },
  };
}

import { type AgentEvent, assistantText, type ChatMessage } from "./askTypes";

export interface AskParams {
  messages: ChatMessage[];
  model: string;
  openrouterKey: string;
}

export interface AskStreamHandle {
  abort: () => void;
  done: Promise<void>;
}

interface ApiMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string;
}

const API_URL =
  (import.meta as unknown as { env: { VITE_API_URL?: string } }).env
    .VITE_API_URL ?? "https://search-api.fluffylabs.dev";

function getApiUrl(): string {
  return window.localStorage.getItem("API_URL") ?? API_URL;
}

/**
 * Parses an SSE buffer into a list of complete events plus a remainder.
 * Frame format: one or more `event: <name>\n` and `data: <json>\n` lines,
 * terminated by a blank line (`\n\n`).
 *
 * The frontend only cares about the `data:` JSON; we ignore the `event:` line
 * because the JSON is self-describing via its `type` field.
 */
export function parseSseBuffer(buffer: string): {
  events: AgentEvent[];
  remainder: string;
} {
  const parts = buffer.split("\n\n");
  const remainder = parts.pop() ?? "";
  const events: AgentEvent[] = [];
  for (const frame of parts) {
    let data = "";
    for (const line of frame.split("\n")) {
      if (line.startsWith("data:")) data += line.slice(5).trim();
    }
    if (!data) continue;
    try {
      const parsed = JSON.parse(data) as AgentEvent;
      events.push(parsed);
    } catch {
      // Ignore malformed frames.
    }
  }
  return { events, remainder };
}

/**
 * Strip UI-only fields from chat messages before sending to the backend.
 * Backend expects `{ role, content }` only.
 */
function toApiMessages(messages: ChatMessage[]): ApiMessage[] {
  return messages.map((m) => ({
    role: m.role,
    content: m.role === "assistant" ? assistantText(m) : m.content,
  }));
}

/**
 * POST /ask and stream AgentEvents via the onEvent callback.
 * The returned handle has an `abort()` method for cancellation and a `done`
 * promise that resolves when the stream ends normally (or rejects on error).
 */
export function askStream(
  params: AskParams,
  onEvent: (event: AgentEvent) => void
): AskStreamHandle {
  const controller = new AbortController();

  const done = (async () => {
    try {
      const res = await fetch(`${getApiUrl()}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: toApiMessages(params.messages),
          model: params.model,
          openrouterKey: params.openrouterKey,
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        onEvent({
          type: "error",
          message: `HTTP ${res.status}: ${text || res.statusText}`,
        });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done: streamDone } = await reader.read();
        if (streamDone) break;
        buffer += decoder.decode(value, { stream: true });
        const { events, remainder } = parseSseBuffer(buffer);
        buffer = remainder;
        for (const e of events) onEvent(e);
      }

      // Final flush
      buffer += decoder.decode();
      if (buffer.length > 0) {
        const { events } = parseSseBuffer(`${buffer}\n\n`);
        for (const e of events) onEvent(e);
      }
    } catch (err) {
      // Aborts are expected (user navigated, clicked New chat, or closed the tab)
      // — don't surface them as errors.
      if (err instanceof DOMException && err.name === "AbortError") return;
      onEvent({
        type: "error",
        message: err instanceof Error ? err.message : String(err),
      });
    }
  })();

  return { abort: () => controller.abort(), done };
}

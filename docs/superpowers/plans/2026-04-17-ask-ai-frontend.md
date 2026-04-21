# Ask AI — Frontend Implementation Plan (Plan B)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the `/ask` React chat page that consumes the backend `POST /ask` SSE stream, streams agent work to the user with inline citation markers, reuses existing result-card UI for a right-side citations panel, and wires entry points from the home search form and results page.

**Architecture:** A two-column chat page at `/ask`: left column holds the streaming conversation with collapsible tool-step indicators and inline `[N]` citation markers; right column holds citation cards (reusing the generic `ResultCard` primitive with per-sourceType headers/footers). State lives in `sessionStorage` (ephemeral by tab). The SSE client uses `fetch` streaming (not `EventSource`, which can't POST).

Testable logic lives in pure reducers and parsers; components are thin JSX shells over that logic. No React Testing Library setup is needed.

**Tech Stack:** React 19, React Router 7 (HashRouter), Vitest, Tailwind v4, existing `@fluffylabs/shared-ui/supabase` for the user's OpenRouter key.

**Spec:** `docs/superpowers/specs/2026-04-17-ask-ai-agent-design.md`

**Plan A (Backend):** `docs/superpowers/plans/2026-04-17-ask-ai-backend.md` — already complete; this plan builds on it.

---

## File Structure

**New files (frontend):**

- `client/src/lib/askTypes.ts` — Frontend-side types that mirror the backend `AgentEvent` discriminated union plus UI-only types (`AskConversationState`, `AssistantMessage`, `ChatMessage`, `ToolStep`, `Citation`, `CitationCardData`).
- `client/src/lib/askClient.ts` — SSE consumer. Exposes `askStream(params, onEvent): AbortController` that POSTs to `/ask` and calls `onEvent(agentEvent)` per frame. Plus a pure `parseSseFrame(buffer)` helper that's unit tested.
- `client/src/lib/askReducer.ts` — Pure state reducer (`reducer(state, action) => state`) that drives the conversation state. This is the unit-testable core of `useAskConversation`.
- `client/src/lib/askMarkers.ts` — Pure helpers: `splitCitationMarkers(text)` turns `"prefix [1] middle [2] end"` into `["prefix ", {n:1}, " middle ", {n:2}, " end"]` so `<Message />` can render clickable markers.
- `client/src/lib/models.ts` — Curated OpenRouter model list (4 models; default `anthropic/claude-sonnet-4.5`).
- `client/src/hooks/useAskConversation.ts` — Thin `useReducer` wrapper that hydrates from / syncs to `sessionStorage`.
- `client/src/components/chat/ChatInput.tsx` — Textarea + submit button; Enter submits, Shift+Enter newlines.
- `client/src/components/chat/ModelPicker.tsx` — `DropdownMenu` over the curated models.
- `client/src/components/chat/ToolStep.tsx` — `▸ Searching graypaper…` collapsible row.
- `client/src/components/chat/Message.tsx` — Renders a `ChatMessage`. For assistant messages, renders tool steps + streamed content with clickable `[N]` markers.
- `client/src/components/chat/CitationCard.tsx` — Takes `{ citation, cardData }`, returns a `ResultCard` with a sourceType-appropriate header/footer.
- `client/src/components/chat/CitationsPanel.tsx` — Right-side panel. Renders one `CitationCard` per citation in the currently-focused assistant message.
- `client/src/pages/ask.tsx` — The page. Wires hook, SSE client, components together. Reads `?q=` from the URL and optionally auto-submits.
- `client/src/lib/__tests__/askClient.test.ts`
- `client/src/lib/__tests__/askReducer.test.ts`
- `client/src/lib/__tests__/askMarkers.test.ts`

**Modified files (frontend):**

- `client/src/lib/mode.ts` — Add `Ask = "ask"`.
- `client/src/App.tsx` — Register `<Route path="/ask" element={<AskPage />} />`.
- `client/src/components/SearchForm.tsx` — Add `SearchMode.Ask` to the `searchModes` dropdown; the submit handler routes to `/ask?q=...` with `autoSubmit=1` when that mode is selected.
- `client/src/pages/results.tsx` — Add an "Ask AI about these results" button in the `ResultHeader`.

**Modified files (backend):**

- `backend/src/ask/agentLoop.ts` — Extend the `tool_result` SSE payload to include the actual results (currently only `name` + `resultCount`). The frontend needs this data to render citation cards.
- `backend/src/ask/types.ts` — Update the `AgentEvent` type accordingly.
- `backend/src/__tests__/ask/agentLoop.test.ts` — Update the assertions that check the tool_result event.

---

## Task 1: Enrich the backend `tool_result` SSE event with its payload

**Why first:** The frontend needs search-result payloads (title, preview, url, sender, …) to render citation cards. The simplest path is to flow them through the existing `tool_result` SSE event. This is a tiny backend patch that unblocks everything downstream on the frontend.

**Files:**
- Modify: `backend/src/ask/types.ts`
- Modify: `backend/src/ask/agentLoop.ts`
- Modify: `backend/src/__tests__/ask/agentLoop.test.ts`
- Modify: `backend/src/__tests__/ask/ask.integration.test.ts`

- [ ] **Step 1: Update the `AgentEvent` type**

Open `backend/src/ask/types.ts`. Change the `tool_result` variant from:

```typescript
  | { type: "tool_result"; name: string; resultCount: number }
```

to:

```typescript
  | {
      type: "tool_result";
      name: string;
      resultCount: number;
      payload: unknown;
    }
```

- [ ] **Step 2: Include `payload` in the event yielded by the agent loop**

Open `backend/src/ask/agentLoop.ts`. Find the tool-result yield (inside the `for (const tc of toolCalls)` loop):

```typescript
yield { type: "tool_result", name: tc.name, resultCount };
```

Change to:

```typescript
yield { type: "tool_result", name: tc.name, resultCount, payload };
```

- [ ] **Step 3: Update the agentLoop test assertion**

In `backend/src/__tests__/ask/agentLoop.test.ts`, find the assertion in the "executes a tool call and emits tool_call + tool_result" test that reads:

```typescript
    expect(events[1]).toMatchObject({ name: "search_all" });
```

Replace with:

```typescript
    expect(events[1]).toMatchObject({
      type: "tool_result",
      name: "search_all",
      resultCount: expect.any(Number),
    });
    // payload must be present and non-null for search_all
    expect(
      (events[1] as { payload: unknown }).payload
    ).toBeDefined();
```

- [ ] **Step 4: Run tests**

```bash
cd backend && npm test
```

Expected: 38 tests still pass.

- [ ] **Step 5: Commit**

```bash
git add backend/src/ask/types.ts backend/src/ask/agentLoop.ts backend/src/__tests__/ask/agentLoop.test.ts
git commit -m "Include tool payload in tool_result SSE event"
```

---

## Task 2: Frontend testing baseline + shared types + model list + mode enum

**Files:**
- Create: `client/src/lib/askTypes.ts`
- Create: `client/src/lib/models.ts`
- Modify: `client/src/lib/mode.ts`

No test dependencies are added in this plan. The pure-function tests we write later (`askClient.test.ts`, `askReducer.test.ts`, `askMarkers.test.ts`) use only Vitest — which is already configured.

- [ ] **Step 1: Add `Ask` to the SearchMode enum**

Open `client/src/lib/mode.ts`. Replace contents with:

```typescript
export enum SearchMode {
  Regular = "regular",
  Extended = "extended",
  Ask = "ask",
}
```

- [ ] **Step 2: Create the shared frontend types**

Create `client/src/lib/askTypes.ts`:

```typescript
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

/** A tool step shown inline in an assistant message. */
export interface ToolStep {
  id: string; // unique client-side id for React keys
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
  content: string;
  toolSteps: ToolStep[];
  citations: Citation[];
  error?: string;
  isStreaming: boolean;
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
```

- [ ] **Step 3: Create the curated model list**

Create `client/src/lib/models.ts`:

```typescript
export interface ModelOption {
  id: string; // OpenRouter model id
  label: string;
}

/**
 * Curated list of OpenRouter models known to support tool use well.
 * Add or remove as needed; the first entry is the default.
 */
export const MODELS: ModelOption[] = [
  { id: "anthropic/claude-sonnet-4.5", label: "Claude Sonnet 4.5" },
  { id: "anthropic/claude-opus-4.5", label: "Claude Opus 4.5" },
  { id: "openai/gpt-5", label: "GPT-5" },
  { id: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro" },
];

export const DEFAULT_MODEL = MODELS[0].id;
```

- [ ] **Step 4: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: no errors. (If `mode.ts` is imported anywhere that uses exhaustive switches on `SearchMode`, those may need a new branch. The `SearchForm.tsx` switch is handled in Task 9.)

If typecheck fails on `SearchForm.tsx` because the `searchModes` array covers only Regular/Extended, that's expected — we'll fix it in Task 9. If it fails elsewhere, report and stop.

- [ ] **Step 5: Commit**

```bash
git add client/src/lib/askTypes.ts client/src/lib/models.ts client/src/lib/mode.ts
git commit -m "Add Ask AI frontend types, model list, and SearchMode.Ask"
```

---

## Task 3: SSE client for `/ask` — with tests

**Files:**
- Create: `client/src/lib/__tests__/askClient.test.ts`
- Create: `client/src/lib/askClient.ts`

The client uses `fetch` with streaming; it cannot use `EventSource` because we need POST. The tests exercise the pure frame parser, not the network fetch.

- [ ] **Step 1: Write failing tests for the pure frame parser**

Create `client/src/lib/__tests__/askClient.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { parseSseBuffer } from "../askClient";

describe("parseSseBuffer", () => {
  it("returns no events when buffer contains only an incomplete frame", () => {
    const { events, remainder } = parseSseBuffer(
      "event: tool_call\ndata: {\"type\":\"too"
    );
    expect(events).toEqual([]);
    expect(remainder).toBe('event: tool_call\ndata: {"type":"too');
  });

  it("parses a single complete frame", () => {
    const { events, remainder } = parseSseBuffer(
      'event: done\ndata: {"type":"done"}\n\n'
    );
    expect(events).toEqual([{ type: "done" }]);
    expect(remainder).toBe("");
  });

  it("parses multiple frames in one buffer", () => {
    const buf =
      'event: content_delta\ndata: {"type":"content_delta","text":"a"}\n\n' +
      'event: content_delta\ndata: {"type":"content_delta","text":"b"}\n\n';
    const { events, remainder } = parseSseBuffer(buf);
    expect(events).toEqual([
      { type: "content_delta", text: "a" },
      { type: "content_delta", text: "b" },
    ]);
    expect(remainder).toBe("");
  });

  it("keeps a trailing partial frame as remainder", () => {
    const buf =
      'event: content_delta\ndata: {"type":"content_delta","text":"a"}\n\n' +
      "event: content_delta\ndata: {\"type\":\"content_de";
    const { events, remainder } = parseSseBuffer(buf);
    expect(events).toEqual([{ type: "content_delta", text: "a" }]);
    expect(remainder).toBe(
      'event: content_delta\ndata: {"type":"content_de'
    );
  });

  it("ignores frames with no data line", () => {
    const { events, remainder } = parseSseBuffer(
      "event: done\n\n"
    );
    expect(events).toEqual([]);
    expect(remainder).toBe("");
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
cd client && npx vitest run askClient.test
```

Expected: FAIL — `parseSseBuffer` is not defined.

- [ ] **Step 3: Implement the SSE client**

Create `client/src/lib/askClient.ts`:

```typescript
import type { AgentEvent, ChatMessage } from "./askTypes";

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
  return messages.map((m) => ({ role: m.role, content: m.content }));
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
  })();

  return { abort: () => controller.abort(), done };
}
```

- [ ] **Step 4: Run the tests to confirm they pass**

```bash
cd client && npx vitest run askClient.test
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/lib/askClient.ts client/src/lib/__tests__/askClient.test.ts
git commit -m "Add Ask AI SSE client"
```

---

## Task 4: Conversation state reducer — with tests

**Files:**
- Create: `client/src/lib/__tests__/askReducer.test.ts`
- Create: `client/src/lib/askReducer.ts`

The reducer is the heart of the conversation state; it takes the current state plus an action and returns the next state. `useAskConversation` (next task) is a thin wrapper.

- [ ] **Step 1: Write failing tests**

Create `client/src/lib/__tests__/askReducer.test.ts`:

```typescript
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
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
cd client && npx vitest run askReducer.test
```

Expected: FAIL.

- [ ] **Step 3: Implement the reducer**

Create `client/src/lib/askReducer.ts`:

```typescript
import { DEFAULT_MODEL } from "./models";
import type {
  AskConversationState,
  AssistantMessage,
  CitationCardData,
  ChatMessage,
  SourceType,
  UserMessage,
} from "./askTypes";

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
  | { type: "setError"; message: string }
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
    channelName:
      typeof r.channelName === "string" ? r.channelName : undefined,
    roomName: typeof r.roomName === "string" ? r.roomName : undefined,
    timestamp:
      typeof r.timestamp === "number"
        ? r.timestamp
        : r.timestamp === null
          ? null
          : undefined,
  };
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
        content: "",
        toolSteps: [],
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
          content: m.content + action.text,
        })),
      };

    case "addToolStep":
      return {
        ...state,
        messages: mapLastAssistant(state.messages, (m) => ({
          ...m,
          toolSteps: [
            ...m.toolSteps,
            { id: nextId(), toolName: action.toolName, args: action.args },
          ],
        })),
      };

    case "completeToolStep": {
      const extracted = extractCards(action.payload);
      return {
        ...state,
        cards: { ...state.cards, ...extracted },
        messages: mapLastAssistant(state.messages, (m) => {
          // Find newest step matching toolName that has no resultCount yet.
          let patched = false;
          const steps = [...m.toolSteps];
          for (let i = steps.length - 1; i >= 0; i--) {
            if (steps[i].toolName === action.toolName && !patched) {
              steps[i] = { ...steps[i], resultCount: action.resultCount };
              patched = true;
              break;
            }
          }
          return { ...m, toolSteps: steps };
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
        })),
      };

    case "setModel":
      return { ...state, model: action.model };

    case "reset":
      return { ...initialState, model: state.model };
  }
}
```

- [ ] **Step 4: Run the tests to confirm they pass**

```bash
cd client && npx vitest run askReducer.test
```

Expected: PASS (9 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/lib/askReducer.ts client/src/lib/__tests__/askReducer.test.ts
git commit -m "Add Ask AI conversation reducer"
```

---

## Task 5: `useAskConversation` hook + citation-marker parser with tests

**Files:**
- Create: `client/src/lib/__tests__/askMarkers.test.ts`
- Create: `client/src/lib/askMarkers.ts`
- Create: `client/src/hooks/useAskConversation.ts`

Two small pieces bundled: the marker parser (pure, testable) and the hook (`useReducer` wrapper plus `sessionStorage` sync).

- [ ] **Step 1: Write failing tests for the marker parser**

Create `client/src/lib/__tests__/askMarkers.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { splitCitationMarkers } from "../askMarkers";

describe("splitCitationMarkers", () => {
  it("returns a single string when there are no markers", () => {
    expect(splitCitationMarkers("plain text")).toEqual(["plain text"]);
  });

  it("splits around a single marker", () => {
    expect(splitCitationMarkers("foo [1] bar")).toEqual([
      "foo ",
      { n: 1 },
      " bar",
    ]);
  });

  it("splits around multiple markers", () => {
    expect(splitCitationMarkers("a [1] b [2] c")).toEqual([
      "a ",
      { n: 1 },
      " b ",
      { n: 2 },
      " c",
    ]);
  });

  it("supports adjacent markers", () => {
    expect(splitCitationMarkers("foo [1][2]")).toEqual([
      "foo ",
      { n: 1 },
      { n: 2 },
    ]);
  });

  it("does not match markers with non-digit content", () => {
    expect(splitCitationMarkers("[foo] [1]")).toEqual([
      "[foo] ",
      { n: 1 },
    ]);
  });

  it("returns [] for empty string", () => {
    expect(splitCitationMarkers("")).toEqual([]);
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
cd client && npx vitest run askMarkers.test
```

Expected: FAIL.

- [ ] **Step 3: Implement the parser**

Create `client/src/lib/askMarkers.ts`:

```typescript
/**
 * Splits text into alternating strings and `[N]` citation marker objects.
 * Example: "foo [1] bar" -> ["foo ", { n: 1 }, " bar"]
 * Returns [] for empty input.
 */
export type MarkerNode = string | { n: number };

const MARKER_RE = /\[(\d+)\]/g;

export function splitCitationMarkers(text: string): MarkerNode[] {
  if (text.length === 0) return [];
  const nodes: MarkerNode[] = [];
  let last = 0;
  MARKER_RE.lastIndex = 0;
  for (;;) {
    const m = MARKER_RE.exec(text);
    if (!m) break;
    if (m.index > last) {
      nodes.push(text.slice(last, m.index));
    }
    nodes.push({ n: Number(m[1]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
cd client && npx vitest run askMarkers.test
```

Expected: PASS (6 tests).

- [ ] **Step 5: Create `useAskConversation` hook**

Create `client/src/hooks/useAskConversation.ts`:

```typescript
import { useEffect, useReducer, useRef } from "react";
import type { AskConversationState } from "@/lib/askTypes";
import { askReducer, initialState } from "@/lib/askReducer";

const STORAGE_KEY = "ask-conversation";

function hydrate(): AskConversationState {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as AskConversationState;
    if (!parsed || typeof parsed !== "object") return initialState;
    return {
      messages: Array.isArray(parsed.messages) ? parsed.messages : [],
      cards: parsed.cards ?? {},
      model: typeof parsed.model === "string" ? parsed.model : initialState.model,
    };
  } catch {
    return initialState;
  }
}

export function useAskConversation() {
  const [state, dispatch] = useReducer(askReducer, undefined, hydrate);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage may be full or disabled; fail silently.
    }
  }, [state]);

  return { state, dispatch };
}
```

- [ ] **Step 6: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: clean.

- [ ] **Step 7: Commit**

```bash
git add client/src/lib/askMarkers.ts client/src/lib/__tests__/askMarkers.test.ts client/src/hooks/useAskConversation.ts
git commit -m "Add citation-marker parser and useAskConversation hook"
```

---

## Task 6: Chat primitives — ChatInput, ModelPicker, ToolStep

**Files:**
- Create: `client/src/components/chat/ChatInput.tsx`
- Create: `client/src/components/chat/ModelPicker.tsx`
- Create: `client/src/components/chat/ToolStep.tsx`

These are small presentational components. No unit tests — they're thin shells. Manual QA in Task 11 covers them.

- [ ] **Step 1: Create `ChatInput.tsx`**

```typescript
import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (text: string) => void;
}

export function ChatInput({
  initialValue = "",
  placeholder = "Ask a follow-up…",
  disabled,
  onSubmit,
}: ChatInputProps) {
  const [value, setValue] = useState(initialValue);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue("");
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
        rows={2}
      />
      <Button onClick={submit} disabled={disabled || value.trim() === ""}>
        Ask
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Create `ModelPicker.tsx`**

```typescript
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MODELS } from "@/lib/models";

interface ModelPickerProps {
  value: string;
  onChange: (modelId: string) => void;
}

export function ModelPicker({ value, onChange }: ModelPickerProps) {
  const current = MODELS.find((m) => m.id === value) ?? MODELS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          Model: {current.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>OpenRouter model</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {MODELS.map((m) => (
          <DropdownMenuItem key={m.id} onClick={() => onChange(m.id)}>
            {m.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

- [ ] **Step 3: Create `ToolStep.tsx`**

```typescript
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ToolStep as ToolStepType } from "@/lib/askTypes";

interface ToolStepProps {
  step: ToolStepType;
}

export function ToolStep({ step }: ToolStepProps) {
  const [open, setOpen] = useState(false);
  const pending = step.resultCount === undefined;
  const label = pending
    ? `Calling ${step.toolName}…`
    : `${step.toolName}: ${step.resultCount} result${
        step.resultCount === 1 ? "" : "s"
      }`;

  return (
    <div className="text-xs text-muted-foreground">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 hover:text-foreground transition-colors",
          pending && "animate-pulse"
        )}
      >
        <span>{open ? "▾" : "▸"}</span>
        <span>{label}</span>
      </button>
      {open && (
        <pre className="mt-1 ml-4 p-2 rounded bg-muted text-[10px] overflow-x-auto">
          {JSON.stringify(step.args, null, 2)}
        </pre>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/chat/
git commit -m "Add chat primitives: ChatInput, ModelPicker, ToolStep"
```

---

## Task 7: CitationCard and CitationsPanel

**Files:**
- Create: `client/src/components/chat/CitationCard.tsx`
- Create: `client/src/components/chat/CitationsPanel.tsx`

`CitationCard` is a single card wrapping the existing generic `ResultCard` with a sourceType-appropriate header/footer. `CitationsPanel` renders a list of them for the active assistant message.

- [ ] **Step 1: Create `CitationCard.tsx`**

```typescript
import { ResultCard } from "@/components/results/ResultCard";
import { formatDate } from "@/lib/utils";
import type { Citation, CitationCardData } from "@/lib/askTypes";

interface CitationCardProps {
  citation: Citation;
  card?: CitationCardData;
}

export function CitationCard({ citation, card }: CitationCardProps) {
  const header = (
    <div className="flex items-baseline justify-between gap-2">
      <span className="font-mono text-xs text-muted-foreground">
        [{citation.n}]
      </span>
      <span className="flex-1 truncate">
        {renderHeader(citation, card)}
      </span>
    </div>
  );

  const content = (
    <div className="whitespace-pre-wrap">
      {card?.preview ?? "Loading card data…"}
    </div>
  );

  const footer = renderFooter(citation, card);

  return (
    <div id={`citation-${citation.n}`}>
      <ResultCard header={header} content={content} footer={footer} />
    </div>
  );
}

function renderHeader(
  citation: Citation,
  card: CitationCardData | undefined
): React.ReactNode {
  if (!card) return capitalize(citation.sourceType);
  switch (citation.sourceType) {
    case "graypaper":
      return card.title ?? "Graypaper section";
    case "page":
      return card.title ?? card.url ?? "Page";
    case "discord":
      return `${card.sender ?? "discord"}${
        card.channelName ? ` · #${card.channelName}` : ""
      }`;
    case "matrix":
      return `${card.sender ?? "matrix"}${
        card.roomName ? ` · ${card.roomName}` : ""
      }`;
  }
}

function renderFooter(
  citation: Citation,
  card: CitationCardData | undefined
): React.ReactNode {
  const badge = (
    <span className="uppercase tracking-wide text-[10px] text-muted-foreground">
      {citation.sourceType}
    </span>
  );
  if (!card) return badge;
  if (card.url) {
    return (
      <div className="flex items-center justify-between w-full">
        {badge}
        <a
          href={card.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          View source ↗
        </a>
      </div>
    );
  }
  if (card.timestamp) {
    return (
      <div className="flex items-center justify-between w-full">
        {badge}
        <span className="text-xs text-muted-foreground">
          {formatDate(new Date(card.timestamp).toISOString())}
        </span>
      </div>
    );
  }
  return badge;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
```

- [ ] **Step 2: Create `CitationsPanel.tsx`**

```typescript
import { CitationCard } from "./CitationCard";
import type { AssistantMessage, CitationCardData } from "@/lib/askTypes";

interface CitationsPanelProps {
  assistant: AssistantMessage | undefined;
  cards: Record<string, CitationCardData>;
}

export function CitationsPanel({ assistant, cards }: CitationsPanelProps) {
  if (!assistant || assistant.citations.length === 0) {
    return (
      <div className="text-sm text-muted-foreground p-4">
        Sources will appear here as the agent cites them.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3 p-4">
      {assistant.citations.map((c) => (
        <CitationCard
          key={c.n}
          citation={c}
          card={cards[c.docId]}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/chat/CitationCard.tsx client/src/components/chat/CitationsPanel.tsx
git commit -m "Add CitationCard and CitationsPanel"
```

---

## Task 8: Message component

**Files:**
- Create: `client/src/components/chat/Message.tsx`

Renders one `ChatMessage`. For assistant messages: tool steps + streamed text with clickable `[N]` markers. Clicking a marker scrolls the citations panel to the corresponding card via `#citation-<n>` anchor.

- [ ] **Step 1: Create `Message.tsx`**

```typescript
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import { splitCitationMarkers } from "@/lib/askMarkers";
import type { ChatMessage } from "@/lib/askTypes";
import { ToolStep } from "./ToolStep";

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-xl bg-primary text-primary-foreground px-4 py-2 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  const nodes = splitCitationMarkers(message.content);

  return (
    <div className="flex flex-col gap-2">
      {message.toolSteps.map((step) => (
        <ToolStep key={step.id} step={step} />
      ))}
      <div
        className={cn(
          "prose prose-sm max-w-none whitespace-pre-wrap",
          message.isStreaming && "after:content-['▋'] after:animate-pulse"
        )}
      >
        {nodes.map((node, idx) =>
          typeof node === "string" ? (
            <Fragment key={idx}>{node}</Fragment>
          ) : (
            <CitationRef key={idx} n={node.n} />
          )
        )}
      </div>
      {message.error && (
        <div className="rounded border border-destructive/40 bg-destructive/10 text-destructive text-sm p-2">
          {message.error}
        </div>
      )}
    </div>
  );
}

function CitationRef({ n }: { n: number }) {
  return (
    <a
      href={`#citation-${n}`}
      className="font-mono text-xs px-1 rounded bg-accent text-accent-foreground hover:underline"
      onClick={(e) => {
        e.preventDefault();
        const el = document.getElementById(`citation-${n}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }}
    >
      [{n}]
    </a>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/chat/Message.tsx
git commit -m "Add Message component with inline citation markers"
```

---

## Task 9: Ask page + route registration + SearchForm mode integration

**Files:**
- Create: `client/src/pages/ask.tsx`
- Modify: `client/src/App.tsx`
- Modify: `client/src/components/SearchForm.tsx`

This task assembles the Ask page, registers its route, and wires the home SearchForm's third mode to navigate here.

- [ ] **Step 1: Create the Ask page**

Create `client/src/pages/ask.tsx`:

```typescript
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useUserData } from "@fluffylabs/shared-ui/supabase";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/chat/ChatInput";
import { CitationsPanel } from "@/components/chat/CitationsPanel";
import { Message } from "@/components/chat/Message";
import { ModelPicker } from "@/components/chat/ModelPicker";
import { useAskConversation } from "@/hooks/useAskConversation";
import { askStream } from "@/lib/askClient";
import type { AssistantMessage } from "@/lib/askTypes";

export function AskPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const initialQuery = searchParams.get("q") ?? "";
  const autoSubmit = searchParams.get("autoSubmit") === "1";

  const { state, dispatch } = useAskConversation();
  const { data: keyData, isLoading: keyLoading } = useUserData(
    "openrouter-api-key",
    { appScoped: true }
  );

  const streamHandleRef = useRef<{ abort: () => void } | null>(null);
  const hasAutoSubmittedRef = useRef(false);

  const send = (text: string) => {
    if (keyLoading) return;
    const apiKey =
      typeof keyData === "string" && keyData.trim() !== "" ? keyData : null;
    if (!apiKey) {
      dispatch({ type: "sendUserMessage", text });
      dispatch({
        type: "setError",
        message:
          "No OpenRouter API key found. Please add one in Settings.",
      });
      return;
    }

    dispatch({ type: "sendUserMessage", text });

    const nextMessages = [
      ...state.messages,
      { id: "pending", role: "user" as const, content: text },
    ];

    streamHandleRef.current = askStream(
      {
        messages: nextMessages,
        model: state.model,
        openrouterKey: apiKey,
      },
      (event) => {
        switch (event.type) {
          case "tool_call":
            dispatch({
              type: "addToolStep",
              toolName: event.name,
              args: event.args,
            });
            break;
          case "tool_result":
            dispatch({
              type: "completeToolStep",
              toolName: event.name,
              resultCount: event.resultCount,
              payload: event.payload,
            });
            break;
          case "content_delta":
            dispatch({ type: "appendContent", text: event.text });
            break;
          case "citation":
            dispatch({
              type: "addCitation",
              n: event.n,
              docId: event.docId,
              sourceType: event.sourceType,
            });
            break;
          case "done":
            dispatch({ type: "finishStreaming" });
            break;
          case "error":
            dispatch({ type: "setError", message: event.message });
            break;
        }
      }
    );
  };

  // Auto-submit once if ?q is set and ?autoSubmit=1.
  useEffect(() => {
    if (
      autoSubmit &&
      initialQuery &&
      !hasAutoSubmittedRef.current &&
      !keyLoading
    ) {
      hasAutoSubmittedRef.current = true;
      send(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSubmit, initialQuery, keyLoading]);

  useEffect(() => {
    return () => {
      streamHandleRef.current?.abort();
    };
  }, []);

  const lastAssistant = [...state.messages]
    .reverse()
    .find((m): m is AssistantMessage => m.role === "assistant");

  const streaming = lastAssistant?.isStreaming === true;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between gap-2">
        <ModelPicker
          value={state.model}
          onChange={(m) => dispatch({ type: "setModel", model: m })}
        />
        <div className="flex gap-2">
          {state.messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "reset" })}
            >
              New chat
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/settings")}
          >
            Settings
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_24rem] gap-4 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-y-auto p-2">
          {state.messages.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Ask a question about the JAM protocol. The agent will search the
              knowledge base (graypaper, Discord, Matrix, pages) and cite its
              sources on the right.
            </div>
          )}
          {state.messages.map((m) => (
            <Message key={m.id} message={m} />
          ))}
        </div>
        <div className="border-l border-border overflow-y-auto max-md:hidden">
          <CitationsPanel assistant={lastAssistant} cards={state.cards} />
        </div>
      </div>

      <ChatInput
        initialValue={autoSubmit ? "" : initialQuery}
        disabled={streaming || keyLoading}
        onSubmit={send}
      />
    </div>
  );
}
```

- [ ] **Step 2: Register the `/ask` route in `App.tsx`**

Open `client/src/App.tsx`. Add an import near the other page imports:

```typescript
import { AskPage } from "./pages/ask";
```

Inside the `<Routes>` block, add (e.g., after the existing `/settings` route):

```typescript
                <Route path="/ask" element={<AskPage />} />
```

- [ ] **Step 3: Add "Ask AI" to the `SearchForm` mode dropdown**

Open `client/src/components/SearchForm.tsx`.

a) In the `searchModes` array (around line 29), add a third entry. You'll need to pick an icon from `lucide-react` — `MessageCircle` is a good fit and is commonly available:

```typescript
import { Search, Sparkles, MessageCircle } from "lucide-react";
```

Then update `searchModes`:

```typescript
const searchModes = [
  {
    id: SearchMode.Regular,
    label: "Regular Search",
    icon: Search,
    description: "Look for phrase in content.",
  },
  {
    id: SearchMode.Extended,
    label: "Extended Search",
    icon: Sparkles,
    description: "Find semantically similar text.",
  },
  {
    id: SearchMode.Ask,
    label: "Ask AI",
    icon: MessageCircle,
    description: "Let an AI agent answer using all sources.",
  },
];
```

b) In the `handleSubmit` function, branch on `SearchMode.Ask` to route to `/ask` with `autoSubmit=1`:

```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!searchQuery.trim()) return;

  if (searchMode === SearchMode.Ask) {
    const params = new URLSearchParams();
    params.set("q", searchQuery);
    params.set("autoSubmit", "1");
    navigate(`/ask?${params.toString()}`);
    return;
  }

  const queryParams = getQueryParams();
  navigate(
    `${
      redirectToResults ? "/results" : location.pathname
    }?${queryParams.toString()}`
  );
};
```

c) The existing `isInstantSearch` helper should NOT treat Ask mode as instant:

```typescript
const isInstantSearch = (searchMode: string, enabled: boolean) => {
  return searchMode === SearchMode.Regular && enabled;
};
```

Already returns false for Ask — no change needed. Just verify by reading.

- [ ] **Step 4: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add client/src/pages/ask.tsx client/src/App.tsx client/src/components/SearchForm.tsx
git commit -m "Add /ask page, register route, wire SearchForm Ask mode"
```

---

## Task 10: "Ask AI about these results" pivot on the results page

**Files:**
- Modify: `client/src/pages/results.tsx`

The spec requires this entry point to **pre-fill** the chat input (no auto-submit). So the target URL omits `autoSubmit`.

- [ ] **Step 1: Add the button to the `ResultHeader` area**

Open `client/src/pages/results.tsx`. Near the existing `ResultHeader` usage (around line 125), add an "Ask AI" button. Import what you need at the top:

```typescript
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
```

Find the `ResultHeader` block and extend its `left` prop so the button appears next to the source multi-select. If that makes the header too crowded, add it as a new element above the results (a sticky row or just above the source filter). The cleanest approach on wide screens is to include it inside the `left` slot:

```typescript
<ResultHeader
  left={
    <div className="flex items-center gap-2">
      <div className="flex items-center bg-card/80 border border-border rounded-md">
        <MultiSelect
          options={SOURCE_OPTIONS}
          selectedValues={selectedSources}
          onValueChange={handleSourceChange}
          placeholder="Select sources"
          maxCount={0}
          required
        />
      </div>
      {richQuery && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const params = new URLSearchParams();
            params.set("q", richQuery);
            navigate(`/ask?${params.toString()}`);
          }}
        >
          <MessageCircle className="h-4 w-4 mr-1" />
          Ask AI about these results
        </Button>
      )}
    </div>
  }
  showSearchOptions={
    selectedSources.length === 1 && selectedSources[0] === Source.Matrix
  }
/>
```

If `navigate` isn't already imported, it should be (the existing file uses `useNavigate()`). If not, import `useNavigate` from `react-router-dom` and call `const navigate = useNavigate();` at the top of the component.

- [ ] **Step 2: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: clean.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/results.tsx
git commit -m "Add 'Ask AI about these results' pivot button on results page"
```

---

## Task 11: Manual QA checkpoint

- [ ] **Step 1: Ensure the backend is running and reachable**

In one terminal:
```bash
cd backend && npm run dev
```

In another:
```bash
cd client && npm run dev
```

Ensure the client's `VITE_API_URL` points to your local backend (default is production — you may need a `.env.local` with `VITE_API_URL=http://localhost:3000` or set `API_URL` in localStorage via the browser devtools).

- [ ] **Step 2: Sign in and add an OpenRouter key (if not done already)**

Navigate to `/settings`, sign in if needed, paste your OpenRouter `sk-or-...` key, save.

- [ ] **Step 3: Home-page entry point — Ask AI mode**

- From the home page, switch the search-mode dropdown to "Ask AI".
- Type a question (e.g., "How does the accumulate function work in JAM?").
- Submit. You should be routed to `/ask?q=…&autoSubmit=1` and the agent should start working immediately.
- Verify: tool-step indicators appear, text streams in, `[N]` markers appear, citation cards appear in the right panel.
- Click `[1]`: the panel should scroll the corresponding card into view.

- [ ] **Step 4: Results-page pivot**

- From the home page, do a regular search (e.g., "validator").
- On the results page, click "Ask AI about these results".
- You should land on `/ask?q=validator` with the question pre-filled in the input and NO auto-submit.
- Edit the question if desired, submit, verify streaming works.

- [ ] **Step 5: Error path**

- Go to `/settings`, clear the API key, save.
- Return to `/ask` and submit any question.
- Verify: an error message appears under the assistant placeholder pointing to Settings.

- [ ] **Step 6: Multi-turn conversation**

- After a successful answer, type a follow-up question in the input and submit.
- Verify: the agent sees the prior turn (it may or may not search again; the important thing is it doesn't error or lose context).

- [ ] **Step 7: Model picker**

- Click the model dropdown at the top of `/ask`.
- Pick a different model.
- Submit a new question.
- Verify: that model is used (check the network tab for the `model` field in the POST body).

- [ ] **Step 8: Session persistence**

- In `/ask`, mid-conversation, refresh the tab.
- Verify: the conversation is still there (sessionStorage preserved).
- Close the tab and open a new one to `/ask`.
- Verify: the new tab starts fresh (sessionStorage is per-tab).

- [ ] **Step 9: Mobile / narrow viewport**

- Shrink the window or use device emulation.
- Below the `md` breakpoint, the citations panel should hide.
- (Drawer-style access to sources from mobile is deferred — citations remain accessible only on wide screens in v1. If the user flags this as needed, follow up.)

No commit — this is a gate. File issues for any bugs found; fix before merging the branch.

---

## Summary

After this plan:
- The `/ask` route is live with a two-column chat UI.
- The agent's work streams to the user live, with collapsible tool steps and inline `[N]` markers.
- Citation cards on the right reuse the existing `ResultCard` primitive with per-sourceType headers/footers.
- Two entry points exist: "Ask AI" mode on the home SearchForm (auto-submits) and "Ask AI about these results" on the results page (pre-fills only).
- Conversation state persists across reloads within a tab via `sessionStorage`.
- The user's OpenRouter key is read from existing Supabase user data via `useUserData`.

**Deferred to follow-ups:**
- React Testing Library setup and component render tests.
- Mobile drawer for the citations panel.
- Header nav entry point (requires changes to the external `@fluffylabs/shared-ui` package).
- Markdown rendering inside streamed answers (currently plain text + citation markers).
- Scroll-pinning / auto-scroll behavior tweaks.
- Multi-turn citation handling. The `CitationsPanel` shows only the latest assistant message's citations. In multi-turn chats, clicking `[N]` inside an older message will scroll to the current panel's card with that number (which is likely a different source). Fixing this requires either per-message citation sections in the panel or a "focused turn" concept — both are UX decisions worth revisiting after real usage.

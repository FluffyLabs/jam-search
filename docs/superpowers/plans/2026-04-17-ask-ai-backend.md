# Ask AI — Backend Implementation Plan (Plan A)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the backend `POST /ask` endpoint with an agentic RAG loop that streams answers via SSE, and remove the MCP server that this replaces.

**Architecture:** A new Hono endpoint accepts `{ messages, model, openrouterKey }`, runs an agent loop that calls OpenRouter (OpenAI-compatible API) with two tools (`search_all`, `get_full_document`) against the existing Orama index, and streams both intermediate steps (tool calls, tool results) and the final answer text back as Server-Sent Events. The loop is bounded only by the model's own `finish_reason === "stop"`.

**Tech Stack:** Hono, Orama, the existing `openai` SDK (pointed at `https://openrouter.ai/api/v1`), Zod, Vitest.

**Spec:** `docs/superpowers/specs/2026-04-17-ask-ai-agent-design.md`

---

## File Structure

**New files:**
- `backend/src/ask/types.ts` — shared TypeScript types (chat messages, agent events, tool definitions).
- `backend/src/ask/tools.ts` — tool definitions (OpenAI JSON-schema format) and executors (`search_all`, `get_full_document`).
- `backend/src/ask/citations.ts` — streaming `<cite>` tag parser.
- `backend/src/ask/systemPrompt.ts` — system-prompt constant.
- `backend/src/ask/openrouter.ts` — thin factory that returns an OpenAI SDK instance pointed at OpenRouter.
- `backend/src/ask/agentLoop.ts` — async-generator implementation of the agent loop, emitting `AgentEvent`s.
- `backend/src/api/ask.ts` — HTTP endpoint handler: request validation, SSE adapter, and shipping events from the generator to the client.
- `backend/src/__tests__/ask/tools.test.ts`
- `backend/src/__tests__/ask/citations.test.ts`
- `backend/src/__tests__/ask/agentLoop.test.ts`
- `backend/src/__tests__/ask/ask.integration.test.ts`

**Modified files:**
- `backend/src/api.ts` — remove MCP routes, add `/ask` route.
- `backend/src/index.ts` — remove MCP init/cleanup.
- `backend/package.json` — remove `@modelcontextprotocol/sdk` dependency.

**Deleted files:**
- `backend/src/mcp/handler.ts`
- `backend/src/mcp/server.ts`
- `backend/src/mcp/` (directory should be empty after the two file deletions)

---

## Task 1: Remove the MCP server

**Files:**
- Delete: `backend/src/mcp/handler.ts`
- Delete: `backend/src/mcp/server.ts`
- Modify: `backend/src/api.ts`
- Modify: `backend/src/index.ts`
- Modify: `backend/package.json`

- [ ] **Step 1: Delete the MCP module**

```bash
rm -rf backend/src/mcp
```

- [ ] **Step 2: Remove MCP import and routes from `backend/src/api.ts`**

Delete line 21 (`import { handleMcpDelete, ... } from "./mcp/handler.js";`) and lines 81–83 (the three `app.*("/mcp", ...)` registrations). After the edit, the file should end with the `/search/graypaper` handler and the closing `return app;`.

- [ ] **Step 3: Remove MCP init/cleanup from `backend/src/index.ts`**

Delete line 6 (`import { cleanupMcpTransports, initMcpHandler } ...`), line 21 (`initMcpHandler(db, dataDir);`), and line 38 (`cleanupMcpTransports();`).

- [ ] **Step 4: Remove the dependency from `backend/package.json`**

Delete the line `"@modelcontextprotocol/sdk": "^1.29.0",` from the `dependencies` block.

- [ ] **Step 5: Install and typecheck**

```bash
cd backend && npm install && npm run typecheck
```

Expected: no TypeScript errors.

- [ ] **Step 6: Run backend tests to confirm nothing broke**

```bash
cd backend && npm test
```

Expected: all existing tests pass (mainly `health.test.ts`).

- [ ] **Step 7: Commit**

```bash
git add backend/src/api.ts backend/src/index.ts backend/package.json backend/package-lock.json
git rm -r backend/src/mcp
git commit -m "Remove MCP server in favor of Ask AI endpoint"
```

---

## Task 2: Shared types and tool definitions

**Files:**
- Create: `backend/src/ask/types.ts`
- Create: `backend/src/ask/tools.ts` (definitions only; executors in later tasks)

- [ ] **Step 1: Create the shared types module**

Create `backend/src/ask/types.ts`:

```typescript
import { z } from "zod";

/**
 * Chat message as sent by the frontend. Assistant messages in the history may
 * have `tool_calls` when replayed, but users normally send only user/assistant
 * text turns in v1.
 */
export const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant", "tool"]),
  content: z.string(),
  tool_call_id: z.string().optional(),
  tool_calls: z
    .array(
      z.object({
        id: z.string(),
        type: z.literal("function"),
        function: z.object({
          name: z.string(),
          arguments: z.string(),
        }),
      })
    )
    .optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

/**
 * Events emitted by the agent loop, mirrored 1:1 as SSE events on the wire.
 */
export type AgentEvent =
  | { type: "tool_call"; name: string; args: unknown }
  | { type: "tool_result"; name: string; resultCount: number }
  | { type: "content_delta"; text: string }
  | { type: "citation"; n: number; docId: string; sourceType: SourceType }
  | { type: "done" }
  | { type: "error"; message: string };

export type SourceType = "graypaper" | "discord" | "matrix" | "page";
```

- [ ] **Step 2: Create `backend/src/ask/tools.ts` with the OpenAI-format tool schemas**

```typescript
/**
 * Tool definitions in OpenAI chat-completions tool format. OpenRouter accepts
 * these unchanged. Only two tools: unified search + full-doc fetch.
 */
export const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    function: {
      name: "search_all",
      description:
        "Search across all indexed knowledge sources (graypaper, discord, matrix, pages). Returns up to `limit` result chunks with a stable `id`, a `sourceType`, and a short preview of the content. Use this first to discover relevant material; follow up with get_full_document if a preview is insufficient.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Natural-language or keyword query.",
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 20,
            default: 10,
            description: "Max results per source (so up to 4 × limit total).",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_full_document",
      description:
        "Fetch the full markdown of a single document by the `id` returned from search_all. Use when a search preview is insufficient to answer the question.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The `id` from a search_all result.",
          },
        },
        required: ["id"],
      },
    },
  },
];
```

- [ ] **Step 3: Typecheck**

```bash
cd backend && npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add backend/src/ask/types.ts backend/src/ask/tools.ts
git commit -m "Add Ask AI types and tool definitions"
```

---

## Task 3: `search_all` executor — with tests

**Files:**
- Create: `backend/src/__tests__/ask/tools.test.ts`
- Modify: `backend/src/ask/tools.ts`

The executor wraps the four existing search functions, runs them in parallel, and returns a flat array `{ id, sourceType, preview, title?, url?, sender?, timestamp? }[]`.

- [ ] **Step 1: Write a failing test for `executeSearchAll`**

Create `backend/src/__tests__/ask/tools.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { executeSearchAll } from "../../ask/tools.js";
import { createSearchDB, insertDoc } from "../../data/searchIndex.js";

describe("executeSearchAll", () => {
  it("returns flattened results across all sources", async () => {
    const db = createSearchDB();
    insertDoc(db, {
      type: "graypaper_section",
      title: "Accumulate",
      content: "The accumulate function processes work results.",
    });
    insertDoc(db, {
      type: "discord",
      sender: "alice",
      channelId: "c1",
      channelName: "implementers",
      content: "Discussion about accumulate.",
      messageId: "m1",
      timestamp: Date.now(),
    });

    const results = await executeSearchAll(
      { query: "accumulate", limit: 5 },
      db,
      "./data"
    );

    const sourceTypes = new Set(results.map((r) => r.sourceType));
    expect(sourceTypes.has("graypaper")).toBe(true);
    expect(sourceTypes.has("discord")).toBe(true);
    // Every result has a stable id and a preview field.
    for (const r of results) {
      expect(typeof r.id).toBe("string");
      expect(r.id.length).toBeGreaterThan(0);
      expect(typeof r.preview).toBe("string");
    }
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
cd backend && npm test -- tools.test
```

Expected: FAIL — `executeSearchAll` is not defined.

- [ ] **Step 3: Implement `executeSearchAll` in `backend/src/ask/tools.ts`**

Append to `backend/src/ask/tools.ts`:

```typescript
import { searchDiscords } from "../api/searchDiscords.js";
import { searchGraypaper } from "../api/searchGraypapers.js";
import { searchMessages } from "../api/searchMessages.js";
import { searchPages } from "../api/searchPages.js";
import type { EmbeddingCache } from "../cache/embeddingCache.js";
import type { SearchDB } from "../data/searchIndex.js";
import type { SourceType } from "./types.js";

export interface UnifiedSearchResult {
  id: string;
  sourceType: SourceType;
  preview: string;
  title?: string;
  url?: string;
  sender?: string;
  timestamp?: number | null;
  score?: number;
}

const noOpEmbeddingCache: EmbeddingCache = {
  store: () => "",
  retrieve: () => undefined,
  clear: () => {},
};

function truncate(text: string, max = 500): string {
  return text.length > max ? `${text.slice(0, max)}...` : text;
}

export async function executeSearchAll(
  args: { query: string; limit?: number },
  db: SearchDB,
  dataDir: string
): Promise<UnifiedSearchResult[]> {
  const limit = args.limit ?? 10;
  const [pages, discord, matrix, graypaper] = await Promise.all([
    searchPages(
      { q: args.query, e: "", page: 1, pageSize: limit },
      noOpEmbeddingCache,
      db,
      dataDir
    ),
    searchDiscords(
      { q: args.query, e: "", page: 1, pageSize: limit },
      noOpEmbeddingCache,
      db,
      dataDir
    ),
    searchMessages(
      { q: args.query, e: "", page: 1, pageSize: limit },
      noOpEmbeddingCache,
      db,
      dataDir
    ),
    searchGraypaper(
      { q: args.query, e: "", page: 1, pageSize: limit },
      noOpEmbeddingCache,
      db,
      dataDir
    ),
  ]);

  const out: UnifiedSearchResult[] = [];
  for (const r of pages.results ?? []) {
    out.push({
      id: r.id,
      sourceType: "page",
      preview: truncate(r.content),
      title: r.title,
      url: r.url,
      timestamp: r.createdAt ? new Date(r.createdAt).getTime() : null,
      score: r.score,
    });
  }
  for (const r of discord.results ?? []) {
    out.push({
      id: r.id,
      sourceType: "discord",
      preview: truncate(r.content),
      sender: r.sender,
      timestamp: r.timestamp ? new Date(r.timestamp).getTime() : null,
      score: r.score,
    });
  }
  for (const r of matrix.results ?? []) {
    out.push({
      id: r.id,
      sourceType: "matrix",
      preview: truncate(r.content),
      sender: r.sender,
      timestamp: r.timestamp ? new Date(r.timestamp).getTime() : null,
      score: r.score,
    });
  }
  for (const r of graypaper.results ?? []) {
    out.push({
      id: r.id,
      sourceType: "graypaper",
      preview: truncate(r.text ?? ""),
      title: r.title,
      score: r.score,
    });
  }
  return out;
}
```

- [ ] **Step 4: Run the test to confirm it passes**

```bash
cd backend && npm test -- tools.test
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/src/ask/tools.ts backend/src/__tests__/ask/tools.test.ts
git commit -m "Add executeSearchAll tool executor"
```

---

## Task 4: `get_full_document` executor — with tests

**Files:**
- Modify: `backend/src/__tests__/ask/tools.test.ts`
- Modify: `backend/src/ask/tools.ts`

- [ ] **Step 1: Write a failing test for `executeGetFullDocument`**

Append to `backend/src/__tests__/ask/tools.test.ts`:

```typescript
import { executeGetFullDocument } from "../../ask/tools.js";

describe("executeGetFullDocument", () => {
  it("returns the full document markdown by id", async () => {
    const db = createSearchDB();
    const id = insertDoc(db, {
      type: "graypaper_section",
      title: "Accumulate",
      content: "Full body of the accumulate section...",
    });

    const result = await executeGetFullDocument({ id }, db);

    expect(result).not.toBeNull();
    expect(result?.sourceType).toBe("graypaper");
    expect(result?.content).toContain("Full body of the accumulate section");
  });

  it("returns null for an unknown id", async () => {
    const db = createSearchDB();
    const result = await executeGetFullDocument({ id: "does-not-exist" }, db);
    expect(result).toBeNull();
  });
});
```

- [ ] **Step 2: Run the test to confirm it fails**

```bash
cd backend && npm test -- tools.test
```

Expected: FAIL — `executeGetFullDocument` is not defined.

- [ ] **Step 3: Implement `executeGetFullDocument`**

Append to `backend/src/ask/tools.ts`:

```typescript
import { getByID } from "@orama/orama";
import type { DocType, SearchDoc } from "../data/searchIndex.js";

export interface FullDocument {
  id: string;
  sourceType: SourceType;
  content: string;
  title?: string;
  url?: string;
  sender?: string;
  channelName?: string;
  roomName?: string;
  timestamp?: number | null;
}

function docTypeToSourceType(type: DocType): SourceType {
  switch (type) {
    case "graypaper_section":
    case "graypaper_version":
      return "graypaper";
    case "discord":
      return "discord";
    case "matrix":
      return "matrix";
    case "page":
      return "page";
  }
}

export async function executeGetFullDocument(
  args: { id: string },
  db: SearchDB
): Promise<FullDocument | null> {
  const doc = (await getByID(db, args.id)) as SearchDoc | undefined;
  if (!doc) return null;
  return {
    id: args.id,
    sourceType: docTypeToSourceType(doc.type),
    content: doc.content,
    title: doc.title,
    url: doc.url,
    sender: doc.sender,
    channelName: doc.channelName,
    roomName: doc.roomName,
    timestamp: doc.timestamp ?? null,
  };
}
```

- [ ] **Step 4: Run the tests to confirm they pass**

```bash
cd backend && npm test -- tools.test
```

Expected: PASS for both `executeGetFullDocument` tests (and existing `executeSearchAll` still passing).

- [ ] **Step 5: Commit**

```bash
git add backend/src/ask/tools.ts backend/src/__tests__/ask/tools.test.ts
git commit -m "Add executeGetFullDocument tool executor"
```

---

## Task 5: Streaming `<cite>` tag parser — with tests

**Files:**
- Create: `backend/src/__tests__/ask/citations.test.ts`
- Create: `backend/src/ask/citations.ts`

The parser must handle `<cite n="1" doc="abc" />` tags that may arrive split across chunk boundaries. It returns the clean text (tags stripped) plus any citations extracted from the feed.

- [ ] **Step 1: Write failing tests**

Create `backend/src/__tests__/ask/citations.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { createCiteParser } from "../../ask/citations.js";

describe("createCiteParser", () => {
  it("passes plain text through unchanged", () => {
    const p = createCiteParser();
    const out = p.feed("Hello world");
    expect(out.text).toBe("Hello world");
    expect(out.citations).toEqual([]);
  });

  it("extracts a complete cite tag in one chunk", () => {
    const p = createCiteParser();
    const out = p.feed(
      'The answer <cite n="1" doc="abc" sourceType="graypaper" />[1].'
    );
    expect(out.text).toBe("The answer [1].");
    expect(out.citations).toEqual([
      { n: 1, docId: "abc", sourceType: "graypaper" },
    ]);
  });

  it("handles a cite tag split across two chunks", () => {
    const p = createCiteParser();
    const first = p.feed('The answer <cite n="1" doc="a');
    expect(first.text).toBe("The answer ");
    expect(first.citations).toEqual([]);
    const second = p.feed('bc" sourceType="graypaper" />[1].');
    expect(second.text).toBe("[1].");
    expect(second.citations).toEqual([
      { n: 1, docId: "abc", sourceType: "graypaper" },
    ]);
  });

  it("handles the sourceType attribute missing (graceful fallback)", () => {
    const p = createCiteParser();
    const out = p.feed('<cite n="2" doc="x" />[2]');
    expect(out.text).toBe("[2]");
    // If sourceType is absent, we still emit a citation but with undefined sourceType.
    // Upstream will use the doc id to look it up elsewhere.
    expect(out.citations.length).toBe(1);
    expect(out.citations[0].n).toBe(2);
    expect(out.citations[0].docId).toBe("x");
  });

  it("flushes any trailing buffered text via flush()", () => {
    const p = createCiteParser();
    // Partial tag that never completes.
    p.feed("text <cite n=");
    const out = p.flush();
    expect(out.text).toBe("<cite n=");
  });
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
cd backend && npm test -- citations.test
```

Expected: FAIL — `createCiteParser` is not defined.

- [ ] **Step 3: Implement the parser**

Create `backend/src/ask/citations.ts`:

```typescript
import type { SourceType } from "./types.js";

export interface ParsedCitation {
  n: number;
  docId: string;
  sourceType?: SourceType;
}

export interface ParseResult {
  text: string;
  citations: ParsedCitation[];
}

/**
 * Streaming parser for `<cite n="N" doc="..." sourceType="..." />` tags.
 *
 * The LLM emits these tags before citation markers so the frontend can match
 * [N] markers to source cards. Tags may span chunk boundaries; the parser
 * buffers a potential partial tag until it can decide.
 */
export function createCiteParser() {
  let buffer = "";

  function consume(input: string): ParseResult {
    buffer += input;
    let text = "";
    const citations: ParsedCitation[] = [];

    // Process the buffer left-to-right, extracting tags and plain text.
    while (buffer.length > 0) {
      const ltIdx = buffer.indexOf("<");
      if (ltIdx === -1) {
        // No '<' anywhere; the whole buffer is text.
        text += buffer;
        buffer = "";
        break;
      }

      // Emit text before the '<'.
      if (ltIdx > 0) {
        text += buffer.slice(0, ltIdx);
        buffer = buffer.slice(ltIdx);
      }

      // Now buffer starts with '<'. Look for a complete tag.
      const gtIdx = buffer.indexOf(">");
      if (gtIdx === -1) {
        // Incomplete; keep buffer, wait for more input.
        break;
      }

      const tag = buffer.slice(0, gtIdx + 1);
      buffer = buffer.slice(gtIdx + 1);

      const cite = parseCiteTag(tag);
      if (cite) {
        citations.push(cite);
      } else {
        // Not a cite tag (or malformed): pass through as plain text.
        text += tag;
      }
    }

    return { text, citations };
  }

  function flush(): ParseResult {
    const out = { text: buffer, citations: [] as ParsedCitation[] };
    buffer = "";
    return out;
  }

  return { feed: consume, flush };
}

const CITE_TAG_RE =
  /^<cite\s+([^>]*?)\/?>$/i;

function parseCiteTag(tag: string): ParsedCitation | null {
  const m = CITE_TAG_RE.exec(tag);
  if (!m) return null;
  const attrs = m[1];
  const n = Number(/n\s*=\s*"(\d+)"/i.exec(attrs)?.[1]);
  const docId = /doc\s*=\s*"([^"]+)"/i.exec(attrs)?.[1];
  const sourceTypeStr = /sourceType\s*=\s*"([^"]+)"/i.exec(attrs)?.[1];
  if (!Number.isInteger(n) || n <= 0) return null;
  if (!docId) return null;
  const valid: SourceType[] = ["graypaper", "discord", "matrix", "page"];
  const sourceType = valid.includes(sourceTypeStr as SourceType)
    ? (sourceTypeStr as SourceType)
    : undefined;
  return { n, docId, sourceType };
}
```

- [ ] **Step 4: Run the tests to confirm they pass**

```bash
cd backend && npm test -- citations.test
```

Expected: PASS (5 tests).

- [ ] **Step 5: Commit**

```bash
git add backend/src/ask/citations.ts backend/src/__tests__/ask/citations.test.ts
git commit -m "Add streaming cite-tag parser"
```

---

## Task 6: System prompt and OpenRouter client wrapper

**Files:**
- Create: `backend/src/ask/systemPrompt.ts`
- Create: `backend/src/ask/openrouter.ts`

- [ ] **Step 1: Create the system prompt**

Create `backend/src/ask/systemPrompt.ts`:

```typescript
export const SYSTEM_PROMPT = `You are a knowledge assistant for JAM Search, a search engine that indexes discussions and documentation about the JAM (Join-Accumulate Machine) protocol.

You have access to four knowledge sources:
- graypaper: The official JAM technical specification (the "Graypaper"). Use for formal definitions, protocol details, and formulas.
- discord: Messages from JAM-related Discord servers, primarily the #implementers channel. Use for implementation discussions, debugging, and community context.
- matrix: Messages from JAM Matrix rooms. Use for research discussions, announcements, and developer conversations.
- pages: Indexed web pages and documentation from various JAM sites (docs.jamcha.in, jam.web3.foundation, jam-conformance, jam-test-vectors, and others). Use for official blog posts, tutorials, and external documentation.

Tools available:
- search_all(query, limit): Search across all sources. Returns an array of chunks, each with an "id", "sourceType", and a short "preview".
- get_full_document(id): Fetch the full markdown of a single document by an "id" from search_all.

Strategy:
1. Begin by calling search_all with specific technical terms from the question. Favour terminology from the Graypaper when applicable.
2. If a preview looks promising but is cut off or insufficient, call get_full_document with its id.
3. Iterate: refine queries, fetch more documents, as many times as needed for a thorough answer. There is no call budget you need to conserve.
4. Synthesize a clear, well-structured answer. Prefer formal definitions from the Graypaper; use Discord and Matrix for context on open questions, debugging, and community consensus.

Citation format (REQUIRED):
- Every factual claim must be supported by at least one citation.
- Use \`[N]\` markers inline (N = 1, 2, 3, ...) in order of first appearance.
- The very first time a new number is introduced, emit a self-closing tag directly before it: \`<cite n="N" doc="<id>" sourceType="<graypaper|discord|matrix|page>" />\`.
- Example: "The accumulate function processes work results <cite n=\\"1\\" doc=\\"abc123\\" sourceType=\\"graypaper\\" />[1]."
- The \`<cite>\` tags are stripped from the user-visible output; the frontend uses them to render source cards alongside your answer.
- Subsequent reuses of the same number do not need another \`<cite>\` tag; just write \`[N]\`.

Multi-turn context:
- Earlier turns in this conversation may have established context. Re-read them before answering; the user may be asking a follow-up.

Be concise but thorough. Prefer lists and short paragraphs for readability.`;
```

- [ ] **Step 2: Create the OpenRouter client factory**

Create `backend/src/ask/openrouter.ts`:

```typescript
import OpenAI from "openai";

/**
 * OpenRouter exposes an OpenAI-compatible chat-completions API. We reuse the
 * official openai SDK by pointing its baseURL at OpenRouter.
 */
export function createOpenRouterClient(apiKey: string): OpenAI {
  return new OpenAI({
    apiKey,
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "https://search.fluffylabs.dev",
      "X-Title": "JAM Search — Ask AI",
    },
  });
}
```

- [ ] **Step 3: Typecheck**

```bash
cd backend && npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add backend/src/ask/systemPrompt.ts backend/src/ask/openrouter.ts
git commit -m "Add system prompt and OpenRouter client factory"
```

---

## Task 7: Agent loop (async generator) — with tests

**Files:**
- Create: `backend/src/__tests__/ask/agentLoop.test.ts`
- Create: `backend/src/ask/agentLoop.ts`

The loop is an async generator that yields `AgentEvent`s. Tests use an injectable OpenAI-shaped client so we can script the streaming responses.

- [ ] **Step 1: Write failing tests**

Create `backend/src/__tests__/ask/agentLoop.test.ts`:

```typescript
import { describe, expect, it, vi } from "vitest";
import { runAgentLoop } from "../../ask/agentLoop.js";
import { createSearchDB, insertDoc } from "../../data/searchIndex.js";
import type { AgentEvent } from "../../ask/types.js";

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
                content: 'pre <cite n="1" doc="abc" sourceType="graypaper" />[1] post',
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
});
```

- [ ] **Step 2: Run the tests to confirm they fail**

```bash
cd backend && npm test -- agentLoop.test
```

Expected: FAIL — `runAgentLoop` is not defined.

- [ ] **Step 3: Implement the agent loop**

Create `backend/src/ask/agentLoop.ts`:

```typescript
import type OpenAI from "openai";
import type { SearchDB } from "../data/searchIndex.js";
import { createCiteParser } from "./citations.js";
import { SYSTEM_PROMPT } from "./systemPrompt.js";
import { executeGetFullDocument, executeSearchAll } from "./tools.js";
import { TOOL_DEFINITIONS } from "./tools.js";
import type { AgentEvent, ChatMessage } from "./types.js";

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

  try {
    while (true) {
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
    const doc = await executeGetFullDocument(
      { id: String(a.id ?? "") },
      db
    );
    return { resultCount: doc ? 1 : 0, payload: doc ?? { error: "not found" } };
  }
  return {
    resultCount: 0,
    payload: { error: `unknown tool: ${name}` },
  };
}
```

- [ ] **Step 4: Run the tests to confirm they pass**

```bash
cd backend && npm test -- agentLoop.test
```

Expected: PASS (4 tests).

- [ ] **Step 5: Commit**

```bash
git add backend/src/ask/agentLoop.ts backend/src/__tests__/ask/agentLoop.test.ts
git commit -m "Add agent loop async generator"
```

---

## Task 8: `/ask` HTTP endpoint with SSE streaming

**Files:**
- Create: `backend/src/api/ask.ts`
- Modify: `backend/src/api.ts` (wire the route)

- [ ] **Step 1: Create the endpoint handler**

Create `backend/src/api/ask.ts`:

```typescript
import type { Context } from "hono";
import { streamSSE } from "hono/streaming";
import { z } from "zod";
import { runAgentLoop } from "../ask/agentLoop.js";
import { createOpenRouterClient } from "../ask/openrouter.js";
import { chatMessageSchema } from "../ask/types.js";
import type { SearchDB } from "../data/searchIndex.js";

export const askRequestSchema = z.object({
  messages: z.array(chatMessageSchema).min(1),
  model: z.string().min(1),
  openrouterKey: z.string().min(1),
});

export function handleAsk(db: SearchDB, dataDir: string) {
  return async (c: Context) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }

    const parsed = askRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { error: "Invalid request", issues: parsed.error.issues },
        400
      );
    }
    const { messages, model, openrouterKey } = parsed.data;

    const openai = createOpenRouterClient(openrouterKey);

    return streamSSE(c, async (stream) => {
      const gen = runAgentLoop({
        messages,
        model,
        openai,
        db,
        dataDir,
      });
      for await (const event of gen) {
        await stream.writeSSE({
          event: event.type,
          data: JSON.stringify(event),
        });
      }
    });
  };
}
```

- [ ] **Step 2: Wire the route in `backend/src/api.ts`**

Add the import near the other api imports:

```typescript
import { handleAsk } from "./api/ask.js";
```

Add the route inside `createApp`, below the search endpoints:

```typescript
  app.post("/ask", handleAsk(db, dataDir));
```

- [ ] **Step 3: Typecheck**

```bash
cd backend && npm run typecheck
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add backend/src/api/ask.ts backend/src/api.ts
git commit -m "Add POST /ask endpoint with SSE streaming"
```

---

## Task 9: Integration test for `/ask`

**Files:**
- Create: `backend/src/__tests__/ask/ask.integration.test.ts`

This test mocks `openai.chat.completions.create` by constructing the app with a search DB populated with fixture data and stubbing the OpenAI module.

- [ ] **Step 1: Write the integration test**

Create `backend/src/__tests__/ask/ask.integration.test.ts`:

```typescript
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

async function readSSE(body: ReadableStream<Uint8Array>): Promise<
  Array<{ event: string; data: unknown }>
> {
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
```

- [ ] **Step 2: Run the test to confirm it passes**

```bash
cd backend && npm test -- ask.integration
```

Expected: PASS (2 tests).

- [ ] **Step 3: Run the full backend test suite**

```bash
cd backend && npm test
```

Expected: all tests pass.

- [ ] **Step 4: Commit**

```bash
git add backend/src/__tests__/ask/ask.integration.test.ts
git commit -m "Add integration test for POST /ask"
```

---

## Task 10: Manual QA checkpoint

This is a non-commit task; it verifies the endpoint works end-to-end against the real OpenRouter before we move on to the frontend plan.

- [ ] **Step 1: Start the backend in dev mode**

```bash
cd backend && npm run dev
```

Wait for `Server running on http://localhost:3000`.

- [ ] **Step 2: Get a real OpenRouter key**

Use an OpenRouter account; copy an API key (`sk-or-...`).

- [ ] **Step 3: Call `/ask` with curl**

In a second terminal:

```bash
curl -N -X POST http://localhost:3000/ask \
  -H "content-type: application/json" \
  -d '{
    "messages":[{"role":"user","content":"How does the accumulate function work in JAM?"}],
    "model":"anthropic/claude-sonnet-4.5",
    "openrouterKey":"<paste real key here>"
  }'
```

Expected output (approximate, order may vary):

```
event: tool_call
data: {"type":"tool_call","name":"search_all","args":{"query":"accumulate function"}}

event: tool_result
data: {"type":"tool_result","name":"search_all","resultCount":<N>}

event: content_delta
data: {"type":"content_delta","text":"..."}

event: citation
data: {"type":"citation","n":1,"docId":"...","sourceType":"graypaper"}

event: content_delta
data: {"type":"content_delta","text":"..."}

...

event: done
data: {"type":"done"}
```

- [ ] **Step 4: Verify error path**

Call again with an obviously invalid `openrouterKey`:

```bash
curl -N -X POST http://localhost:3000/ask \
  -H "content-type: application/json" \
  -d '{
    "messages":[{"role":"user","content":"test"}],
    "model":"anthropic/claude-sonnet-4.5",
    "openrouterKey":"sk-or-invalid"
  }'
```

Expected: an `error` SSE event with an auth-related message.

- [ ] **Step 5: Stop the dev server**

Ctrl-C in the terminal running `npm run dev`.

No commit — this is a QA gate. If anything misbehaves, file a note and fix before starting Plan B (frontend).

---

## Summary

After this plan:

- MCP server is removed from the codebase and its dependency is gone.
- A new `POST /ask` endpoint accepts a chat message array, a model ID, and an OpenRouter key.
- The endpoint runs an agentic loop (capped at 20 iterations for safety) with two tools against the existing Orama index.
- SSE events stream `tool_call`, `tool_result`, `content_delta`, `citation`, and `done` in real time.
- `<cite>` tags are parsed out of the content stream so user-visible text is clean.
- Tests cover tool executors, cite parser, the agent loop (with a mocked client), and the full HTTP endpoint.

**Next plan:** `docs/superpowers/plans/2026-04-17-ask-ai-frontend.md` (Plan B) wires up the `/ask` React route, chat UI, citations panel, and the two entry points (SearchForm third mode, results-page pivot).

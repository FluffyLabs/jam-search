# Ask Sessions Persistence + Shareable Links — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist Ask conversations per signed-in user in Supabase and let owners opt in to public shareable links with a signed-in fork flow.

**Architecture:** Stateless backend (unchanged). Frontend writes directly to a single `ask_sessions` Supabase table via RLS. Live shared links are a boolean flag; deletion 404s the link. Multi-session UX with an LHS sidebar; switching aborts in-flight streams.

**Tech Stack:** React 19 + react-router v7 (HashRouter), Supabase (auth + Postgres), Vitest + React Testing Library, Tailwind v4, `@fluffylabs/shared-ui` (Supabase provider, auth components).

**Spec:** `docs/superpowers/specs/2026-04-23-ask-sessions-design.md`

---

## File Map

**New files:**
- `supabase/migrations/20260423000001_create_ask_sessions.sql` — table + indexes + trigger + RLS policies.
- `client/src/lib/sessionTypes.ts` — `AskSessionRow`, `AskSessionSummary`, serialization helpers (`toRow`, `fromRow`).
- `client/src/lib/__tests__/sessionTypes.test.ts` — serialization tests.
- `client/src/hooks/useSessions.ts` — thin CRUD wrapper over the Supabase client.
- `client/src/hooks/__tests__/useSessions.test.ts` — hook behavior tests with a mocked Supabase client.
- `client/src/components/ask/AskLayout.tsx` — route layout with sidebar + `<Outlet/>`.
- `client/src/components/ask/SessionsSidebar.tsx` — list, grouping, filter, New Chat button.
- `client/src/components/ask/SessionRow.tsx` — single row with dropdown menu (rename/delete/share).
- `client/src/components/ask/SharePopover.tsx` — public link toggle + copy button.
- `client/src/components/ask/AuthGate.tsx` — redirects unauthenticated users to `/login`.
- `client/src/components/ask/SaveErrorBanner.tsx` — toast-like banner when a write fails.
- `client/src/pages/askShared.tsx` — read-only public session view + fork CTA.
- `client/src/lib/forkPending.ts` — helper around `sessionStorage` for the deferred-fork flow.
- `client/src/lib/__tests__/forkPending.test.ts` — deferred-fork tests.
- `client/src/lib/groupSessions.ts` — sidebar grouping logic.
- `client/src/lib/__tests__/groupSessions.test.ts` — grouping tests.

**Modified files:**
- `client/src/pages/ask.tsx` — accept `sessionId` route param, hydrate from Supabase, persist on `done`, wire sidebar handlers.
- `client/src/hooks/useAskConversation.ts` — drop `sessionStorage` path; expose a `hydrate(state)` / `reset()` action path.
- `client/src/lib/askReducer.ts` — add `hydrate` action replacing full state.
- `client/src/App.tsx` — replace flat `/ask` route with layout route + `:sessionId` + `/ask/s/:sessionId`.
- `client/src/pages/settings.tsx` — no change expected (placeholder; verify).

**Test conventions used:**
- `import { describe, expect, it, vi, beforeEach } from "vitest"`.
- Co-located under `__tests__/` alongside source.
- Component tests use `@testing-library/react` where already available (`client/package.json` — verify during Task 0).

---

## Task 0: Prep — verify tooling and current state

**Files:**
- Read: `client/package.json`, `client/vite.config.ts`, `client/src/App.tsx`

- [ ] **Step 1: Inspect `client/package.json` for test stack**

Run: `cat client/package.json | grep -E '"(vitest|testing-library|jsdom)"'`
Expected: `vitest` present. If `@testing-library/react` is missing, note it — Tasks 8–12 need it.

- [ ] **Step 2: Install missing test deps if needed**

Only if Step 1 showed `@testing-library/react` missing:

```bash
npm install --save-dev --workspace client \
  @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom
```

Then ensure `client/vite.config.ts` sets `test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.ts'] }`. Create `client/src/test/setup.ts` containing `import "@testing-library/jest-dom";` if it does not exist.

- [ ] **Step 3: Confirm current `npm test` is green**

Run from repo root: `npm test --workspace client`
Expected: All current tests pass (3 files: `askClient`, `askMarkers`, `askReducer`).

- [ ] **Step 4: Commit any dev-dep additions**

```bash
git add client/package.json package-lock.json client/vite.config.ts client/src/test/setup.ts
git commit -m "chore(client): add react testing library for component tests"
```

Skip if nothing changed.

---

## Task 1: Supabase migration for `ask_sessions`

**Files:**
- Create: `supabase/migrations/20260423000001_create_ask_sessions.sql`

- [ ] **Step 1: Create the migration file**

```sql
-- supabase/migrations/20260423000001_create_ask_sessions.sql
create extension if not exists "pgcrypto";

create table public.ask_sessions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  title       text,
  is_public   boolean not null default false,
  model       text not null,
  messages    jsonb not null default '[]'::jsonb,
  cards       jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index idx_ask_sessions_user_updated
  on public.ask_sessions (user_id, updated_at desc);

create index idx_ask_sessions_public
  on public.ask_sessions (id)
  where is_public = true;

create or replace function public.touch_ask_sessions_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger trg_touch_ask_sessions_updated_at
  before update on public.ask_sessions
  for each row execute function public.touch_ask_sessions_updated_at();

alter table public.ask_sessions enable row level security;

create policy "owner_all" on public.ask_sessions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "public_read" on public.ask_sessions
  for select
  using (is_public = true);
```

- [ ] **Step 2: Apply the migration to the Supabase project**

Run (requires `supabase` CLI logged in and linked to the project):

```bash
cd supabase && supabase db push
```

Fallback (if CLI isn't set up): open Supabase Studio → SQL Editor → paste the SQL from Step 1 → Run.

Expected: Table `public.ask_sessions` visible in the Table Editor with RLS enabled.

- [ ] **Step 3: Smoke-test RLS manually in the Supabase Studio SQL editor**

Run as an anon role (no user context):

```sql
insert into public.ask_sessions (user_id, model) values ('00000000-0000-0000-0000-000000000000', 'x');
```

Expected: `new row violates row-level security policy`.

```sql
select * from public.ask_sessions where id = '00000000-0000-0000-0000-000000000001';
```

Expected: zero rows.

Then seed a test row as yourself (Studio → "run as authenticated user") and verify the owner policy. Delete the test row.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260423000001_create_ask_sessions.sql
git commit -m "feat(supabase): add ask_sessions table with RLS"
```

---

## Task 1b: Backend `/ask/title` endpoint (TDD)

**Files:**
- Create: `backend/src/ask/titleGen.ts`
- Create: `backend/src/api/askTitle.ts`
- Create: `backend/src/__tests__/ask/titleGen.test.ts`
- Modify: `backend/src/api.ts` — register route
- Modify: `backend/src/env.ts` — add `TITLE_MODEL` default (or `.env.example` if env is plain `process.env`)

- [ ] **Step 1: Write the failing test**

```ts
// backend/src/__tests__/ask/titleGen.test.ts
import { describe, expect, it, vi } from "vitest";
import { generateTitle } from "../../ask/titleGen.js";

describe("generateTitle", () => {
  it("returns a trimmed, quote-free title", async () => {
    const fakeOpenAI = {
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({
            choices: [{ message: { content: '"How work results accumulate"' } }],
          }),
        },
      },
    } as never;
    const title = await generateTitle({
      openai: fakeOpenAI,
      model: "anthropic/claude-haiku-4-5",
      question: "How do work results accumulate in JAM?",
    });
    expect(title).toBe("How work results accumulate");
  });

  it("throws on empty model output", async () => {
    const fakeOpenAI = {
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({ choices: [{ message: { content: "" } }] }),
        },
      },
    } as never;
    await expect(
      generateTitle({
        openai: fakeOpenAI,
        model: "x",
        question: "q",
      }),
    ).rejects.toThrow(/empty/i);
  });

  it("truncates to 80 chars max", async () => {
    const long = "A".repeat(200);
    const fakeOpenAI = {
      chat: {
        completions: {
          create: vi.fn().mockResolvedValue({ choices: [{ message: { content: long } }] }),
        },
      },
    } as never;
    const title = await generateTitle({
      openai: fakeOpenAI,
      model: "x",
      question: "q",
    });
    expect(title.length).toBeLessThanOrEqual(80);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test --workspace backend -- titleGen`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `titleGen.ts`**

```ts
// backend/src/ask/titleGen.ts
import type OpenAI from "openai";

const TITLE_SYSTEM_PROMPT =
  "You generate short, descriptive titles for a user's first question in a " +
  "chat. Respond with ONLY the title — 5 to 8 words, no surrounding quotes, " +
  "no trailing punctuation, no prefix like 'Title:'. Plain text only.";

export async function generateTitle(args: {
  openai: OpenAI;
  model: string;
  question: string;
}): Promise<string> {
  const { openai, model, question } = args;
  const res = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: TITLE_SYSTEM_PROMPT },
      { role: "user", content: question },
    ],
    max_tokens: 40,
    temperature: 0.2,
  });
  const raw = res.choices[0]?.message?.content?.trim() ?? "";
  if (!raw) throw new Error("Title generation returned empty output");
  const stripped = raw
    .replace(/^["'`]|["'`]$/g, "")
    .replace(/[.!?]+$/g, "")
    .trim();
  return stripped.slice(0, 80);
}
```

- [ ] **Step 4: Run test**

Run: `npm test --workspace backend -- titleGen`
Expected: PASS (3 tests).

- [ ] **Step 5: Implement the HTTP handler**

```ts
// backend/src/api/askTitle.ts
import type { Context } from "hono";
import { z } from "zod";
import { createOpenRouterClient } from "../ask/openrouter.js";
import { generateTitle } from "../ask/titleGen.js";

const titleRequestSchema = z.object({
  question: z.string().trim().min(1).max(8000),
  openrouterKey: z.string().trim().min(1).max(512),
});

export function handleAskTitle() {
  return async (c: Context) => {
    let body: unknown;
    try {
      body = await c.req.json();
    } catch {
      return c.json({ error: "Invalid JSON body" }, 400);
    }
    const parsed = titleRequestSchema.safeParse(body);
    if (!parsed.success) {
      return c.json(
        { error: "Invalid request", issues: parsed.error.issues },
        400,
      );
    }
    const { question, openrouterKey } = parsed.data;
    const model = process.env.TITLE_MODEL ?? "anthropic/claude-haiku-4-5";
    const openai = createOpenRouterClient(openrouterKey);
    try {
      const title = await generateTitle({ openai, model, question });
      return c.json({ title });
    } catch (err) {
      return c.json(
        { error: (err as Error).message || "Title generation failed" },
        502,
      );
    }
  };
}
```

- [ ] **Step 6: Register the route**

In `backend/src/api.ts`, next to the existing `app.post("/ask", handleAsk(db, dataDir));` line, add:

```ts
import { handleAskTitle } from "./api/askTitle.js";
// ...
app.post("/ask/title", handleAskTitle());
```

- [ ] **Step 7: Document the env var**

Append to `.env.example` at the repo root (or wherever env vars are documented):

```
# Cheap model used to generate titles for Ask sessions. Defaults to Haiku.
TITLE_MODEL=anthropic/claude-haiku-4-5
```

- [ ] **Step 8: Commit**

```bash
git add backend/src/ask/titleGen.ts backend/src/api/askTitle.ts \
        backend/src/api.ts backend/src/__tests__/ask/titleGen.test.ts \
        .env.example
git commit -m "feat(backend): POST /ask/title endpoint using TITLE_MODEL"
```

---

## Task 2: Session types + serialization (TDD)

**Files:**
- Create: `client/src/lib/sessionTypes.ts`
- Test: `client/src/lib/__tests__/sessionTypes.test.ts`

- [ ] **Step 1: Write the failing tests**

```ts
// client/src/lib/__tests__/sessionTypes.test.ts
import { describe, expect, it } from "vitest";
import type { AskConversationState, AssistantMessage } from "@/lib/askTypes";
import { fromRow, stateToMessages, toRow } from "@/lib/sessionTypes";

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
    // Assistant messages re-gain isStreaming=false on hydration.
    expect(hydrated.state.messages[1]).toMatchObject({
      id: "a1",
      isStreaming: false,
    });
    expect(hydrated.state.cards).toEqual(baseState.cards);
    expect(hydrated.state.model).toBe(baseState.model);
  });

  it("fromRow rejects invalid shapes by returning null", () => {
    expect(fromRow({ id: "x", user_id: "u", messages: "not-array" } as unknown as never)).toBeNull();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test --workspace client -- sessionTypes`
Expected: FAIL — module `@/lib/sessionTypes` not found.

- [ ] **Step 3: Implement**

```ts
// client/src/lib/sessionTypes.ts
import type {
  AskConversationState,
  AssistantMessage,
  ChatMessage,
  CitationCardData,
  UserMessage,
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

/** Strip transient UI-only fields (isStreaming, error) from messages before
 *  writing to the DB. Called on every persist. */
export function stateToMessages(state: AskConversationState): ChatMessage[] {
  return state.messages.map((m) => {
    if (m.role === "user") return m satisfies UserMessage;
    const { isStreaming: _i, error: _e, ...rest } = m;
    return { ...rest, citations: m.citations, parts: m.parts } as ChatMessage;
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

/** Generate a sidebar-friendly title from the first user message. */
export function deriveTitle(state: AskConversationState): string | null {
  const first = state.messages.find((m) => m.role === "user");
  if (!first || first.role !== "user") return null;
  const trimmed = first.content.trim().replace(/\s+/g, " ");
  if (trimmed.length <= 60) return trimmed;
  const cut = trimmed.slice(0, 60);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 30 ? cut.slice(0, lastSpace) : cut) + "…";
}
```

- [ ] **Step 4: Run tests**

Run: `npm test --workspace client -- sessionTypes`
Expected: PASS (3 assertions).

- [ ] **Step 5: Commit**

```bash
git add client/src/lib/sessionTypes.ts client/src/lib/__tests__/sessionTypes.test.ts
git commit -m "feat(ask): serialization helpers for persisted sessions"
```

---

## Task 3: Grouping helper (TDD)

**Files:**
- Create: `client/src/lib/groupSessions.ts`
- Test: `client/src/lib/__tests__/groupSessions.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// client/src/lib/__tests__/groupSessions.test.ts
import { describe, expect, it } from "vitest";
import { groupSessions } from "@/lib/groupSessions";
import type { AskSessionSummary } from "@/lib/sessionTypes";

function sess(id: string, updated: string): AskSessionSummary {
  return {
    id,
    userId: "u",
    title: id,
    isPublic: false,
    model: "x",
    createdAt: updated,
    updatedAt: updated,
  };
}

describe("groupSessions", () => {
  const now = new Date("2026-04-23T12:00:00Z");

  it("buckets by age relative to `now`", () => {
    const sessions = [
      sess("today", "2026-04-23T08:00:00Z"),
      sess("yesterday", "2026-04-22T10:00:00Z"),
      sess("week", "2026-04-20T10:00:00Z"),
      sess("month", "2026-04-10T10:00:00Z"),
      sess("old", "2026-01-01T10:00:00Z"),
    ];
    const groups = groupSessions(sessions, now);
    expect(groups.map((g) => [g.label, g.sessions.map((s) => s.id)])).toEqual([
      ["Today", ["today"]],
      ["Yesterday", ["yesterday"]],
      ["Previous 7 Days", ["week"]],
      ["Previous 30 Days", ["month"]],
      ["Older", ["old"]],
    ]);
  });

  it("omits empty buckets", () => {
    const groups = groupSessions([sess("a", "2026-04-23T08:00:00Z")], now);
    expect(groups.map((g) => g.label)).toEqual(["Today"]);
  });

  it("preserves input order within a bucket", () => {
    const groups = groupSessions(
      [
        sess("a", "2026-04-23T09:00:00Z"),
        sess("b", "2026-04-23T10:00:00Z"),
      ],
      now,
    );
    expect(groups[0].sessions.map((s) => s.id)).toEqual(["a", "b"]);
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test --workspace client -- groupSessions`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// client/src/lib/groupSessions.ts
import type { AskSessionSummary } from "@/lib/sessionTypes";

export interface SessionGroup {
  label: string;
  sessions: AskSessionSummary[];
}

const LABELS = [
  "Today",
  "Yesterday",
  "Previous 7 Days",
  "Previous 30 Days",
  "Older",
] as const;

function bucketIndex(updated: Date, now: Date): number {
  const ms = now.getTime() - updated.getTime();
  const day = 24 * 60 * 60 * 1000;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const updatedDay = new Date(
    updated.getFullYear(),
    updated.getMonth(),
    updated.getDate(),
  );
  const daysDiff = Math.round(
    (today.getTime() - updatedDay.getTime()) / day,
  );
  if (daysDiff <= 0) return 0;
  if (daysDiff === 1) return 1;
  if (ms < 7 * day) return 2;
  if (ms < 30 * day) return 3;
  return 4;
}

export function groupSessions(
  sessions: AskSessionSummary[],
  now: Date = new Date(),
): SessionGroup[] {
  const buckets: AskSessionSummary[][] = LABELS.map(() => []);
  for (const s of sessions) {
    buckets[bucketIndex(new Date(s.updatedAt), now)].push(s);
  }
  return buckets
    .map((sessions, i) => ({ label: LABELS[i], sessions }))
    .filter((g) => g.sessions.length > 0);
}
```

- [ ] **Step 4: Run tests**

Run: `npm test --workspace client -- groupSessions`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/lib/groupSessions.ts client/src/lib/__tests__/groupSessions.test.ts
git commit -m "feat(ask): groupSessions helper for sidebar buckets"
```

---

## Task 4: `useSessions` hook (TDD)

**Files:**
- Create: `client/src/hooks/useSessions.ts`
- Test: `client/src/hooks/__tests__/useSessions.test.ts`

- [ ] **Step 1: Write the failing test**

```ts
// client/src/hooks/__tests__/useSessions.test.ts
import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { createUseSessions } from "@/hooks/useSessions";

function makeClient(rows: unknown[] = []) {
  const from = vi.fn(() => builder);
  const builder: Record<string, ReturnType<typeof vi.fn>> = {
    select: vi.fn(() => builder),
    eq: vi.fn(() => builder),
    order: vi.fn(() => Promise.resolve({ data: rows, error: null })),
    insert: vi.fn(() => ({
      select: vi.fn(() => ({
        single: vi.fn(() => Promise.resolve({ data: rows[0], error: null })),
      })),
    })),
    update: vi.fn(() => builder),
    delete: vi.fn(() => builder),
    single: vi.fn(() => Promise.resolve({ data: rows[0] ?? null, error: null })),
  };
  return { client: { from }, from, builder };
}

describe("useSessions", () => {
  it("list() queries ask_sessions and orders by updated_at desc", async () => {
    const { client, from, builder } = makeClient([]);
    const hook = renderHook(() =>
      createUseSessions({ supabase: client as never, userId: "u1" })(),
    );
    await waitFor(() =>
      expect(hook.result.current.sessions).not.toBeUndefined(),
    );
    expect(from).toHaveBeenCalledWith("ask_sessions");
    expect(builder.select).toHaveBeenCalled();
    expect(builder.eq).toHaveBeenCalledWith("user_id", "u1");
    expect(builder.order).toHaveBeenCalledWith("updated_at", { ascending: false });
  });

  it("create() inserts a row with the given payload", async () => {
    const { client, from } = makeClient();
    const use = createUseSessions({ supabase: client as never, userId: "u1" });
    const hook = renderHook(() => use());
    await hook.result.current.create({
      id: "11111111-1111-1111-1111-111111111111",
      title: "Hello",
      state: {
        model: "m",
        cards: {},
        messages: [{ id: "u", role: "user", content: "hi" }],
      },
    });
    expect(from).toHaveBeenCalledWith("ask_sessions");
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test --workspace client -- useSessions`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// client/src/hooks/useSessions.ts
import { useSupabaseContext } from "@fluffylabs/shared-ui/supabase";
import { useCallback, useEffect, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { AskConversationState } from "@/lib/askTypes";
import {
  type AskSessionRecord,
  type AskSessionRow,
  type AskSessionSummary,
  fromRow,
  toRow,
} from "@/lib/sessionTypes";

export interface UseSessionsApi {
  sessions: AskSessionSummary[] | undefined;
  error: string | null;
  list: () => Promise<void>;
  get: (id: string) => Promise<AskSessionRecord | null>;
  create: (args: {
    id: string;
    title: string | null;
    state: AskConversationState;
  }) => Promise<void>;
  update: (
    id: string,
    patch: Partial<{
      title: string | null;
      isPublic: boolean;
      state: AskConversationState;
    }>,
  ) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

function rowToSummary(row: AskSessionRow): AskSessionSummary {
  return {
    id: row.id,
    userId: row.user_id,
    title: row.title,
    isPublic: row.is_public,
    model: row.model,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function createUseSessions(deps: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = deps;
  return function useSessions(): UseSessionsApi {
    const [sessions, setSessions] = useState<AskSessionSummary[] | undefined>(
      undefined,
    );
    const [error, setError] = useState<string | null>(null);

    const list = useCallback(async () => {
      const { data, error } = await supabase
        .from("ask_sessions")
        .select(
          "id,user_id,title,is_public,model,created_at,updated_at",
        )
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      if (error) {
        setError(error.message);
        return;
      }
      setSessions((data as AskSessionRow[]).map(rowToSummary));
    }, [supabase, userId]);

    const get = useCallback(
      async (id: string) => {
        const { data, error } = await supabase
          .from("ask_sessions")
          .select("*")
          .eq("id", id)
          .single();
        if (error) {
          setError(error.message);
          return null;
        }
        return fromRow(data as AskSessionRow);
      },
      [supabase],
    );

    const create = useCallback<UseSessionsApi["create"]>(
      async ({ id, title, state }) => {
        const row = toRow({
          id,
          userId,
          title,
          isPublic: false,
          state,
        });
        const { error } = await supabase.from("ask_sessions").insert(row);
        if (error) {
          setError(error.message);
          return;
        }
        await list();
      },
      [list, supabase, userId],
    );

    const update = useCallback<UseSessionsApi["update"]>(
      async (id, patch) => {
        const dbPatch: Record<string, unknown> = {};
        if ("title" in patch) dbPatch.title = patch.title ?? null;
        if ("isPublic" in patch) dbPatch.is_public = patch.isPublic;
        if (patch.state) {
          dbPatch.messages = toRow({
            id,
            userId,
            title: null,
            isPublic: false,
            state: patch.state,
          }).messages;
          dbPatch.cards = patch.state.cards;
          dbPatch.model = patch.state.model;
        }
        const { error } = await supabase
          .from("ask_sessions")
          .update(dbPatch)
          .eq("id", id);
        if (error) setError(error.message);
        else await list();
      },
      [list, supabase, userId],
    );

    const remove = useCallback(
      async (id: string) => {
        const { error } = await supabase
          .from("ask_sessions")
          .delete()
          .eq("id", id);
        if (error) setError(error.message);
        else await list();
      },
      [list, supabase],
    );

    useEffect(() => {
      list();
    }, [list]);

    return { sessions, error, list, get, create, update, remove };
  };
}

export function useSessions(): UseSessionsApi {
  const ctx = useSupabaseContext();
  if (!ctx.user) {
    throw new Error("useSessions requires an authenticated user");
  }
  return createUseSessions({ supabase: ctx.client, userId: ctx.user.id })();
}
```

- [ ] **Step 4: Run tests**

Run: `npm test --workspace client -- useSessions`
Expected: PASS (2 tests).

- [ ] **Step 5: Commit**

```bash
git add client/src/hooks/useSessions.ts client/src/hooks/__tests__/useSessions.test.ts
git commit -m "feat(ask): useSessions CRUD hook backed by Supabase"
```

---

## Task 5: Extend reducer with `hydrate` + `reset` actions (TDD)

**Files:**
- Modify: `client/src/lib/askReducer.ts`
- Modify: `client/src/lib/__tests__/askReducer.test.ts`

- [ ] **Step 1: Add the failing test**

Append to `client/src/lib/__tests__/askReducer.test.ts`:

```ts
describe("hydrate action", () => {
  it("replaces messages, cards, and model with the provided state", () => {
    const next = askReducer(initialState, {
      type: "hydrate",
      state: {
        model: "anthropic/claude-haiku-4-5",
        cards: { docA: { docId: "docA", sourceType: "graypaper" } },
        messages: [{ id: "u1", role: "user", content: "hi" }],
      },
    });
    expect(next.messages).toHaveLength(1);
    expect(next.model).toBe("anthropic/claude-haiku-4-5");
    expect(next.cards.docA).toBeDefined();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test --workspace client -- askReducer`
Expected: FAIL — unknown action type `"hydrate"`.

- [ ] **Step 3: Add the action**

In `client/src/lib/askReducer.ts`, add to the discriminated union of actions:

```ts
| { type: "hydrate"; state: AskConversationState }
```

And in the reducer switch:

```ts
case "hydrate":
  return action.state;
```

- [ ] **Step 4: Run tests**

Run: `npm test --workspace client -- askReducer`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add client/src/lib/askReducer.ts client/src/lib/__tests__/askReducer.test.ts
git commit -m "feat(ask): add hydrate action to askReducer"
```

---

## Task 6: Drop sessionStorage from `useAskConversation`

**Files:**
- Modify: `client/src/hooks/useAskConversation.ts`

- [ ] **Step 1: Replace file contents**

```ts
// client/src/hooks/useAskConversation.ts
import { useReducer } from "react";
import { askReducer, initialState } from "@/lib/askReducer";

export function useAskConversation() {
  const [state, dispatch] = useReducer(askReducer, initialState);
  return { state, dispatch };
}
```

- [ ] **Step 2: Confirm existing tests still pass**

Run: `npm test --workspace client -- askReducer askClient askMarkers`
Expected: PASS (no changes to those files expected).

- [ ] **Step 3: Commit**

```bash
git add client/src/hooks/useAskConversation.ts
git commit -m "refactor(ask): drop sessionStorage; persistence handled by useSessions"
```

---

## Task 7: Route refactor — layout + session ID param

**Files:**
- Modify: `client/src/App.tsx`
- Create: `client/src/components/ask/AskLayout.tsx` (stub — full impl in Task 10)
- Create: `client/src/components/ask/AuthGate.tsx`

- [ ] **Step 1: Implement `AuthGate`**

```tsx
// client/src/components/ask/AuthGate.tsx
import { useSupabaseContext } from "@fluffylabs/shared-ui/supabase";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, isLoading } = useSupabaseContext();
  const location = useLocation();
  if (isLoading) return <div className="p-4">Loading…</div>;
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }
  return <>{children}</>;
}
```

- [ ] **Step 2: Stub `AskLayout` (replaced in Task 10)**

```tsx
// client/src/components/ask/AskLayout.tsx
import { Outlet } from "react-router-dom";
import { AuthGate } from "@/components/ask/AuthGate";

export function AskLayout() {
  return (
    <AuthGate>
      <div className="flex h-full">
        {/* Sidebar added in Task 10 */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </AuthGate>
  );
}
```

- [ ] **Step 3: Wire routes in `App.tsx`**

Replace the single `/ask` line (currently `client/src/App.tsx:112`) with:

```tsx
<Route path="/ask" element={<AskLayout />}>
  <Route index element={<AskPage />} />
  <Route path=":sessionId" element={<AskPage />} />
</Route>
<Route path="/ask/s/:sessionId" element={<AskSharedPage />} />
```

And add imports at the top:

```ts
import { AskLayout } from "@/components/ask/AskLayout";
import { AskSharedPage } from "@/pages/askShared";
```

For now `AskSharedPage` does not exist — create a placeholder at `client/src/pages/askShared.tsx`:

```tsx
export function AskSharedPage() {
  return <div className="p-4">Shared view — coming soon.</div>;
}
```

- [ ] **Step 4: Run the app and verify routes**

Run: `npm run dev --workspace client`
Open in browser:
- `/#/ask` → sign-in or blank AskPage
- `/#/ask/some-id` → AskPage (will render empty; hydration in Task 8)
- `/#/ask/s/some-id` → placeholder "Shared view"

Expected: No router errors; each route renders its element.

- [ ] **Step 5: Commit**

```bash
git add client/src/App.tsx client/src/components/ask/AskLayout.tsx \
        client/src/components/ask/AuthGate.tsx client/src/pages/askShared.tsx
git commit -m "feat(ask): route layout with session id param and auth gate"
```

---

## Task 8: Hydration + persistence in `AskPage`

**Files:**
- Modify: `client/src/pages/ask.tsx`

- [ ] **Step 1: Read current `ask.tsx`**

Open the file to understand the existing `send()` flow. The two integration points are:
- Mount: if `sessionId` param present, hydrate from Supabase.
- After stream `done`: persist state via `useSessions`.

- [ ] **Step 2: Add hydration + persistence logic**

Replace the top of `AskPage` (preserve existing rendering JSX below) with:

```tsx
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useSessions } from "@/hooks/useSessions";
import { deriveTitle } from "@/lib/sessionTypes";
// ... keep all existing imports from the original file

export function AskPage() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useAskConversation();
  const sessions = useSessions();
  const [saveError, setSaveError] = useState<string | null>(null);
  const hydratedRef = useRef<string | null>(null);
  const createdRef = useRef<Set<string>>(new Set());

  // Hydrate when route changes to a session.
  useEffect(() => {
    if (!sessionId) {
      if (hydratedRef.current !== null) {
        dispatch({ type: "reset" });
        hydratedRef.current = null;
      }
      return;
    }
    if (hydratedRef.current === sessionId) return;
    let cancelled = false;
    (async () => {
      const record = await sessions.get(sessionId);
      if (cancelled) return;
      if (!record) {
        navigate("/ask", { replace: true });
        return;
      }
      dispatch({ type: "hydrate", state: record.state });
      hydratedRef.current = sessionId;
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, sessions, dispatch, navigate]);

  // Persist after any non-streaming assistant turn.
  const persistTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const last = state.messages[state.messages.length - 1];
    if (!last || last.role !== "assistant" || last.isStreaming) return;
    if (persistTimer.current) clearTimeout(persistTimer.current);
    persistTimer.current = setTimeout(async () => {
      try {
        if (!sessionId) return; // new-session path handled in send()
        await sessions.update(sessionId, { state });
        setSaveError(null);
      } catch (err) {
        setSaveError((err as Error).message);
      }
    }, 100);
    return () => {
      if (persistTimer.current) clearTimeout(persistTimer.current);
    };
  }, [sessionId, sessions, state]);
```

Update `send()` to create a session on the first message when there's no `sessionId`:

```tsx
const send = async (text: string, options?: { startFresh?: boolean }) => {
  // ... keep existing key/auth checks and dispatch(sendUserMessage)

  let activeId = sessionId;
  if (!activeId) {
    activeId = uuidv4();
    // createdRef prevents double-create from React StrictMode mount.
    if (!createdRef.current.has(activeId)) {
      createdRef.current.add(activeId);
      await sessions.create({
        id: activeId,
        title: deriveTitle({ ...state, messages: [
          { id: "pending", role: "user", content: text },
        ] }),
        state: { ...state, messages: [
          { id: "pending", role: "user", content: text },
        ] },
      });
    }
    hydratedRef.current = activeId;
    navigate(`/ask/${activeId}`, { replace: true });
  }

  // ... keep existing askStream call
};
```

Install `uuid` if not already a dependency:

```bash
npm install --workspace client uuid
npm install --save-dev --workspace client @types/uuid
```

- [ ] **Step 3: Smoke-test hydration and persistence**

Run: `npm run dev --workspace client`

1. Sign in. Navigate to `/#/ask`. Ask a question. On `done`, URL should update to `/#/ask/<uuid>`.
2. Reload the page. The conversation should re-render exactly.
3. In Supabase Studio, verify a row exists with the right `user_id`, `title`, and `messages` array.
4. Ask a follow-up. Reload. Both turns present.

Expected: All three work. If hydration race on the very first question flashes empty state, that's acceptable for v1.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/ask.tsx client/package.json package-lock.json
git commit -m "feat(ask): hydrate from supabase and persist turns"
```

---

## Task 8b: Title generation wiring + `requestTitle` client

**Files:**
- Create: `client/src/lib/askTitleClient.ts`
- Create: `client/src/lib/__tests__/askTitleClient.test.ts`
- Modify: `client/src/pages/ask.tsx` — fire title request in parallel with first stream; UPDATE `title` when it resolves.

- [ ] **Step 1: Write the failing test**

```ts
// client/src/lib/__tests__/askTitleClient.test.ts
import { afterEach, describe, expect, it, vi } from "vitest";
import { requestTitle } from "@/lib/askTitleClient";

afterEach(() => vi.restoreAllMocks());

describe("requestTitle", () => {
  it("posts to /ask/title and returns the title", async () => {
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockResolvedValue(
        new Response(JSON.stringify({ title: "Hello world" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );
    const title = await requestTitle({
      question: "Hi there",
      openrouterKey: "k",
    });
    expect(title).toBe("Hello world");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(/\/ask\/title$/),
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("returns null when the endpoint errors", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue(new Response("", { status: 502 }));
    const title = await requestTitle({ question: "q", openrouterKey: "k" });
    expect(title).toBeNull();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test --workspace client -- askTitleClient`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement**

```ts
// client/src/lib/askTitleClient.ts
const API_URL =
  (typeof window !== "undefined" && window.localStorage?.getItem("API_URL")) ||
  import.meta.env?.VITE_API_URL ||
  "https://search-api.fluffylabs.dev";

export async function requestTitle(args: {
  question: string;
  openrouterKey: string;
  signal?: AbortSignal;
}): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/ask/title`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        question: args.question,
        openrouterKey: args.openrouterKey,
      }),
      signal: args.signal,
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { title?: string };
    return body.title?.trim() || null;
  } catch {
    return null;
  }
}
```

- [ ] **Step 4: Run test**

Run: `npm test --workspace client -- askTitleClient`
Expected: PASS.

- [ ] **Step 5: Wire it into the session-create flow in `AskPage`**

In `client/src/pages/ask.tsx`, update the `send()` function's new-session branch (from Task 8) so that *in parallel* with creating the row and starting the stream it also fires a title request:

```tsx
if (!activeId) {
  activeId = uuidv4();
  createdRef.current.add(activeId);
  const provisional = deriveTitle({
    ...state,
    messages: [{ id: "pending", role: "user", content: text }],
  });
  await sessions.create({
    id: activeId,
    title: provisional,
    state: { ...state, messages: [
      { id: "pending", role: "user", content: text },
    ] },
  });
  hydratedRef.current = activeId;
  navigate(`/ask/${activeId}`, { replace: true });

  // Fire-and-forget title generation; patch the row when it resolves.
  requestTitle({ question: text, openrouterKey: apiKey }).then((title) => {
    if (title) sessions.update(activeId!, { title });
  });
}
```

The `provisional` title (from Task 2's `deriveTitle` fallback) means the sidebar has *something* immediately; the LLM-generated title overwrites it within a couple of seconds.

- [ ] **Step 6: Manual test**

Run dev server. Ask a new question. Within 2–3 seconds of submitting, the sidebar entry title should change from the first-60-chars fallback to a concise LLM title.

If the backend is local-only (not yet deployed), point `localStorage.API_URL` at `http://localhost:PORT` before testing.

- [ ] **Step 7: Commit**

```bash
git add client/src/lib/askTitleClient.ts client/src/lib/__tests__/askTitleClient.test.ts \
        client/src/pages/ask.tsx
git commit -m "feat(ask): generate session titles via /ask/title in parallel"
```

---

## Task 9: Save-error banner

**Files:**
- Create: `client/src/components/ask/SaveErrorBanner.tsx`
- Modify: `client/src/pages/ask.tsx`

- [ ] **Step 1: Implement the banner**

```tsx
// client/src/components/ask/SaveErrorBanner.tsx
import { Button } from "@/components/ui/button";

export function SaveErrorBanner({
  message,
  onRetry,
  onDismiss,
}: {
  message: string;
  onRetry: () => void;
  onDismiss: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
    >
      <span className="flex-1">Couldn't save: {message}</span>
      <Button size="sm" variant="outline" onClick={onRetry}>
        Retry
      </Button>
      <Button size="sm" variant="ghost" onClick={onDismiss}>
        Dismiss
      </Button>
    </div>
  );
}
```

- [ ] **Step 2: Render it in `AskPage` when `saveError` is set**

In `client/src/pages/ask.tsx`, near the top of the main content:

```tsx
{saveError && (
  <SaveErrorBanner
    message={saveError}
    onRetry={async () => {
      if (!sessionId) return;
      try {
        await sessions.update(sessionId, { state });
        setSaveError(null);
      } catch (err) {
        setSaveError((err as Error).message);
      }
    }}
    onDismiss={() => setSaveError(null)}
  />
)}
```

- [ ] **Step 3: Manual test by simulating failure**

Run dev server. In browser devtools, block `*supabase*` network requests. Ask a question. After `done`, banner appears. Click "Retry" after unblocking — banner disappears.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ask/SaveErrorBanner.tsx client/src/pages/ask.tsx
git commit -m "feat(ask): surface save failures with retry banner"
```

---

## Task 10: `SessionsSidebar` + `SessionRow` (component test)

**Files:**
- Create: `client/src/components/ask/SessionsSidebar.tsx`
- Create: `client/src/components/ask/SessionRow.tsx`
- Create: `client/src/components/ask/__tests__/SessionsSidebar.test.tsx`
- Modify: `client/src/components/ask/AskLayout.tsx`

- [ ] **Step 1: Write the failing test**

```tsx
// client/src/components/ask/__tests__/SessionsSidebar.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { SessionsSidebar } from "@/components/ask/SessionsSidebar";
import type { AskSessionSummary } from "@/lib/sessionTypes";

function sess(id: string, title: string, updated: string): AskSessionSummary {
  return {
    id,
    userId: "u",
    title,
    isPublic: false,
    model: "x",
    createdAt: updated,
    updatedAt: updated,
  };
}

describe("SessionsSidebar", () => {
  const now = new Date("2026-04-23T12:00:00Z");
  const sessions = [
    sess("a", "Today session", "2026-04-23T08:00:00Z"),
    sess("b", "Yesterday session", "2026-04-22T08:00:00Z"),
  ];

  it("renders group labels and session titles", () => {
    render(
      <MemoryRouter>
        <SessionsSidebar
          sessions={sessions}
          activeId={null}
          now={now}
          onRename={vi.fn()}
          onDelete={vi.fn()}
          onToggleShare={vi.fn()}
          onRegenerateTitle={vi.fn()}
        />
      </MemoryRouter>,
    );
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText("Today session")).toBeInTheDocument();
    expect(screen.getByText("Yesterday session")).toBeInTheDocument();
  });

  it("filter input narrows the list case-insensitively", async () => {
    render(
      <MemoryRouter>
        <SessionsSidebar
          sessions={sessions}
          activeId={null}
          now={now}
          onRename={vi.fn()}
          onDelete={vi.fn()}
          onToggleShare={vi.fn()}
          onRegenerateTitle={vi.fn()}
        />
      </MemoryRouter>,
    );
    await userEvent.type(screen.getByPlaceholderText(/filter/i), "yesterday");
    expect(screen.queryByText("Today session")).not.toBeInTheDocument();
    expect(screen.getByText("Yesterday session")).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run and confirm failure**

Run: `npm test --workspace client -- SessionsSidebar`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement `SessionRow`**

```tsx
// client/src/components/ask/SessionRow.tsx
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { AskSessionSummary } from "@/lib/sessionTypes";

export function SessionRow({
  session,
  active,
  onRename,
  onDelete,
  onToggleShare,
  onRegenerateTitle,
}: {
  session: AskSessionSummary;
  active: boolean;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleShare: (id: string, next: boolean) => void;
  onRegenerateTitle: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-accent",
        active && "bg-accent",
      )}
    >
      <Link
        to={`/ask/${session.id}`}
        className="flex-1 min-w-0 truncate"
        title={session.title ?? "Untitled"}
      >
        {session.title ?? "Untitled"}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Session actions"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onRename(session.id)}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRegenerateTitle(session.id)}>
            Regenerate title
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onToggleShare(session.id, !session.isPublic)}
          >
            {session.isPublic ? "Unshare" : "Share…"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => onDelete(session.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
```

- [ ] **Step 4: Implement `SessionsSidebar`**

```tsx
// client/src/components/ask/SessionsSidebar.tsx
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { groupSessions } from "@/lib/groupSessions";
import type { AskSessionSummary } from "@/lib/sessionTypes";
import { SessionRow } from "@/components/ask/SessionRow";

export function SessionsSidebar({
  sessions,
  activeId,
  now,
  onRename,
  onDelete,
  onToggleShare,
  onRegenerateTitle,
}: {
  sessions: AskSessionSummary[];
  activeId: string | null;
  now?: Date;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onToggleShare: (id: string, next: boolean) => void;
  onRegenerateTitle: (id: string) => void;
}) {
  const [filter, setFilter] = useState("");
  const filtered = useMemo(() => {
    if (!filter.trim()) return sessions;
    const needle = filter.toLowerCase();
    return sessions.filter((s) =>
      (s.title ?? "").toLowerCase().includes(needle),
    );
  }, [sessions, filter]);
  const groups = useMemo(() => groupSessions(filtered, now), [filtered, now]);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card/50">
      <div className="flex items-center justify-between gap-2 p-2">
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link to="/ask">
            <Plus className="size-4" /> New chat
          </Link>
        </Button>
      </div>
      <div className="px-2 pb-2">
        <Input
          placeholder="Filter…"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          aria-label="Filter sessions"
        />
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2">
        {groups.map((group) => (
          <div key={group.label} className="mb-3">
            <div className="px-2 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {group.label}
            </div>
            {group.sessions.map((s) => (
              <SessionRow
                key={s.id}
                session={s}
                active={s.id === activeId}
                onRename={onRename}
                onDelete={onDelete}
                onToggleShare={onToggleShare}
                onRegenerateTitle={onRegenerateTitle}
              />
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            No sessions yet.
          </div>
        )}
      </div>
    </aside>
  );
}
```

- [ ] **Step 5: Wire the sidebar into `AskLayout`**

```tsx
// client/src/components/ask/AskLayout.tsx
import { useUserData } from "@fluffylabs/shared-ui/supabase";
import { Outlet, useParams } from "react-router-dom";
import { AuthGate } from "@/components/ask/AuthGate";
import { SessionsSidebar } from "@/components/ask/SessionsSidebar";
import { useSessions } from "@/hooks/useSessions";
import { requestTitle } from "@/lib/askTitleClient";

export function AskLayout() {
  return (
    <AuthGate>
      <LayoutInner />
    </AuthGate>
  );
}

function LayoutInner() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const sessions = useSessions();
  const { data: keyData } = useUserData("openrouter-api-key", {
    appScoped: true,
  });
  const apiKey = typeof keyData === "string" ? keyData : null;
  return (
    <div className="flex h-full">
      <SessionsSidebar
        sessions={sessions.sessions ?? []}
        activeId={sessionId ?? null}
        onRename={(id) => {
          const title = window.prompt("New title?");
          if (title !== null) sessions.update(id, { title });
        }}
        onDelete={(id) => {
          if (window.confirm("Delete this session? Public links will 404.")) {
            sessions.remove(id);
          }
        }}
        onToggleShare={(id, next) => sessions.update(id, { isPublic: next })}
        onRegenerateTitle={async (id) => {
          if (!apiKey) {
            window.alert(
              "Add an OpenRouter API key in Settings before regenerating titles.",
            );
            return;
          }
          const record = await sessions.get(id);
          const first = record?.state.messages.find((m) => m.role === "user");
          if (!first || first.role !== "user") return;
          const title = await requestTitle({
            question: first.content,
            openrouterKey: apiKey,
          });
          if (title) await sessions.update(id, { title });
        }}
      />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
```

If `Input` is not already present at `client/src/components/ui/input.tsx`, add a minimal shadcn-style implementation (the repo uses shadcn conventions for UI primitives — check before creating).

- [ ] **Step 6: Run tests and app**

```bash
npm test --workspace client -- SessionsSidebar
```

Expected: PASS (2 tests).

Run dev server; verify sidebar lists sessions, Today/Yesterday groups appear, filter works, active row is highlighted, and dropdown actions trigger prompts.

- [ ] **Step 7: Commit**

```bash
git add client/src/components/ask/ \
        client/src/components/ui/input.tsx
git commit -m "feat(ask): left sidebar with session list, groups, filter, row actions"
```

---

## Task 11: `SharePopover` + session header integration

**Files:**
- Create: `client/src/components/ask/SharePopover.tsx`
- Modify: `client/src/pages/ask.tsx`

- [ ] **Step 1: Implement `SharePopover`**

```tsx
// client/src/components/ask/SharePopover.tsx
import { Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";

export function SharePopover({
  sessionId,
  isPublic,
  onToggle,
}: {
  sessionId: string;
  isPublic: boolean;
  onToggle: (next: boolean) => Promise<void>;
}) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}${window.location.pathname}#/ask/s/${sessionId}`;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Share2 className="size-4" />
          {isPublic ? "Shared" : "Share"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex items-center justify-between">
          <label htmlFor="public-toggle" className="text-sm">
            Make this conversation public
          </label>
          <Switch
            id="public-toggle"
            checked={isPublic}
            onCheckedChange={(checked) => onToggle(checked)}
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className={isPublic ? "" : "opacity-60"}
          />
          <Button
            size="icon"
            variant="outline"
            aria-label="Copy link"
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
        {!isPublic && (
          <p className="mt-2 text-xs text-muted-foreground">
            Off — anyone with the link will see a 404.
          </p>
        )}
        {copied && (
          <p className="mt-2 text-xs text-muted-foreground">Copied!</p>
        )}
      </PopoverContent>
    </Popover>
  );
}
```

If `Switch` does not exist at `client/src/components/ui/switch.tsx`, add a shadcn-style wrapper around `@radix-ui/react-switch`. Install `@radix-ui/react-switch` if needed.

- [ ] **Step 2: Render it in the session header of `AskPage`**

In `client/src/pages/ask.tsx`, near the existing ModelPicker/header row, add (only when `sessionId` exists):

```tsx
{sessionId && currentSession && (
  <SharePopover
    sessionId={sessionId}
    isPublic={currentSession.isPublic}
    onToggle={async (next) => {
      await sessions.update(sessionId, { isPublic: next });
    }}
  />
)}
```

`currentSession` is looked up from `sessions.sessions?.find(s => s.id === sessionId)`.

- [ ] **Step 3: Manual test**

Run dev server. Open a session. Toggle "Make this conversation public" — URL in popover becomes the shareable link. Copy it. Paste in incognito window — expect Task 12's read-only view (stub "Shared view — coming soon" until Task 12 lands).

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ask/SharePopover.tsx \
        client/src/components/ui/switch.tsx client/src/pages/ask.tsx \
        client/package.json package-lock.json
git commit -m "feat(ask): share popover toggles is_public and exposes link"
```

---

## Task 12: `/ask/s/:sessionId` public read-only view

**Files:**
- Modify: `client/src/pages/askShared.tsx` (was placeholder)

- [ ] **Step 1: Implement the page**

```tsx
// client/src/pages/askShared.tsx
import { useSupabaseContext } from "@fluffylabs/shared-ui/supabase";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CitationsPanel } from "@/components/chat/CitationsPanel";
import { Message } from "@/components/chat/Message";
import {
  type AskSessionRecord,
  type AskSessionRow,
  fromRow,
} from "@/lib/sessionTypes";
import { markForkPending } from "@/lib/forkPending";

export function AskSharedPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { client, user } = useSupabaseContext();
  const navigate = useNavigate();
  const [record, setRecord] = useState<AskSessionRecord | null | "notfound">(
    null,
  );

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      const { data, error } = await client
        .from("ask_sessions")
        .select("*")
        .eq("id", sessionId)
        .eq("is_public", true)
        .maybeSingle();
      if (cancelled) return;
      if (error || !data) {
        setRecord("notfound");
        return;
      }
      const parsed = fromRow(data as AskSessionRow);
      setRecord(parsed ?? "notfound");
    })();
    return () => {
      cancelled = true;
    };
  }, [client, sessionId]);

  if (record === null) {
    return <div className="p-4">Loading…</div>;
  }
  if (record === "notfound") {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold">Conversation not found</h1>
        <p className="mt-2 text-muted-foreground">
          This link is private, deleted, or never existed.
        </p>
      </div>
    );
  }

  const onFork = async () => {
    if (!sessionId) return;
    if (!user) {
      markForkPending(sessionId);
      navigate("/login");
      return;
    }
    // Call the fork helper from Task 13.
    await forkAndGo({ client, userId: user.id, source: record, navigate });
  };

  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col gap-4 p-4">
      <header className="flex items-center justify-between">
        <h1 className="truncate text-lg font-semibold">
          {record.title ?? "Shared conversation"}
        </h1>
        <Button onClick={onFork}>Continue this conversation</Button>
      </header>
      <div className="flex-1 overflow-y-auto">
        {record.state.messages.map((m) => (
          <Message key={m.id} message={m} />
        ))}
      </div>
      <CitationsPanel cards={record.state.cards} />
    </div>
  );
}
```

`forkAndGo` and `markForkPending` come from Task 13 — add stubs now so this compiles:

```ts
// temporary top of file, replaced in Task 13
import type { SupabaseClient } from "@supabase/supabase-js";
async function forkAndGo(_args: {
  client: SupabaseClient;
  userId: string;
  source: AskSessionRecord;
  navigate: (path: string) => void;
}) {
  throw new Error("forkAndGo not yet implemented (Task 13)");
}
```

- [ ] **Step 2: Verify Message + CitationsPanel accept the shared-view props**

Open `client/src/components/chat/Message.tsx` and `CitationsPanel.tsx`. Confirm they accept the same `ChatMessage` and `cards` shapes used here. If the props differ, wrap them in an adapter rather than modifying the existing components.

- [ ] **Step 3: Manual test**

Run dev server. Toggle a session public in your own account (Task 11). Open the `/ask/s/<id>` URL in incognito — read-only view appears. Attempt `/ask/s/<unshared-id>` — 404 view.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/askShared.tsx
git commit -m "feat(ask): public read-only shared view"
```

---

## Task 13: Fork flow (signed-in + deferred)

**Files:**
- Create: `client/src/lib/forkPending.ts`
- Create: `client/src/lib/__tests__/forkPending.test.ts`
- Modify: `client/src/pages/askShared.tsx`
- Modify: `client/src/App.tsx` (auth callback completes pending fork)

- [ ] **Step 1: Write the failing test for `forkPending`**

```ts
// client/src/lib/__tests__/forkPending.test.ts
import { beforeEach, describe, expect, it } from "vitest";
import {
  consumeForkPending,
  markForkPending,
} from "@/lib/forkPending";

describe("forkPending", () => {
  beforeEach(() => window.sessionStorage.clear());

  it("stores and consumes a single id", () => {
    markForkPending("abc");
    expect(consumeForkPending()).toBe("abc");
    expect(consumeForkPending()).toBeNull();
  });

  it("returns null when nothing stored", () => {
    expect(consumeForkPending()).toBeNull();
  });
});
```

Run: `npm test --workspace client -- forkPending`
Expected: FAIL — module not found.

- [ ] **Step 2: Implement**

```ts
// client/src/lib/forkPending.ts
const KEY = "ask.pendingFork";

export function markForkPending(sessionId: string): void {
  try {
    window.sessionStorage.setItem(KEY, sessionId);
  } catch {
    /* ignore */
  }
}

export function consumeForkPending(): string | null {
  try {
    const v = window.sessionStorage.getItem(KEY);
    if (v) window.sessionStorage.removeItem(KEY);
    return v ?? null;
  } catch {
    return null;
  }
}
```

- [ ] **Step 3: Run test**

Run: `npm test --workspace client -- forkPending`
Expected: PASS (2 tests).

- [ ] **Step 4: Implement `forkAndGo`**

Replace the stub in `client/src/pages/askShared.tsx`:

```ts
import { v4 as uuidv4 } from "uuid";
import { toRow } from "@/lib/sessionTypes";

async function forkAndGo(args: {
  client: SupabaseClient;
  userId: string;
  source: AskSessionRecord;
  navigate: (path: string) => void;
}) {
  const newId = uuidv4();
  const row = toRow({
    id: newId,
    userId: args.userId,
    title: args.source.title ? `Fork of ${args.source.title}` : null,
    isPublic: false,
    state: args.source.state,
  });
  const { error } = await args.client.from("ask_sessions").insert(row);
  if (error) throw error;
  args.navigate(`/ask/${newId}`);
}
```

- [ ] **Step 5: Complete pending fork after login**

In `client/src/App.tsx`, update the `AuthCallback` route's `onSuccess` handler so a pending fork is resolved:

```tsx
<Route
  path="/auth/callback"
  element={
    <AuthCallback
      onSuccess={() => {
        const pending = consumeForkPending();
        navigate(pending ? `/ask/s/${pending}` : "/");
      }}
      onError={() => navigate("/login")}
    />
  }
/>
```

Add `import { consumeForkPending } from "@/lib/forkPending";` at the top.

The shared view's effect must re-run the fork automatically when `user` becomes non-null and the stored ID matches the current route — add this to `askShared.tsx`:

```tsx
useEffect(() => {
  if (!user || !sessionId || !(record && record !== "notfound")) return;
  const pending = consumeForkPending();
  if (pending === sessionId) {
    forkAndGo({ client, userId: user.id, source: record, navigate });
  }
}, [user, sessionId, record, client, navigate]);
```

- [ ] **Step 6: Manual test both paths**

Signed-in fork: open `/ask/s/<public-id>` in the same session where you're signed in → click "Continue this conversation" → lands on `/ask/<new-id>` with the full history cloned.

Signed-out deferred fork:
1. Open incognito, no auth.
2. Visit `/ask/s/<public-id>`, click "Continue this conversation".
3. You land on `/login`.
4. Complete sign-in.
5. You are redirected back to `/ask/s/<id>`, which auto-forks and navigates to `/ask/<new-id>`.

- [ ] **Step 7: Commit**

```bash
git add client/src/lib/forkPending.ts client/src/lib/__tests__/forkPending.test.ts \
        client/src/pages/askShared.tsx client/src/App.tsx
git commit -m "feat(ask): fork flow (signed-in + deferred via sessionStorage)"
```

---

## Task 14: Abort in-flight stream on session switch

**Files:**
- Modify: `client/src/pages/ask.tsx`

- [ ] **Step 1: Abort when `sessionId` changes**

In `AskPage`, augment the hydration effect from Task 8:

```tsx
useEffect(() => {
  // ... existing hydration logic
  streamHandleRef.current?.abort();
  streamHandleRef.current = null;
}, [sessionId]);
```

(Place this *before* the async hydration block in the same effect, or as a sibling effect.)

- [ ] **Step 2: Manual test**

Run dev server. Start a long-running question in session A (e.g., a multi-tool-call question). While it streams, click a different session in the sidebar. Expected: the original stream stops, new session hydrates, previous completed turns remain persisted in session A when you return.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/ask.tsx
git commit -m "fix(ask): abort in-flight stream when switching sessions"
```

---

## Task 15: Full-system verification + docs

**Files:**
- Modify: `todo.md`

- [ ] **Step 1: Run full test suite**

Run: `npm test --workspace client` and `npm test --workspace backend`
Expected: All pass. Fix anything red.

- [ ] **Step 2: End-to-end smoke-test checklist**

Sign in as user A:
1. `/#/ask` → new chat → ask → URL becomes `/#/ask/<uuid>` → reload, see full history.
2. Ask a follow-up → both turns persist.
3. Sidebar shows Today group with this session; rename via dropdown → title updates live.
4. Toggle share popover on → copy URL.
5. Open copied URL in another browser signed out → read-only view renders, shows "Continue" button.
6. Click "Continue" → redirect to `/login` → sign in as user B → auto-fork → lands on `/#/ask/<new-id>` with cloned history under user B.
7. Back as user A, delete the shared session → user B's fork survives; `/ask/s/<id>` now 404s.

All steps must pass before checking off this task.

- [ ] **Step 3: Update `todo.md`**

Edit `todo.md` — mark `Ask sessions persistence… and browsing` and `Shareable sessions` as done:

```md
# Ask page improvements

- [ ] Ask page redesign
- [x] Ask sessions persistence (backend? supabase?) and browsing
- [x] Shareable sessions
- [ ] Regenerate question with different model
```

- [ ] **Step 4: Commit**

```bash
git add todo.md
git commit -m "chore: mark sessions persistence + shareable sessions done"
```

- [ ] **Step 5: Create PR**

```bash
git push -u origin td-ask-improvements
gh pr create --title "Ask sessions: persistence + shareable public links" \
  --body "$(cat <<'EOF'
## Summary
- Persist every Ask conversation per signed-in user in Supabase (new `ask_sessions` table with RLS).
- Multi-session UX with LHS sidebar (Today/Yesterday/... groups, filter, rename, delete, share).
- Public read-only shared links (`/ask/s/:id`) with revoke-by-toggle.
- Fork flow: signed-in immediate clone; signed-out deferred via sessionStorage + post-login redirect.

## Test plan
- [x] Unit tests: serialization, grouping, forkPending, reducer hydrate action, useSessions CRUD, sidebar filtering.
- [x] Manual E2E: create → persist → reload → rename → share → fork (both paths) → delete.
- [ ] RLS manually verified in Supabase Studio (anon cannot read private, can read public).
EOF
)"
```

---

## Self-Review Checklist

Run through before handing off to execution.

**Spec coverage (referencing `docs/superpowers/specs/2026-04-23-ask-sessions-design.md`):**

| Spec section                          | Implemented in               |
|---------------------------------------|------------------------------|
| `ask_sessions` schema + indexes + trigger | Task 1                    |
| RLS `owner_all` + `public_read`       | Task 1                       |
| Title generation (backend endpoint)   | Task 1b                      |
| Title generation (frontend wiring)    | Task 8b                      |
| Regenerate title action (sidebar)     | Task 10                      |
| `messages` JSONB shape, strip `isStreaming` | Task 2                  |
| Sidebar groups: Today/Yesterday/7/30/Older | Task 3                    |
| Frontend CRUD (no backend changes)    | Task 4                       |
| `hydrate` reducer action              | Task 5                       |
| Drop sessionStorage                   | Task 6                       |
| `/ask`, `/ask/:id`, `/ask/s/:id` routes + auth gate | Task 7         |
| Hydration + auto-save + first-message session create | Task 8        |
| Save-error banner                     | Task 9                       |
| Sidebar UI + row actions              | Task 10                      |
| Share popover + link copy             | Task 11                      |
| Public read-only view                 | Task 12                      |
| Fork (immediate + deferred)           | Task 13                      |
| Abort stream on switch                | Task 14                      |
| Hard delete (cascades share → 404)    | Task 1 (on delete cascade) + Task 10 (remove) |
| `deriveTitle` from first user message | Task 2                       |
| Live share (no snapshot)              | Implicit (one row, `public_read` policy) |

**Placeholder scan:** No "TBD", "TODO", or "implement later" strings in tasks. Each step shows exact code or command.

**Type consistency check:** 
- `AskSessionSummary` / `AskSessionRecord` / `AskSessionRow` used consistently across Tasks 2, 4, 10, 12, 13.
- `useSessions().update(id, {title})` / `.update(id, {isPublic})` / `.update(id, {state})` — signature matches across Tasks 4, 8, 9, 10, 11.
- `sessionId` route param shape matches across Tasks 7, 8, 10, 12, 13.

**Scope check:** No Ask page visual redesign. No regenerate-with-different-model. No full-text search. These are explicitly deferred in the spec.

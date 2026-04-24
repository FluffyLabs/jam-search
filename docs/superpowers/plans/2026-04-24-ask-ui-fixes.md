# /ask UI fixes — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix nine scoped /ask UI/UX defects: padding, broken session switching, missing text colors, dropdown parity, split session state, regenerate-title removal, "new chat" duplication, graypaper URL, share-from-dropdown flow.

**Architecture:** Mostly targeted edits. One structural change: `useSessions` moves to `@tanstack/react-query` so the sidebar and the page share one cache. New dep: `sonner` for toasts.

**Tech Stack:** React 19, TanStack Query 5, shadcn dropdowns, sonner, Vitest + React Testing Library, Node/Fastify backend.

**Spec:** `docs/superpowers/specs/2026-04-24-ask-ui-fixes-design.md`

---

## File Map

**Frontend**
- Modify `client/package.json` — add `sonner` dep.
- Modify `client/src/App.tsx` — widen `fullBleed`, mount `<Toaster />`.
- Modify `client/src/pages/ask.tsx` — clear `createdRef` on first use, delete in-section "New chat" button.
- Modify `client/src/components/ask/SessionRow.tsx` — remove "Regenerate title", align dropdown styling with ModelPicker, rewire Share to copy+toast+flip-public, add `text-foreground`.
- Modify `client/src/components/ask/SessionsSidebar.tsx` — drop `onRegenerateTitle` prop, add `text-foreground` on aside.
- Modify `client/src/components/ask/AskLayout.tsx` — drop `onRegenerateTitle` handler + unused import.
- Modify `client/src/hooks/useSessions.ts` — rewrite on top of react-query; keep factory exported for tests.
- Modify `client/src/hooks/__tests__/useSessions.test.ts` — wrap in `QueryClientProvider`.
- Modify `client/src/components/ask/__tests__/SessionsSidebar.test.tsx` — remove `onRegenerateTitle` prop usage.

**Backend**
- Modify `backend/src/ask/tools.ts` — plumb query into `buildGraypaperUrl`, match search-page URL format.

---

## Task 1: Install sonner and mount Toaster

**Files:**
- Modify: `client/package.json`
- Modify: `client/src/App.tsx`

- [ ] **Step 1: Install sonner**

Run in `client/`:

```bash
cd client && npm install sonner@^2.0.7
```

Expected: `sonner` added to `dependencies` in `client/package.json`.

- [ ] **Step 2: Mount Toaster in App.tsx**

Open `client/src/App.tsx`. Add the import near the other component imports (top of file, after line 9):

```tsx
import { Toaster } from "sonner";
```

Inside the JSX returned by `App()`, add `<Toaster />` just before `<ReactQueryDevtools initialIsOpen={false} />` (currently at line 162):

```tsx
      <Toaster position="bottom-right" richColors closeButton />
      <ReactQueryDevtools initialIsOpen={false} />
```

- [ ] **Step 3: Typecheck**

Run: `cd client && npm run typecheck`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add client/package.json client/package-lock.json client/src/App.tsx
git commit -m "ask: install sonner and mount global Toaster"
```

---

## Task 2: Widen `fullBleed` to cover all /ask subroutes

**Files:**
- Modify: `client/src/App.tsx:96`

- [ ] **Step 1: Change the `fullBleed` expression**

Open `client/src/App.tsx`. Replace:

```tsx
  // /ask manages its own scroll/padding so the section/aside border can
  // span the full available height.
  const fullBleed = pathname === "/ask";
```

with:

```tsx
  // /ask (and its nested session routes + shared view) manages its own
  // scroll/padding so the section/aside border can span the full height
  // and the shared page doesn't double-pad.
  const fullBleed = pathname === "/ask" || pathname.startsWith("/ask/");
```

- [ ] **Step 2: Manual verification**

Run `cd client && npm run dev`. In the browser:
- `/ask` (empty state) — no outer `p-4` padding.
- `/ask/<uuid>` (session view) — no outer `p-4` padding; content aligns with the empty state.
- `/ask/s/<uuid>` (shared view) — no outer padding; the page's own `mx-auto max-w-5xl p-4` is intact.

- [ ] **Step 3: Commit**

```bash
git add client/src/App.tsx
git commit -m "ask: remove outer p-4 on session and shared routes"
```

---

## Task 3: Fix session switching (clear `createdRef` on first use)

**Files:**
- Modify: `client/src/pages/ask.tsx:52-86`

- [ ] **Step 1: Change the `createdRef` guard to consume-once**

Open `client/src/pages/ask.tsx`. Replace this block (around line 63–69):

```tsx
    if (hydratedRef.current === sessionId) return;
    if (createdRef.current.has(sessionId)) {
      // We just created this row locally; avoid an immediate round-trip
      // that would overwrite our in-memory state with the freshly-written one.
      hydratedRef.current = sessionId;
      return;
    }
```

with:

```tsx
    if (hydratedRef.current === sessionId) return;
    if (createdRef.current.has(sessionId)) {
      // We just created this row locally; avoid an immediate round-trip
      // that would overwrite our in-memory state with the freshly-written one.
      // Consume the flag so that navigating away and back re-hydrates from DB.
      createdRef.current.delete(sessionId);
      hydratedRef.current = sessionId;
      return;
    }
```

- [ ] **Step 2: Manual verification**

Run `cd client && npm run dev`. Reproduce and confirm the fix:
1. Open `/ask`, send a question in session A → you land on `/ask/<A>`.
2. Create a second chat via the sidebar "New chat", send a question → you land on `/ask/<B>` with B's messages showing.
3. Click session A in the sidebar → A's messages should now appear (previously the page stayed on B).

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/ask.tsx
git commit -m "ask: consume createdRef flag so session re-visits re-hydrate"
```

---

## Task 4: Fix graypaper URL (match search-page format)

**Files:**
- Modify: `backend/src/ask/tools.ts:50-53, 162-171, 201-218`

- [ ] **Step 1: Change `buildGraypaperUrl` to accept a query**

Open `backend/src/ask/tools.ts`. Replace the function (lines 50–53):

```ts
function buildGraypaperUrl(title: string | undefined): string | undefined {
  if (!title) return undefined;
  return `https://graypaper.fluffylabs.dev/#/?section=${encodeURIComponent(title)}`;
}
```

with:

```ts
function buildGraypaperUrl(
  title: string | undefined,
  query: string
): string | undefined {
  if (!title) return undefined;
  // Match the search-results URL format byte-for-byte (no URL encoding).
  // The Graypaper reader's hash router expects this exact shape.
  return `https://graypaper.fluffylabs.dev/#/?search=${query}&section=${title}`;
}
```

- [ ] **Step 2: Pass the search query through `executeSearchAll`**

In the same file, inside `executeSearchAll` replace the graypaper push block (around line 162–171):

```ts
  for (const r of graypaper.results ?? []) {
    out.push({
      id: r.id,
      sourceType: "graypaper",
      preview: truncate(r.text ?? ""),
      title: r.title,
      url: buildGraypaperUrl(r.title),
      score: r.score,
    });
  }
```

with:

```ts
  for (const r of graypaper.results ?? []) {
    out.push({
      id: r.id,
      sourceType: "graypaper",
      preview: truncate(r.text ?? ""),
      title: r.title,
      url: buildGraypaperUrl(r.title, args.query),
      score: r.score,
    });
  }
```

- [ ] **Step 3: Update `resolveDocUrl` (no query available)**

In the same file, replace the `resolveDocUrl` function (lines 201–218):

```ts
function resolveDocUrl(doc: SearchDoc): string | undefined {
  switch (doc.type) {
    case "page":
      return doc.url;
    case "discord":
      return buildDiscordUrl(
        doc.serverId,
        doc.channelId,
        doc.threadId,
        doc.messageId
      );
    case "matrix":
      return buildMatrixUrl(doc.roomId, doc.messageId);
    case "graypaper_section":
    case "graypaper_version":
      return buildGraypaperUrl(doc.title);
  }
}
```

with:

```ts
function resolveDocUrl(doc: SearchDoc): string | undefined {
  switch (doc.type) {
    case "page":
      return doc.url;
    case "discord":
      return buildDiscordUrl(
        doc.serverId,
        doc.channelId,
        doc.threadId,
        doc.messageId
      );
    case "matrix":
      return buildMatrixUrl(doc.roomId, doc.messageId);
    case "graypaper_section":
    case "graypaper_version":
      // No search query context here; fall back to empty query so the
      // reader still routes to the section.
      return buildGraypaperUrl(doc.title, "");
  }
}
```

- [ ] **Step 4: Typecheck backend**

Run: `cd backend && npm run typecheck`
Expected: no errors.

- [ ] **Step 5: Manual verification**

Start the dev stack (`cd backend && npm run dev`, then `cd client && npm run dev`). Ask a question that triggers a graypaper citation. Click the resulting "Open reader" link in the sidebar. It should open the Graypaper reader scrolled to the cited section — identical behavior to clicking a result from the search page.

- [ ] **Step 6: Commit**

```bash
git add backend/src/ask/tools.ts
git commit -m "ask: match search-page graypaper URL format so reader links resolve"
```

---

## Task 5: Remove "Regenerate title" from session dropdown

**Files:**
- Modify: `client/src/components/ask/SessionRow.tsx`
- Modify: `client/src/components/ask/SessionsSidebar.tsx`
- Modify: `client/src/components/ask/AskLayout.tsx`
- Modify: `client/src/components/ask/__tests__/SessionsSidebar.test.tsx`

- [ ] **Step 1: Drop the menu item + prop in `SessionRow.tsx`**

Open `client/src/components/ask/SessionRow.tsx`. Replace the whole file with:

```tsx
import { MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { AskSessionSummary } from "@/lib/sessionTypes";
import { cn } from "@/lib/utils";

export function SessionRow({
  session,
  active,
  onRename,
  onDelete,
  onShare,
}: {
  session: AskSessionSummary;
  active: boolean;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "group flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-foreground hover:bg-accent",
        active && "bg-accent"
      )}
    >
      <Link
        to={`/ask/${session.id}`}
        className="flex-1 min-w-0 truncate text-foreground"
        title={session.title ?? "Untitled"}
      >
        {session.title ?? "Untitled"}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="opacity-0 group-hover:opacity-100 focus:opacity-100 text-muted-foreground hover:text-foreground"
          aria-label="Session actions"
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onRename(session.id)}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare(session.id)}>
            Share…
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
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

Notes on this step: the `onToggleShare` prop is being replaced by a single `onShare(id)` (the share logic — flip public, copy, toast — is implemented in Task 10 and lives in `AskLayout`). "Regenerate title" is gone. Styling cleanup (`text-foreground`, `text-muted-foreground` on trigger) is included here because these are all in the same file — leaving the styling for Task 7 would mean re-touching it.

- [ ] **Step 2: Remove `onRegenerateTitle` from `SessionsSidebar.tsx` and rename `onToggleShare` → `onShare`**

Open `client/src/components/ask/SessionsSidebar.tsx`. Replace the whole file with:

```tsx
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { SessionRow } from "@/components/ask/SessionRow";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { groupSessions } from "@/lib/groupSessions";
import type { AskSessionSummary } from "@/lib/sessionTypes";

export function SessionsSidebar({
  sessions,
  activeId,
  now,
  onRename,
  onDelete,
  onShare,
}: {
  sessions: AskSessionSummary[];
  activeId: string | null;
  now?: Date;
  onRename: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
}) {
  const [filter, setFilter] = useState("");
  const filtered = useMemo(() => {
    if (!filter.trim()) return sessions;
    const needle = filter.toLowerCase();
    return sessions.filter((s) =>
      (s.title ?? "Untitled").toLowerCase().includes(needle)
    );
  }, [sessions, filter]);
  const groups = useMemo(() => groupSessions(filtered, now), [filtered, now]);

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card/50 text-foreground">
      <div className="p-2">
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
                onShare={onShare}
              />
            ))}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="p-4 text-center text-sm text-muted-foreground">
            {sessions.length === 0 ? "No sessions yet." : "No matches."}
          </div>
        )}
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Remove `onRegenerateTitle` wiring from `AskLayout.tsx` (placeholder onShare for now)**

Open `client/src/components/ask/AskLayout.tsx`. Replace the whole file with:

```tsx
import { Outlet, useParams } from "react-router-dom";
import { AuthGate } from "@/components/ask/AuthGate";
import { SessionsSidebar } from "@/components/ask/SessionsSidebar";
import { useSessions } from "@/hooks/useSessions";

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

  return (
    <div className="flex h-full">
      <SessionsSidebar
        sessions={sessions.sessions ?? []}
        activeId={sessionId ?? null}
        onRename={(id) => {
          const nextTitle = window.prompt("New title?");
          if (nextTitle !== null && nextTitle.trim() !== "") {
            sessions.update(id, { title: nextTitle.trim() });
          }
        }}
        onDelete={(id) => {
          if (
            window.confirm("Delete this session? Any public link will 404.")
          ) {
            sessions.remove(id);
          }
        }}
        onShare={() => {
          // Implemented in Task 10 (flip public + copy + toast).
        }}
      />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
```

Notes on this step: we intentionally leave `onShare` as a no-op here. Task 10 will replace this body.

- [ ] **Step 4: Fix `SessionsSidebar.test.tsx`**

Open `client/src/components/ask/__tests__/SessionsSidebar.test.tsx`. Replace:

```tsx
      <SessionsSidebar
        sessions={sessions}
        activeId={null}
        now={new Date("2026-04-23T12:00:00Z")}
        onRename={vi.fn()}
        onDelete={vi.fn()}
        onToggleShare={vi.fn()}
        onRegenerateTitle={vi.fn()}
      />
```

with:

```tsx
      <SessionsSidebar
        sessions={sessions}
        activeId={null}
        now={new Date("2026-04-23T12:00:00Z")}
        onRename={vi.fn()}
        onDelete={vi.fn()}
        onShare={vi.fn()}
      />
```

- [ ] **Step 5: Run tests and typecheck**

Run: `cd client && npm run typecheck && npm test`
Expected: typecheck clean, all tests pass.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/ask/SessionRow.tsx \
        client/src/components/ask/SessionsSidebar.tsx \
        client/src/components/ask/AskLayout.tsx \
        client/src/components/ask/__tests__/SessionsSidebar.test.tsx
git commit -m "ask: drop regenerate-title action; introduce onShare prop"
```

---

## Task 6: Remove "New chat" button from ask.tsx main section

**Files:**
- Modify: `client/src/pages/ask.tsx:281-297, 349-351`

- [ ] **Step 1: Delete the button and its handler**

Open `client/src/pages/ask.tsx`. Delete `handleNewChat` (around lines 281–285):

```tsx
  const handleNewChat = () => {
    streamHandleRef.current?.abort();
    streamHandleRef.current = null;
    navigate("/ask");
  };
```

And replace the sticky-header content (around lines 338–353):

```tsx
                <div className="sticky top-0 z-10 backdrop-blur bg-background/80 border-b border-border/60">
                  <div className="max-w-[52rem] mx-auto px-6 py-2 flex items-center justify-end gap-1">
                    {activeSession && sessionId && (
                      <SharePopover
                        sessionId={sessionId}
                        isPublic={activeSession.isPublic}
                        onToggle={(next) =>
                          sessions.update(sessionId, { isPublic: next })
                        }
                      />
                    )}
                    <Button variant="ghost" size="sm" onClick={handleNewChat}>
                      New chat
                    </Button>
                  </div>
                </div>
```

with:

```tsx
                {activeSession && sessionId && (
                  <div className="sticky top-0 z-10 backdrop-blur bg-background/80 border-b border-border/60">
                    <div className="max-w-[52rem] mx-auto px-6 py-2 flex items-center justify-end gap-1">
                      <SharePopover
                        sessionId={sessionId}
                        isPublic={activeSession.isPublic}
                        onToggle={(next) =>
                          sessions.update(sessionId, { isPublic: next })
                        }
                      />
                    </div>
                  </div>
                )}
```

Notes on this step: the whole sticky header is now conditional — without `SharePopover` and without "New chat", there's nothing to show otherwise.

- [ ] **Step 2: Typecheck**

Run: `cd client && npm run typecheck`
Expected: no errors (no stray references to `handleNewChat`).

- [ ] **Step 3: Manual verification**

Start dev; open an existing session. The sticky header should only show the Share button. Start a fresh chat (empty state, `/ask`) — no header at all, only the centered empty state.

- [ ] **Step 4: Commit**

```bash
git add client/src/pages/ask.tsx
git commit -m "ask: drop redundant New chat button from session header"
```

---

## Task 7: Add `text-foreground` where missing

**Files:**
- Modify: `client/src/pages/ask.tsx` (sticky header wrapper, if inherited color is off)

Most of the drift lives in `SessionRow` / `SessionsSidebar`, already addressed in Task 5. This task sweeps the remaining /ask surfaces.

- [ ] **Step 1: Audit + tweak `ask.tsx` surfaces**

Open `client/src/pages/ask.tsx`. Verify:

- The outer wrapper already has `bg-background`. `text-foreground` should be added so descendants without explicit colors render correctly. Change line 301:

```tsx
    <div className="flex flex-col h-full bg-background">
```

to:

```tsx
    <div className="flex flex-col h-full bg-background text-foreground">
```

- The `<aside>` on line 379:

```tsx
        <aside className="hidden lg:block border-l-1 border-l-white dark:border-l-1 dark:border-l-[#353535] overflow-y-auto bg-card/20 px-5 py-6">
```

Change to:

```tsx
        <aside className="hidden lg:block border-l-1 border-l-white dark:border-l-1 dark:border-l-[#353535] overflow-y-auto bg-card/20 px-5 py-6 text-foreground">
```

- [ ] **Step 2: Manual verification in dark mode**

Run `cd client && npm run dev`. Toggle dark mode via the apps sidebar. Check that session-row titles, the citations panel text, and any descendant text renders with the foreground color (no muddy/low-contrast grays leaking through).

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/ask.tsx
git commit -m "ask: add explicit text-foreground on /ask shells"
```

---

## Task 8: Align session dropdown visuals with ModelPicker

**Files:**
- Modify: `client/src/components/ask/SessionRow.tsx`

`DropdownMenuLabel` + `DropdownMenuSeparator` (already present in `ui/dropdown-menu.tsx`) give the ModelPicker its distinctive hierarchy. Session row should use the same primitives for visual parity.

- [ ] **Step 1: Add a label and separator to `SessionRow`'s dropdown**

Open `client/src/components/ask/SessionRow.tsx`. Extend the existing imports:

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
```

Replace the `DropdownMenuContent` body:

```tsx
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onRename(session.id)}>
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare(session.id)}>
            Share…
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(session.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
```

with:

```tsx
        <DropdownMenuContent align="end" className="min-w-[12rem]">
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            Session
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onRename(session.id)}
          >
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => onShare(session.id)}
          >
            Share…
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer text-destructive focus:text-destructive"
            onClick={() => onDelete(session.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
```

Rationale: mirrors `ModelPicker` — a muted header label, a separator, then items. Same base `DropdownMenuItem` styling, `min-w-[12rem]` sized for the short session menu (ModelPicker uses `min-w-[18rem]` because model labels are longer).

- [ ] **Step 2: Manual verification**

Run `cd client && npm run dev`. Open `/ask`, hover a session row, click the `⋯` button. The menu should have a "Session" label row, a separator, then items matching the ModelPicker visual weight.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/ask/SessionRow.tsx
git commit -m "ask: align session dropdown hierarchy with ModelPicker"
```

---

## Task 9: Refactor `useSessions` to a react-query-backed shared cache

**Files:**
- Modify: `client/src/hooks/useSessions.ts`
- Modify: `client/src/hooks/__tests__/useSessions.test.ts`

Root cause of "sessions randomly appear/disappear": `AskLayout` and `AskPage` each instantiate `useSessions()` and hold independent `useState` arrays. Moving to react-query puts the list in one shared cache keyed by `["ask_sessions", userId]`; mutations invalidate it and both consumers re-read automatically.

- [ ] **Step 1: Rewrite `useSessions.ts`**

Open `client/src/hooks/useSessions.ts`. Replace the whole file with:

```ts
import { useSupabaseContext } from "@fluffylabs/shared-ui/supabase/context";
import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { SupabaseClient } from "@supabase/supabase-js";
import { useCallback, useMemo } from "react";
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
    }>
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

function sessionsKey(userId: string): readonly unknown[] {
  return ["ask_sessions", userId] as const;
}

async function fetchSessions(
  supabase: SupabaseClient,
  userId: string
): Promise<AskSessionSummary[]> {
  const { data, error } = await supabase
    .from("ask_sessions")
    .select("id,user_id,title,is_public,model,created_at,updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as AskSessionRow[]).map(rowToSummary);
}

async function fetchSessionById(
  supabase: SupabaseClient,
  id: string
): Promise<AskSessionRecord | null> {
  const { data, error } = await supabase
    .from("ask_sessions")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  if (!data) return null;
  return fromRow(data as AskSessionRow);
}

/**
 * Factory kept so tests can inject a stub Supabase client + userId without
 * going through the SupabaseContext. Consumers in app code use the default
 * `useSessions` export below.
 */
export function createUseSessions(deps: {
  supabase: SupabaseClient;
  userId: string;
}) {
  const { supabase, userId } = deps;
  return function useSessions(): UseSessionsApi {
    const queryClient = useQueryClient();
    const key = useMemo(() => sessionsKey(userId), []);

    const query = useQuery<AskSessionSummary[], Error>({
      queryKey: key,
      queryFn: () => fetchSessions(supabase, userId),
    });

    const invalidate = useCallback(
      () => queryClient.invalidateQueries({ queryKey: key }),
      [queryClient, key]
    );

    const createMutation = useMutation({
      mutationFn: async (args: {
        id: string;
        title: string | null;
        state: AskConversationState;
      }) => {
        const row = toRow({
          id: args.id,
          userId,
          title: args.title,
          isPublic: false,
          state: args.state,
        });
        const { error } = await supabase.from("ask_sessions").insert(row);
        if (error) throw new Error(error.message);
      },
      onSuccess: () => {
        void invalidate();
      },
    });

    const updateMutation = useMutation({
      mutationFn: async (args: {
        id: string;
        patch: Partial<{
          title: string | null;
          isPublic: boolean;
          state: AskConversationState;
        }>;
      }) => {
        const dbPatch: Record<string, unknown> = {};
        if ("title" in args.patch) dbPatch.title = args.patch.title ?? null;
        if ("isPublic" in args.patch) dbPatch.is_public = args.patch.isPublic;
        if (args.patch.state) {
          const row = toRow({
            id: args.id,
            userId,
            title: null,
            isPublic: false,
            state: args.patch.state,
          });
          dbPatch.messages = row.messages;
          dbPatch.cards = row.cards;
          dbPatch.model = row.model;
        }
        const { error } = await supabase
          .from("ask_sessions")
          .update(dbPatch)
          .eq("id", args.id);
        if (error) throw new Error(error.message);
      },
      onSuccess: () => {
        void invalidate();
      },
    });

    const removeMutation = useMutation({
      mutationFn: async (id: string) => {
        const { error } = await supabase
          .from("ask_sessions")
          .delete()
          .eq("id", id);
        if (error) throw new Error(error.message);
      },
      onSuccess: () => {
        void invalidate();
      },
    });

    const list = useCallback(async () => {
      await queryClient.refetchQueries({ queryKey: key });
    }, [queryClient, key]);

    const get = useCallback(async (id: string) => {
      return fetchSessionById(supabase, id);
    }, []);

    const create = useCallback<UseSessionsApi["create"]>(
      async (args) => {
        await createMutation.mutateAsync(args);
      },
      [createMutation]
    );

    const update = useCallback<UseSessionsApi["update"]>(
      async (id, patch) => {
        await updateMutation.mutateAsync({ id, patch });
      },
      [updateMutation]
    );

    const remove = useCallback(
      async (id: string) => {
        await removeMutation.mutateAsync(id);
      },
      [removeMutation]
    );

    const mutationError =
      createMutation.error?.message ??
      updateMutation.error?.message ??
      removeMutation.error?.message ??
      null;
    const error = query.error?.message ?? mutationError ?? null;

    return {
      sessions: query.data,
      error,
      list,
      get,
      create,
      update,
      remove,
    };
  };
}

export function useSessions(): UseSessionsApi {
  const ctx = useSupabaseContext();
  if (!ctx.user) {
    throw new Error("useSessions requires an authenticated user");
  }
  return createUseSessions({ supabase: ctx.client, userId: ctx.user.id })();
}

/**
 * Helper for forcibly refreshing the sessions cache outside the hook (e.g.
 * after a fork from the shared-view page). Rarely needed.
 */
export function invalidateSessions(
  queryClient: QueryClient,
  userId: string
): void {
  void queryClient.invalidateQueries({ queryKey: sessionsKey(userId) });
}
```

Notes on this step: the external API (`UseSessionsApi`) is unchanged, so `ask.tsx` and `AskLayout.tsx` keep compiling without further edits. `list()` is kept for parity; it now force-refetches the shared query. `get()` still bypasses the cache (it reads a full record with `state`, which the list cache doesn't hold).

- [ ] **Step 2: Update the unit tests to provide a QueryClientProvider**

Open `client/src/hooks/__tests__/useSessions.test.ts`. Replace the whole file with:

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";
import { createUseSessions } from "@/hooks/useSessions";

interface Builder {
  select: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
}

function makeClient(rows: unknown[] = []) {
  const builder = {} as Builder;
  builder.select = vi.fn(() => builder);
  builder.eq = vi.fn(() => builder);
  builder.order = vi.fn(() => Promise.resolve({ data: rows, error: null }));
  builder.insert = vi.fn(() =>
    Promise.resolve({ data: rows[0] ?? null, error: null })
  );
  builder.update = vi.fn(() => builder);
  builder.delete = vi.fn(() => builder);
  builder.single = vi.fn(() =>
    Promise.resolve({ data: rows[0] ?? null, error: null })
  );
  builder.maybeSingle = vi.fn(() =>
    Promise.resolve({ data: rows[0] ?? null, error: null })
  );
  const from = vi.fn(() => builder);
  return { client: { from }, from, builder };
}

function wrapperFactory() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, gcTime: 0 },
      mutations: { retry: false },
    },
  });
  const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) =>
    React.createElement(
      QueryClientProvider,
      { client: queryClient },
      children
    );
  return { wrapper: Wrapper, queryClient };
}

describe("useSessions", () => {
  it("list() queries ask_sessions ordered by updated_at desc for the user", async () => {
    const { client, from, builder } = makeClient([]);
    const { wrapper } = wrapperFactory();
    const useHook = createUseSessions({
      supabase: client as never,
      userId: "u1",
    });
    const hook = renderHook(() => useHook(), { wrapper });
    await waitFor(() =>
      expect(hook.result.current.sessions).not.toBeUndefined()
    );
    expect(from).toHaveBeenCalledWith("ask_sessions");
    expect(builder.select).toHaveBeenCalled();
    expect(builder.eq).toHaveBeenCalledWith("user_id", "u1");
    expect(builder.order).toHaveBeenCalledWith("updated_at", {
      ascending: false,
    });
  });

  it("create() inserts a row with toRow()-shaped payload", async () => {
    const { client, builder } = makeClient();
    const { wrapper } = wrapperFactory();
    const useHook = createUseSessions({
      supabase: client as never,
      userId: "u1",
    });
    const hook = renderHook(() => useHook(), { wrapper });
    await hook.result.current.create({
      id: "11111111-1111-1111-1111-111111111111",
      title: "Hello",
      state: {
        model: "m",
        cards: {},
        messages: [{ id: "u", role: "user", content: "hi" }],
      },
    });
    expect(builder.insert).toHaveBeenCalledWith(
      expect.objectContaining({
        id: "11111111-1111-1111-1111-111111111111",
        user_id: "u1",
        title: "Hello",
        is_public: false,
        model: "m",
      })
    );
  });

  it("update(id, {isPublic}) sends is_public patch", async () => {
    const { client, builder } = makeClient();
    const { wrapper } = wrapperFactory();
    const useHook = createUseSessions({
      supabase: client as never,
      userId: "u1",
    });
    const hook = renderHook(() => useHook(), { wrapper });
    await hook.result.current.update("abc", { isPublic: true });
    expect(builder.update).toHaveBeenCalledWith(
      expect.objectContaining({ is_public: true })
    );
    expect(builder.eq).toHaveBeenCalledWith("id", "abc");
  });

  it("remove() deletes by id", async () => {
    const { client, builder } = makeClient();
    const { wrapper } = wrapperFactory();
    const useHook = createUseSessions({
      supabase: client as never,
      userId: "u1",
    });
    const hook = renderHook(() => useHook(), { wrapper });
    await hook.result.current.remove("abc");
    expect(builder.delete).toHaveBeenCalled();
    expect(builder.eq).toHaveBeenCalledWith("id", "abc");
  });

  it("mutations invalidate the shared sessions query (both consumers see the update)", async () => {
    // Two renderHook calls sharing a QueryClient simulate AskLayout + AskPage.
    const { client, builder } = makeClient([]);
    const { wrapper } = wrapperFactory();
    const useHook = createUseSessions({
      supabase: client as never,
      userId: "u1",
    });
    const a = renderHook(() => useHook(), { wrapper });
    const b = renderHook(() => useHook(), { wrapper });

    await waitFor(() => expect(a.result.current.sessions).not.toBeUndefined());
    await waitFor(() => expect(b.result.current.sessions).not.toBeUndefined());

    // Reset call counts from the initial load.
    builder.order.mockClear();

    await a.result.current.create({
      id: "11111111-1111-1111-1111-111111111111",
      title: "Hello",
      state: { model: "m", cards: {}, messages: [] },
    });

    // Both hooks should have triggered a refetch via the shared cache.
    await waitFor(() => expect(builder.order).toHaveBeenCalled());
  });
});
```

- [ ] **Step 3: Run tests and typecheck**

Run: `cd client && npm run typecheck && npm test`
Expected: typecheck clean, all tests pass (including the new shared-cache test).

- [ ] **Step 4: Manual verification**

Run `cd client && npm run dev`. Open `/ask` in a single tab and:
1. Create a new chat from the empty state. The sidebar's session list should immediately show the new row (no manual refresh).
2. Click `⋯` → Delete on a session. The sidebar row should disappear right away.
3. Rename a session via `⋯` → Rename. The sidebar should reflect the new title.

- [ ] **Step 5: Commit**

```bash
git add client/src/hooks/useSessions.ts client/src/hooks/__tests__/useSessions.test.ts
git commit -m "ask: back useSessions with react-query so sidebar and page share one cache"
```

---

## Task 10: Wire dropdown Share → flip public + copy + toast

**Files:**
- Modify: `client/src/components/ask/AskLayout.tsx`

The `onShare` placeholder from Task 5 now gets real behavior. This task depends on sonner (Task 1) and on the shared-cache `useSessions` (Task 9).

- [ ] **Step 1: Add a helper for the shareable link**

Open `client/src/components/ask/AskLayout.tsx`. Replace the whole file with:

```tsx
import { Outlet, useParams } from "react-router-dom";
import { toast } from "sonner";
import { AuthGate } from "@/components/ask/AuthGate";
import { SessionsSidebar } from "@/components/ask/SessionsSidebar";
import { useSessions } from "@/hooks/useSessions";

export function AskLayout() {
  return (
    <AuthGate>
      <LayoutInner />
    </AuthGate>
  );
}

function shareUrlFor(sessionId: string): string {
  return `${window.location.origin}${window.location.pathname}#/ask/s/${sessionId}`;
}

function LayoutInner() {
  const { sessionId } = useParams<{ sessionId?: string }>();
  const sessions = useSessions();

  return (
    <div className="flex h-full">
      <SessionsSidebar
        sessions={sessions.sessions ?? []}
        activeId={sessionId ?? null}
        onRename={(id) => {
          const nextTitle = window.prompt("New title?");
          if (nextTitle !== null && nextTitle.trim() !== "") {
            sessions.update(id, { title: nextTitle.trim() });
          }
        }}
        onDelete={(id) => {
          if (
            window.confirm("Delete this session? Any public link will 404.")
          ) {
            sessions.remove(id);
          }
        }}
        onShare={async (id) => {
          const session = sessions.sessions?.find((s) => s.id === id);
          const wasPublic = session?.isPublic === true;
          try {
            if (!wasPublic) {
              await sessions.update(id, { isPublic: true });
            }
            await navigator.clipboard.writeText(shareUrlFor(id));
            toast.success(
              wasPublic ? "Link copied" : "Link copied. Session is public now"
            );
          } catch (err) {
            toast.error(
              `Couldn't share: ${(err as Error).message ?? "unknown error"}`
            );
          }
        }}
      />
      <div className="flex-1 min-w-0">
        <Outlet />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `cd client && npm run typecheck`
Expected: no errors.

- [ ] **Step 3: Manual verification**

Run `cd client && npm run dev`. In the sidebar:
1. On a **private** session, click `⋯` → Share. A toast appears: "Link copied. Session is public now." The session's badge in the session header (when open) flips to "Shared". The clipboard contains the `/ask/s/<id>` URL.
2. On an already-**public** session, click `⋯` → Share. Toast: "Link copied." No state change.
3. In a clipboard-disabled context (or by denying clipboard permission) the error toast fires instead.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/ask/AskLayout.tsx
git commit -m "ask: share from sidebar dropdown flips public, copies, toasts"
```

---

## Final verification

- [ ] **Step 1: Run the full client test suite and linter**

Run:

```bash
cd client && npm run qa && npm test
```

Expected: lint clean, all tests pass.

- [ ] **Step 2: Backend typecheck**

Run:

```bash
cd backend && npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: End-to-end smoke test**

Start both servers (`cd backend && npm run dev`, then `cd client && npm run dev`). Walk through all nine fixes back-to-back:

1. Empty `/ask` and an active `/ask/<id>` — both full-bleed, no double padding.
2. Create session A, create session B, click back to A in sidebar — A's messages load.
3. Dark mode: session titles, sticky header, citations panel — readable, no drift.
4. Compare session `⋯` dropdown vs. ModelPicker — same label/separator hierarchy.
5. Create a new chat and observe sidebar list updates without a refresh.
6. Empty state + session view — no in-page "New chat" button (sidebar one only).
7. Ask something that produces a graypaper citation; clicking "Open reader" opens the correct section.
8. Session dropdown: no "Regenerate title" entry.
9. Click `⋯` → Share on a private session: toast appears and the link is in the clipboard; the session is now public.

- [ ] **Step 4: Push branch for review**

```bash
git push -u origin td-ask-ui-fixes
```

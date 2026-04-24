# Ask Sessions: Persistence + Shareable Public Links

**Date:** 2026-04-23
**Status:** Draft for review
**Scope:** Backend data model, frontend persistence layer, share flow, sidebar UX for the Ask feature.

## Goals

1. Persist every Ask conversation forever, scoped to a signed-in user.
2. Let the user keep and switch between multiple conversations via a left-hand sidebar.
3. Let the owner opt in to making a session publicly viewable by URL ("share link").
4. Let a signed-in visitor fork a public session into their own account to continue it.

## Non-Goals

- Anonymous Ask usage. Auth is required to use `/ask` at all.
- Snapshot sharing. Shared links reflect live state of the source session.
- Realtime collaboration (two users editing the same session).
- Full-text search inside a user's session history (deferred; sidebar search is client-side only).
- Per-message edit/regenerate beyond the last assistant turn (separate roadmap item).
- Cross-device streaming continuity (closing the tab mid-stream loses the partial assistant turn).
- Backend session awareness. `/ask` stays stateless.

## Architecture Overview

Stateless backend, Supabase-backed frontend.

- **Backend `/ask`**: unchanged. SSE-streaming, no session awareness, no DB access for sessions.
- **Supabase**: one new table `ask_sessions` with Row Level Security (RLS) policies. The frontend reads and writes directly.
- **Frontend**: a new `useSessions()` hook composes with the existing `useAskConversation` reducer. On session load it hydrates from Supabase; after each streamed turn completes it upserts the session row.
- **Auth**: existing Supabase auth. Unauthenticated visits to `/ask` show a sign-in CTA. Public shared-link routes bypass this gate for read-only access.
- **Sharing**: toggled via an `is_public` boolean on the row. Public sessions readable via the same `SELECT` path under an RLS policy that permits anonymous reads when `is_public = true`.
- **Forking**: viewer of a public link clicks "Continue this conversation" → if not signed in, redirected through auth, then an INSERT clones the `messages`/`cards`/`model` fields into a new session owned by the viewer. No linkage to the original.

## Data Model

### `ask_sessions` table

| column      | type        | notes                                                   |
|-------------|-------------|---------------------------------------------------------|
| `id`        | `uuid` PK   | Generated server-side (`gen_random_uuid()`).            |
| `user_id`   | `uuid` FK   | References `auth.users(id)`. `ON DELETE CASCADE`.       |
| `title`     | `text`      | Nullable. Auto-populated from first user message.       |
| `is_public` | `boolean`   | Default `false`. Toggled by Share button.               |
| `model`     | `text`      | Model string used for this session (user-editable).     |
| `messages`  | `jsonb`     | Array of `ChatMessage`-shaped records (see below).      |
| `cards`     | `jsonb`     | `Record<docId, CitationCardData>` — the citation cache. |
| `created_at`| `timestamptz` | Default `now()`.                                      |
| `updated_at`| `timestamptz` | Default `now()`. Trigger updates on write.            |

**Indexes:**
- `idx_ask_sessions_user_id_updated_at (user_id, updated_at DESC)` — drives the sidebar list.
- `idx_ask_sessions_public (id) WHERE is_public = true` — partial index for the public-read path.

**No separate `ask_messages` table.** The `messages` JSONB array is the single source of truth for a conversation. Messages are small enough (even 100-message sessions with tool calls are well under 200 KB) that rewriting the whole blob per turn is acceptable.

### `messages` JSONB shape

The frontend's **UI-level** message model (`UserMessage | AssistantMessage` from `client/src/pages/ask/`) is serialized directly — not the wire-format `ChatMessage` shape the backend consumes. This preserves rendered tool calls and citations without forcing a replay on load.

```jsonc
[
  { "id": "…", "role": "user", "content": "…" },
  {
    "id": "…",
    "role": "assistant",
    "parts": [
      { "type": "text", "text": "…" },
      { "type": "tool", "name": "search_graypaper", "args": {...}, "resultCount": 5 }
    ],
    "citations": [{ "n": 1, "docId": "…", "sourceType": "graypaper" }]
  }
]
```

Partial / streaming messages are **not** persisted. Transient fields like `isStreaming` and `error` are stripped on write — only final, completed turns are stored.

When the user sends a follow-up, the frontend reconstructs the OpenRouter wire-format history from this UI shape before calling `/ask`, exactly as it does today for in-memory sessions.

### RLS policies

```sql
ALTER TABLE ask_sessions ENABLE ROW LEVEL SECURITY;

-- Owner can do everything with their sessions.
CREATE POLICY "owner_all" ON ask_sessions
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Anyone (including unauthenticated) can read public sessions.
CREATE POLICY "public_read" ON ask_sessions
  FOR SELECT
  USING (is_public = true);
```

The `auth.uid() = user_id` check on INSERT prevents forgery; combined with the FK to `auth.users`, a client cannot create sessions attributed to other users.

## Persistence Lifecycle

### Session creation

The URL is the source of truth for "which session is active". A session row is created lazily: the first time the user submits a message on a route without a session ID, the frontend:

1. Generates a UUID client-side (so the URL can update immediately).
2. Navigates to `/ask/<uuid>` (replace, not push — the prior blank `/ask` shouldn't land in history).
3. Initiates the SSE stream to `/ask` as today.
4. **In parallel**, fires a non-streaming `POST /ask/title` request with the first user message. The response (a short title, ~5–8 words) is written back to the session row via a follow-up UPDATE. The main answer stream is not blocked by title generation.
5. On the main stream's `done`, UPDATEs the row with the full `messages` array and `cards`. If title generation has also completed by then, the `title` field is included in the same write; otherwise the title write lands separately when it resolves.

### Title generation

Generated once per session by a cheap model, server-side:

- **Endpoint:** `POST /ask/title` — new backend route. Non-streaming. Request: `{ question: string, openrouterKey: string }`. Response: `{ title: string }`.
- **Model:** hardcoded on the backend via `TITLE_MODEL` env var, default `anthropic/claude-haiku-4-5`. Not user-selectable.
- **Prompt:** a short system prompt instructing the model to return a 5–8 word title, no quotes, no trailing punctuation.
- **Cost:** borne by the user's own OpenRouter key — same mechanism as `/ask`. Fractions of a cent per session, but callers should surface this somewhere in Settings.
- **Failure modes:** on error or timeout (5s cap), the session `title` stays `null` and the sidebar renders an "Untitled" placeholder. No retry.
- **Regeneration:** no automatic regen on subsequent turns. A "Regenerate title" action in the sidebar row menu lets the user re-run generation manually. Rename remains available for full manual override.

### Turn completion writes

After every `done` event for an assistant turn, the frontend UPDATEs the session row with the full current `messages` and `cards` state. `updated_at` advances, which repositions the session in the sidebar.

The write is fire-and-forget — UI does not block on it. A failed write surfaces as a small banner ("Couldn't save. Retry.") but does not interrupt the streaming experience. Retries are manual; no automatic background retry loop in v1.

### Interrupted streams

If the tab is closed mid-stream, the in-flight assistant turn is lost. The previously-completed turns are already persisted. On next load, the session hydrates to a clean state — no "resume" or "this message was cut off" UX.

### Deletion

Hard delete. A deleted session's public link 404s immediately. No soft-delete column, no recovery.

### Title editing

Users can rename a session from the sidebar hover menu (single-field UPDATE of `title`). The same menu offers "Regenerate title" which re-calls `/ask/title` with the first user message and overwrites `title`.

## URL Structure & Routing

| Route                    | Access                             | Behavior                                                                                  |
|--------------------------|------------------------------------|-------------------------------------------------------------------------------------------|
| `/ask`                   | Signed-in only                     | Blank "new chat" state. Sidebar visible. First message generates UUID and navigates.      |
| `/ask/<session-uuid>`    | Owner only (RLS enforced)          | Full chat UI for that session. Sidebar visible.                                           |
| `/ask/s/<session-uuid>`  | Anyone (RLS `public_read`)         | Read-only view of a public session. No sidebar. "Continue this conversation" CTA.         |

Two distinct route prefixes (`/ask/<id>` vs. `/ask/s/<id>`) cleanly separate "my session, editable" from "someone's public session, read-only". The UUID is the same in both; the prefix just changes the UX and the query path.

- Hitting `/ask/<id>` when not the owner → 404 (RLS returns no rows).
- Hitting `/ask/s/<id>` when `is_public = false` → 404.
- Hitting `/ask/s/<id>` when the session is deleted → 404.
- Hitting `/ask/<id>` when signed out → redirect to sign-in, then back.

## UI Touchpoints

### Left-hand sidebar

- Lists the signed-in user's sessions, newest-updated first.
- Grouped by age bucket: Today, Yesterday, Previous 7 Days, Previous 30 Days, Older.
- Each row: title + relative timestamp. Active session highlighted.
- "New chat" button at top.
- Row actions (shown on hover): Rename, Delete, Share/Unshare, Copy link.
- Client-side-only filter input. No server-side search in v1.
- Hidden on the `/ask/s/<id>` read-only shared view.

### Share control

- Accessible from a "Share" button in the session header and from the sidebar row menu.
- Opens a popover with:
    - A toggle: "Make this conversation public".
    - A readonly input with the public URL (`<origin>/ask/s/<id>`) and Copy button.
    - When toggling off, the URL is shown greyed out and a note: "Anyone with the link will see a 404."
- Toggle state is a direct UPDATE of `is_public`. No extra confirmation dialog; unshare is one click.

### Fork flow

- The read-only shared view shows a primary CTA: "Continue this conversation".
- If signed in: clicking it INSERTs a new session (new UUID, current user as owner, `is_public = false`, cloned `messages`/`cards`/`model`), then navigates to `/ask/<new-uuid>`.
- If signed out: clicking it stores the source session ID in `sessionStorage` under `pendingFork`, redirects to sign-in, and on return completes the fork automatically.
- The source session's `is_public` state has no bearing on the fork beyond gating the read view — fork UX does not notify the original owner and stores no reference to the source session ID.

### Switching sessions

Clicking a sidebar row loads the target session. If a stream is currently running in the active session, it is aborted (existing `abortController` path). Completed turns in the aborted session are already persisted; the unfinished turn is discarded.

### "New chat" button

Navigates to `/ask` (no ID). Same route as initial entry. First user message creates the row.

## Error Handling

| Failure                              | UX                                                                                   |
|--------------------------------------|--------------------------------------------------------------------------------------|
| Supabase write fails on turn complete | Banner: "Couldn't save. Retry." One-click retry. Streaming continues normally.       |
| Supabase read fails on hydration      | Full-page error with reload affordance. Sidebar remains empty until retry succeeds.   |
| Session not found (owner route)       | 404 page with link back to `/ask`.                                                   |
| Session not found (public route)      | 404 page, generic — does not distinguish "never existed" from "unshared" from "deleted". |
| Fork INSERT fails                     | Inline error on the shared view; CTA remains clickable for retry.                    |
| Network loss mid-stream               | Existing stream error handling; partial turn lost; completed turns persisted.         |

## Migration / Rollout

- Existing `sessionStorage` state (`ask-conversation`) is abandoned, not migrated. On first load after deploy, signed-in users with existing tab state lose it unless they explicitly re-ask. (Acceptable: current state is already ephemeral across tabs.)
- Single Supabase migration creates the table, indexes, trigger, and RLS policies. Reversible by `DROP TABLE ask_sessions CASCADE`.

## Testing Strategy

- **Integration tests** for Supabase RLS policies: assert that an anonymous client cannot SELECT private sessions, can SELECT public ones, cannot INSERT/UPDATE/DELETE any session.
- **Component tests** for the sidebar: grouping, active-row highlighting, rename, delete, share toggle.
- **Component tests** for fork flow: signed-in immediate fork, signed-out deferred fork via `sessionStorage`.
- **E2E (or manual)** for the full create → share → copy link → open incognito → sign in → fork path.

## Open Questions (Deferred)

- Rate limiting on session creation (abuse prevention).
- Export to Markdown / JSON (future).
- Server-side full-text search (future; introduces a GIN index on `messages`).
- Per-session "pin to top" in sidebar (future).
- Shared-session view analytics (future).

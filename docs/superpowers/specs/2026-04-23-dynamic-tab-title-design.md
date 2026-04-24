# Dynamic Tab Title

**Date:** 2026-04-24
**Issue:** [#64 — Feature: Dynamic Tab Title in JAM Search](https://github.com/fluffylabs/jam-search/issues/64)
**Scope:** `client/` only — search results pages, ask page, shared-ask page.

## Goal

Make the browser tab title reflect what the user is actually doing, so that
multiple JAM Search tabs can be distinguished at a glance. Today every tab
shows the same `JAM Search` regardless of route or content.

## Non-Goals

- Building any LLM-summarization infrastructure. PR #248 already shipped a
  backend `POST /ask/title` endpoint, a `requestTitle` client helper, and
  the `deriveTitle` first-message-fallback used to populate
  `ask_sessions.title` on every new chat. This spec only consumes those.
- Re-titling on every follow-up. Title generation already happens once,
  on the first user message, with an explicit "Regenerate Title" action
  in the sidebar.
- Changing the favicon, OpenGraph, or any SEO metadata.

## Title Format

`<topic> — JAM Search` (em-dash separator).

Rationale: when many tabs are open, browsers truncate titles from the
right. Putting the most-distinguishing part (the topic) on the left keeps
it visible even on narrow tabs. The default fallback when no topic is
known remains `JAM Search`.

## Affected Routes & Their Title Source

| Route                   | Title source                                      |
|-------------------------|---------------------------------------------------|
| `/results`              | `?q=` URL param                                   |
| `/results/graypaper`    | `?q=` URL param                                   |
| `/results/matrix`       | `?q=` URL param                                   |
| `/results/pages`        | `?q=` URL param                                   |
| `/results/discord`      | `?q=` URL param                                   |
| `/ask` (no session)     | Default — empty state, no conversation yet        |
| `/ask/:sessionId`       | `activeSession.title` → `deriveTitle(state)` → `Bamboozling…` |
| `/ask/s/:sessionId`     | `record.title` → `deriveTitle(record.state)` → `Bamboozling…` |
| Everything else         | Default (`JAM Search`)                            |

## Architecture

### 1. `useDocumentTitle` hook

New file `client/src/hooks/useDocumentTitle.ts`:

```ts
export function useDocumentTitle(title: string | null): void;
```

Behavior:

- When `title` is a non-empty string: set `document.title` to
  `\`${title} — JAM Search\``.
- When `title` is `null` or empty: set `document.title` to `"JAM Search"`.
- On unmount, restore `document.title` to `"JAM Search"`.

The format and suffix live entirely inside the hook so call sites only
pass the topic.

### 2. Search results pages

Each of the five pages gets a one-line addition reading the existing
query variable:

```ts
useDocumentTitle(query || null);
```

Files touched:

- `client/src/pages/results.tsx` — uses `richQuery`.
- `client/src/pages/viewall/graypaper.tsx`
- `client/src/pages/viewall/matrix.tsx`
- `client/src/pages/viewall/pages.tsx`
- `client/src/pages/viewall/discord.tsx`

### 3. Ask page (`/ask` and `/ask/:sessionId`)

`client/src/pages/ask.tsx` already exposes everything we need:

- `sessionId` from `useParams`
- `state` from `useAskConversation`
- `sessions.sessions` from `useSessions`
- An `activeSession` lookup is already computed as
  `sessions.sessions?.find((s) => s.id === sessionId)`.

Add (next to the existing `activeSession` line):

```ts
const askTitle = (() => {
  if (!sessionId) return null;                       // empty /ask
  if (activeSession?.title) return activeSession.title;
  const fallback = deriveTitle(state);               // truncated first msg
  if (fallback) return fallback;
  return "Bamboozling…";                             // brief loading window
})();
useDocumentTitle(askTitle);
```

State machine:

| Conversation state                                       | Tab title                       |
|----------------------------------------------------------|---------------------------------|
| `/ask` with no `sessionId` (new chat / empty state)      | `JAM Search`                    |
| `/ask/:id` immediately after creation, before sessions.list refresh, no messages yet | `Bamboozling… — JAM Search` |
| `/ask/:id` with a first user message in `state` but no DB title yet | `<first 60 chars> — JAM Search` |
| `/ask/:id` with `activeSession.title` populated (provisional from `deriveTitle`) | `<first 60 chars> — JAM Search` |
| `/ask/:id` with `activeSession.title` populated (LLM-generated) | `<llm title> — JAM Search`      |
| `/ask/:id` after "New chat" navigates to `/ask`          | `JAM Search`                    |

`Bamboozling…` is intentionally only visible during the brief window
between session-row creation and the first list refresh. In practice
users may never see it; that's fine — `deriveTitle` already provides an
instant fallback derived from in-memory state.

### 4. Shared ask page (`/ask/s/:sessionId`)

`client/src/pages/askShared.tsx` already loads a full `AskSessionRecord`
into local state. Add:

```ts
const sharedTitle = (() => {
  if (record === null || record === "notfound") return null;
  if (record.title) return record.title;
  const fallback = deriveTitle(record.state);
  return fallback ?? "Bamboozling…";
})();
useDocumentTitle(sharedTitle);
```

The `null` (still loading) and `"notfound"` cases fall back to the default
`JAM Search` rather than showing `Bamboozling…`, since shared links may
be opened by users who don't have a session at all.

## Error Handling

There is no new failure mode introduced by this change. Title resolution
is purely reactive over state that already exists; no network calls are
added.

If the existing title-generation path fails (handled in PR #248: the
provisional `deriveTitle` value remains the session title), the tab
shows that provisional title. Same outcome as the sidebar.

## Testing

### Unit tests (Vitest)

- `client/src/hooks/__tests__/useDocumentTitle.test.tsx` — covers:
  - sets `document.title` to `\`${title} — JAM Search\`` for non-empty input
  - sets to `JAM Search` for `null` or empty string
  - restores `JAM Search` on unmount
  - re-renders update the title

No new tests are needed for the page wiring — the hook itself is the
behavioral contract; page integration is one-liners that React Testing
Library would only re-verify the hook for. Manual smoke covers the
real-world flow end-to-end.

### Manual smoke test

1. Open `/results?q=safrole` — tab shows `safrole — JAM Search`.
2. Open `/results/graypaper?q=safrole` — same.
3. Open `/ask` (no session) — tab shows `JAM Search`.
4. Type "How does safrole VRF rotation work?" and submit. Within ~1s
   the URL becomes `/ask/<uuid>` and the tab shows
   `How does safrole VRF rotation work? — JAM Search` (provisional).
5. After the assistant turn completes and the LLM title arrives, the
   tab updates to something like `Safrole VRF rotation — JAM Search`.
6. Click "New chat" — URL returns to `/ask`, tab shows `JAM Search`.
7. Open `/ask/s/<public-id>` (a shared link) — tab shows the shared
   conversation's title.
8. Open three tabs with different queries / sessions — each shows its
   own distinguishing topic on the left of the truncated label.

## File Summary

### New files

- `client/src/hooks/useDocumentTitle.ts`
- `client/src/hooks/__tests__/useDocumentTitle.test.tsx`

### Modified files

- `client/src/pages/results.tsx` — call `useDocumentTitle(richQuery || null)`.
- `client/src/pages/viewall/{graypaper,matrix,pages,discord}.tsx` — call
  `useDocumentTitle(query || null)`.
- `client/src/pages/ask.tsx` — compute `askTitle`, call `useDocumentTitle`.
- `client/src/pages/askShared.tsx` — compute `sharedTitle`, call
  `useDocumentTitle`.

No backend changes. No state-shape changes. No new dependencies.

## Open Questions

None. The placeholder text (`Bamboozling…`) and format (`<topic> — JAM Search`)
are confirmed; both are trivial to change in a follow-up if they don't
feel right in practice.

# Dynamic Tab Title

**Date:** 2026-04-23
**Issue:** [#64 — Feature: Dynamic Tab Title in JAM Search](https://github.com/fluffylabs/jam-search/issues/64)
**Scope:** `client/` (search results pages, ask page) and `backend/` (new `/summarize` endpoint).

## Goal

Make the browser tab title reflect what the user is actually doing, so that
multiple JAM Search tabs can be distinguished at a glance. Today every tab
shows the same `JAM Search` regardless of route or query.

## Non-Goals

- Re-summarizing the conversation on every follow-up turn (we summarize once,
  after the first assistant response).
- A session list UI (this spec only builds the summary primitive that a
  future session list will reuse).
- Changing the favicon.
- Touching SEO / OpenGraph metadata.

## Title Format

`<topic> — JAM Search` (em-dash separator).

Rationale: when many tabs are open, browsers truncate from the right.
Putting the most-distinguishing part (the topic) on the left keeps it
visible even on narrow tabs. The default fallback when no topic is known
remains `JAM Search`.

## Affected Routes & Their Title Source

| Route                     | Title source                                         |
|---------------------------|------------------------------------------------------|
| `/results`                | `?q=` URL param                                      |
| `/results/graypaper`      | `?q=` URL param                                      |
| `/results/matrix`         | `?q=` URL param                                      |
| `/results/pages`          | `?q=` URL param                                      |
| `/results/discord`        | `?q=` URL param                                      |
| `/ask`                    | LLM-generated summary (with placeholder fallback)    |
| Everything else           | Default (`JAM Search`)                               |

## Architecture

### 1. `useDocumentTitle` hook

New file `client/src/hooks/useDocumentTitle.ts`. A small generic hook:

```ts
export function useDocumentTitle(title: string | null): void;
```

Behavior:

- On mount/update with a non-null `title`, sets `document.title` to
  `\`${title} — JAM Search\``.
- On mount/update with `null`, restores `document.title` to `"JAM Search"`.
- On unmount, restores `document.title` to `"JAM Search"`.

The suffix is appended inside the hook so call sites pass only the topic.
This keeps the format in one place.

### 2. Search results pages

Each of the five pages becomes a one-line change:

```ts
useDocumentTitle(query || null);
```

Where `query` is the existing variable read from `?q=`.

### 3. Conversation summary state

Extend `AskConversationState` in `client/src/lib/askTypes.ts`:

```ts
export interface AskConversationState {
  messages: ChatMessage[];
  cards: Record<string, CitationCardData>;
  model: string;
  summary: string | null;       // NEW
}
```

Reducer changes in `client/src/lib/askReducer.ts`:

- New action: `{ type: "setSummary"; summary: string }`
- `reset` clears `summary` to `null` (alongside clearing `messages`/`cards`).
- `initialState.summary = null`.

`useAskConversation` already serializes the whole state to `sessionStorage`,
so the summary persists across reloads with no extra code beyond a defensive
default in `hydrate`.

### 4. Summary trigger on `/ask`

A new effect in `AskPage` watches the conversation. It fires the summary
request exactly once, when *all* of the following hold:

- `state.summary` is `null`
- The last message is an assistant message that just stopped streaming
  (`isStreaming` is `false` and there is no `error`)
- There has been at least one user message and one assistant turn
- No summary request is currently in flight (tracked by a ref)

Implementation outline:

```ts
const summaryAbortRef = useRef<AbortController | null>(null);

useEffect(() => {
  if (state.summary !== null) return;
  if (!hasApiKey) return;
  const last = state.messages[state.messages.length - 1];
  if (!last || last.role !== "assistant") return;
  if (last.isStreaming || last.error) return;
  if (summaryAbortRef.current) return;

  const controller = new AbortController();
  summaryAbortRef.current = controller;

  summarizeAsk({
    messages: state.messages,
    openrouterKey: trimmedApiKey,
    signal: controller.signal,
  })
    .then((summary) => {
      if (summary) dispatch({ type: "setSummary", summary });
    })
    .catch((err) => {
      if (!(err instanceof DOMException && err.name === "AbortError")) {
        console.warn("Summary failed:", err);
      }
    })
    .finally(() => {
      if (summaryAbortRef.current === controller) {
        summaryAbortRef.current = null;
      }
    });
}, [state.messages, state.summary, hasApiKey, trimmedApiKey]);

useEffect(() => () => summaryAbortRef.current?.abort(), []);
```

### 5. Title resolution on `/ask`

```ts
const askTitle = (() => {
  if (state.messages.length === 0) return null;
  if (state.summary) return state.summary;
  return "Bamboozling…";
})();
useDocumentTitle(askTitle);
```

State machine:

| Conversation state                                  | Tab title                       |
|-----------------------------------------------------|---------------------------------|
| Empty                                               | `JAM Search`                    |
| User sent first message, awaiting/streaming         | `Bamboozling… — JAM Search`     |
| First assistant turn done, summary pending          | `Bamboozling… — JAM Search`     |
| Summary returned                                    | `<summary> — JAM Search`        |
| User clicked "New chat" → reset                     | `JAM Search`                    |
| Reload mid-conversation (summary already in state)  | `<summary> — JAM Search`        |

### 6. Client-side `summarizeAsk` helper

New file `client/src/lib/summarizeAsk.ts`:

```ts
export interface SummarizeAskParams {
  messages: ChatMessage[];
  openrouterKey: string;
  signal?: AbortSignal;
}

export async function summarizeAsk(
  params: SummarizeAskParams
): Promise<string | null>;
```

Behavior:

- POSTs to `${API_URL}/summarize` with
  `{ messages: toApiMessages(...), openrouterKey }` (reusing the same
  message-stripping helper as `askClient.ts`; extract it to a shared
  location if it isn't already exported).
- Returns the trimmed `summary` string on success, or `null` on any
  non-2xx / parse failure (we already log internally).
- Forwards the abort signal to `fetch`.

### 7. Backend `POST /summarize`

New file `backend/src/api/summarize.ts`:

- Request schema (zod):
  ```ts
  z.object({
    messages: z.array(chatMessageSchema).min(1).max(100),
    openrouterKey: z.string().trim().min(1).max(512),
  });
  ```
- Implementation:
  1. Build an OpenRouter client via the existing `createOpenRouterClient`.
  2. Call `chat.completions.create` (non-streaming) with:
     - `model: "anthropic/claude-haiku-4.5"` — fixed; this is a server-
       owned choice, the user's selected chat model is irrelevant for
       titling.
     - `max_tokens: 32`
     - `temperature: 0.2`
     - `messages: [{ role: "system", content: SUMMARY_PROMPT }, ...userMessages]`
  3. Take `choices[0].message.content`, trim, strip surrounding quotes
     and any trailing period, collapse whitespace, cap at 60 chars.
  4. Respond with `{ summary: string }`.
- Errors (network, non-OK from OpenRouter, empty content) → respond with
  HTTP 502 and `{ error: string }`. The client treats any failure as a
  silent no-op.

System prompt (constant in `backend/src/ask/`):

> Reply with a 3-5 word title summarizing the conversation topic. No
> quotes, no punctuation, no trailing period. Plain text only.

Wire the route in `backend/src/api.ts`:

```ts
app.post("/summarize", handleSummarize());
```

(No `db`/`dataDir` dependency — summarization doesn't read indexed data.)

## Error Handling

- **Summary request fails** (network, OpenRouter error, malformed response):
  state stays at `summary: null`, tab keeps showing `Bamboozling… — JAM Search`.
  Logged via `console.warn`. Not surfaced in UI; tab title is best-effort.
- **No OpenRouter API key**: summary effect short-circuits before firing.
  The user already sees a settings CTA in the empty state for missing key;
  there is no separate UX needed for "summary unavailable."
- **User aborts (navigate away, "New chat", reload mid-stream)**: the
  `AbortController` cancels the in-flight request. Resurrected mid-stream
  assistant messages (which have `error` set by `resurrectMessages`) do
  not satisfy the trigger condition, so we don't fire summary on a
  half-broken turn after reload.
- **Race**: the `summaryAbortRef` guard prevents double-fire if the effect
  re-runs while a request is in flight.

## Testing

### Unit tests (Vitest)

- `client/src/hooks/__tests__/useDocumentTitle.test.tsx` — covers:
  - sets `document.title` to `\`${title} — JAM Search\`` when given a string
  - sets to `JAM Search` when given `null`
  - restores `JAM Search` on unmount
  - re-renders update the title
- `client/src/lib/__tests__/askReducer.test.ts` — extend with:
  - `setSummary` updates `summary`
  - `reset` clears `summary`
- `backend/src/__tests__/summarize.test.ts` — exercises the endpoint
  with a mocked OpenRouter client; covers happy path, malformed
  response, OpenRouter error, schema validation.

### Manual smoke test

1. Open `/results?q=safrole` — tab shows `safrole — JAM Search`.
2. Open `/results/graypaper?q=safrole` — same.
3. Open `/ask` (empty) — tab shows `JAM Search`.
4. Type "How does safrole VRF rotation work?" and submit — tab shows
   `Bamboozling… — JAM Search` immediately.
5. Wait for assistant to finish — tab updates to a topic summary like
   `Safrole VRF rotation — JAM Search`.
6. Click "New chat" — tab returns to `JAM Search`.
7. Reload mid-conversation — tab restores from persisted state.
8. Open three tabs with different queries — each tab shows its own
   distinguishing topic on the left of the truncated label.

## File Summary

### New files

- `client/src/hooks/useDocumentTitle.ts`
- `client/src/hooks/__tests__/useDocumentTitle.test.tsx`
- `client/src/lib/summarizeAsk.ts`
- `backend/src/api/summarize.ts`
- `backend/src/__tests__/summarize.test.ts`

### Modified files

- `client/src/lib/askTypes.ts` — add `summary` to `AskConversationState`.
- `client/src/lib/askReducer.ts` — add `setSummary` action; clear in `reset`.
- `client/src/hooks/useAskConversation.ts` — defensive default in `hydrate`.
- `client/src/pages/ask.tsx` — call `useDocumentTitle`; add summary effect.
- `client/src/pages/results.tsx` — call `useDocumentTitle(richQuery || null)`.
- `client/src/pages/viewall/{graypaper,matrix,pages,discord}.tsx` — call
  `useDocumentTitle(query || null)`.
- `backend/src/api.ts` — register the new route.

## Open Questions

None at design time. Model choice (`anthropic/claude-haiku-4.5`) and
placeholder text (`Bamboozling…`) are intentionally hard-coded; both are
trivial to change in a follow-up if they don't feel right in practice.

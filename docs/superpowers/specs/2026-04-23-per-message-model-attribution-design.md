# Per-Message Model Attribution

## Problem

The Ask page lets users switch OpenRouter models mid-conversation, but the
conversation only stores a single top-level `model` field — the picker's
current value. After persistence (sessionStorage), there's no record of
which model produced which assistant response. With `openrouter/auto`
selected, even within a single user-selected setting the actual model can
change per request, and the frontend never sees what really ran.

## Goal

Show the model used under each assistant message, including for messages
produced by previous turns of a persisted conversation. The displayed
attribution should reflect the real underlying model, not just the picker
value.

## Approach (Option C: eager + actual)

1. Tag the new `AssistantMessage` with the user-selected model id at send
   time (eager — gives us *something* to display before the first chunk
   arrives, and a fallback if the stream errors before reporting).
2. Backend reads the actual model id from each OpenRouter streaming chunk
   (`chunk.model`) and emits a new `model_used` SSE event whenever it
   changes.
3. Frontend dispatches `setMessageModel` on receipt, overwriting the
   message's `model` field — last-write-wins. With agent loops that may
   span multiple iterations under `auto`, the field ends up holding the
   final iteration's model, which is the one that produced the visible
   text.

## Display

Always-on, muted footer under each assistant message: `via Claude Sonnet
4.5`. Label resolved via the curated `MODELS` list; falls back to the raw
id for anything OpenRouter routes to outside the list.

Pre-feature persisted messages have no `model` field — the footer is
simply not rendered for those.

## Components Touched

- `backend/src/ask/types.ts` — add `model_used` to `AgentEvent`
- `backend/src/ask/agentLoop.ts` — read `chunk.model`, emit on change
- `client/src/lib/askTypes.ts` — add `model_used` event; `model?: string`
  on `AssistantMessage`
- `client/src/lib/askReducer.ts` — eager tag in `sendUserMessage`; new
  `setMessageModel` action
- `client/src/pages/ask.tsx` — wire `model_used` → `setMessageModel`
- `client/src/lib/models.ts` — `modelLabel(id)` helper
- `client/src/components/chat/Message.tsx` — render the footer

## What's Out of Scope

- Showing model only on change (D2) — explicitly rejected in favor of
  always-on (D1).
- Sending per-message model history back to the backend — backend uses the
  current `state.model` for the next request; per-message attribution is a
  display-only concern.
- Backfilling the `model` field on conversations persisted before this
  change.

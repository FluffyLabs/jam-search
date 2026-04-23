# Ask Page Redesign

**Date:** 2026-04-23
**Scope:** `client/src/pages/ask.tsx` and related chat components.

## Goal

Reclaim vertical space on the ask page by removing the top header bar,
relocating its controls into more contextual locations, and trimming the
Settings shortcut to a conditional affordance.

## Current State

The ask page currently renders a 60px header (`ask.tsx:181–215`) containing:

- A `Sparkles` icon + "Ask AI" title
- A `ModelPicker`
- A "New chat" button (only when messages exist)
- A persistent "Settings" button

Below the header sits the conversation column (`max-w-[44rem]`) and a
citations panel on the right.

## Changes

### 1. Remove header bar

Delete the entire `<header>` block in `ask.tsx` (lines 181–215). The
"Ask AI" title, separator, and associated layout are removed.

### 2. Move ModelPicker into ChatInput

`ChatInput` gains two new props:

```ts
interface ChatInputProps {
  // ...existing...
  model: string;
  onModelChange: (modelId: string) => void;
}
```

The footer row becomes:

- **Left:** keyboard hint (`⏎ to send · ⇧⏎ for newline`) — unchanged.
- **Right:** `[ModelPicker] [Ask button]` — new grouping.

The page passes `state.model` and a handler that dispatches
`{ type: "setModel", model }`.

### 3. Sticky "New chat" inside the conversation

Render a sticky button at the top of the scrollable conversation area,
above the messages list. Only shown when `state.messages.length > 0`.

Behavior:

- `position: sticky; top: 0` so it remains visible while scrolling long
  threads.
- Translucent background with `backdrop-blur` so scrolled content reads
  acceptably behind it.
- Click handler aborts any in-flight stream and dispatches `reset`
  (identical logic to today's header button).

Placement is inside the `scrollRef` container so it scrolls with its
parent but sticks to the top edge.

### 4. Conditional Settings shortcut

The persistent "Settings" button is removed. A Settings affordance is
rendered in two places only when `isReady && !hasApiKey`:

- **EmptyState:** a button labeled "Configure OpenRouter API key" below
  the intro paragraph, linking to `/settings`.
- **Error flow:** errors currently render inside `Message.tsx`
  (lines 49–53) as a destructive-styled block attached to the last
  assistant message. When the error message matches the
  missing-API-key string, the error block will include a "Go to
  Settings" button. We detect this either by exact-string match on the
  rendered error, or by extending the error payload with a
  `kind: "missing-api-key"` discriminator (preferred; cleaner than
  string matching).

The `hasApiKey` boolean is computed in `AskPage` from `keyData` (already
available) and passed to `EmptyState`. The error-side Settings link
does not need `hasApiKey` — it's tied to the specific error kind.

### 5. Expand conversation max-width

Change `max-w-[44rem]` to `max-w-[52rem]` in both the messages list and
the ChatInput wrapper, so medium screens get more horizontal room now
that the header is gone.

## Out of Scope

- `CitationsPanel` / sources column layout.
- `Message` component rendering.
- Backend, routing, or `useAskConversation` reducer logic.

## Risks

- **Sticky "New chat" overlap:** the sticky button will visually overlap
  the first message when scrolled. Mitigation: translucent
  backdrop-blur background so overlap is acceptable; appropriate top
  padding on the messages container.
- **Model picker width in footer:** on narrow widths the keyboard hint
  may crowd. Acceptable to hide the hint on sub-`sm` breakpoints
  (`hidden sm:inline`).
- **Settings discoverability for configured users:** intentional per
  user request. Configured users navigate to settings via app nav.

## Files Touched

- `client/src/pages/ask.tsx` — remove header, add sticky new-chat, add
  conditional empty-state settings link, widen max-width, pass model
  props to ChatInput.
- `client/src/components/chat/ChatInput.tsx` — accept model props,
  render ModelPicker next to Ask button.
- `client/src/components/chat/Message.tsx` — extend error block
  rendering to include a "Go to Settings" button when the error is the
  missing-API-key case.
- `client/src/lib/askReducer.ts` — extend the assistant-message error
  field (or add a sibling `errorKind`) so `Message.tsx` can distinguish
  the missing-API-key case from generic errors.

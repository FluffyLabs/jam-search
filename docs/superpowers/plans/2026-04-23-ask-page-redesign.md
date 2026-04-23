# Ask Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reclaim vertical space on the ask page by removing the header bar, relocating controls, and trimming Settings to a conditional shortcut.

**Architecture:** UI-only refactor of `client/src/pages/ask.tsx` and a handful of chat components. Adds an `errorKind` discriminator to the reducer's error payload so missing-API-key errors can render a Settings call-to-action without string-matching.

**Tech Stack:** React 19, TypeScript, Tailwind v4, Vitest, react-router-dom v7. Lucide icons already in use.

---

## File Structure

**Modified:**
- `client/src/lib/askTypes.ts` — add optional `errorKind` field to `AssistantMessage`.
- `client/src/lib/askReducer.ts` — `setError` action accepts optional `kind`; reducer stores it on the last assistant.
- `client/src/lib/__tests__/askReducer.test.ts` — test coverage for `errorKind`.
- `client/src/pages/ask.tsx` — remove header, lift `hasApiKey`, pass model/handlers to ChatInput, render sticky "New chat", dispatch missing-key error with `kind: "missingApiKey"`, widen column, show conditional Settings link in empty state.
- `client/src/components/chat/ChatInput.tsx` — accept `model` + `onModelChange` props; render `ModelPicker` next to the Ask button.
- `client/src/components/chat/Message.tsx` — when `message.errorKind === "missingApiKey"`, render a "Go to Settings" button inside the error block.

**Not touched:** backend, routing config, `CitationsPanel`, `Markdown`, `ToolStep`, `ModelPicker` itself.

---

## Task 1: Add `errorKind` to types and reducer

**Files:**
- Modify: `client/src/lib/askTypes.ts`
- Modify: `client/src/lib/askReducer.ts`
- Test: `client/src/lib/__tests__/askReducer.test.ts`

- [ ] **Step 1: Extend `AssistantMessage` type**

Edit `client/src/lib/askTypes.ts` — add `errorKind` next to the existing `error` field:

```ts
export type ErrorKind = "missingApiKey";

export interface AssistantMessage {
  id: string;
  role: "assistant";
  parts: AssistantPart[];
  citations: Citation[];
  error?: string;
  errorKind?: ErrorKind;
  isStreaming: boolean;
}
```

- [ ] **Step 2: Extend the `setError` action**

Edit `client/src/lib/askReducer.ts` — import the new type and update the action + reducer:

```ts
import type {
  AskConversationState,
  AssistantMessage,
  AssistantPart,
  ChatMessage,
  CitationCardData,
  ErrorKind,
  SourceType,
  TextPart,
  ToolPart,
  UserMessage,
} from "./askTypes";
```

Update the `AskAction` union:

```ts
  | { type: "setError"; message: string; kind?: ErrorKind }
```

Update the reducer case:

```ts
    case "setError":
      return {
        ...state,
        messages: mapLastAssistant(state.messages, (m) => ({
          ...m,
          isStreaming: false,
          error: action.message,
          errorKind: action.kind,
        })),
      };
```

- [ ] **Step 3: Write the failing test**

Append to `client/src/lib/__tests__/askReducer.test.ts` inside the existing `describe` block (before the closing brace):

```ts
  it("setError stores errorKind when provided", () => {
    let s = freshAssistant();
    s = askReducer(s, {
      type: "setError",
      message: "No OpenRouter API key found. Add one in Settings to begin.",
      kind: "missingApiKey",
    });
    const last = lastAssistant(s);
    expect(last.error).toBe(
      "No OpenRouter API key found. Add one in Settings to begin."
    );
    expect(last.errorKind).toBe("missingApiKey");
    expect(last.isStreaming).toBe(false);
  });

  it("setError leaves errorKind undefined when kind is omitted", () => {
    let s = freshAssistant();
    s = askReducer(s, { type: "setError", message: "boom" });
    const last = lastAssistant(s);
    expect(last.error).toBe("boom");
    expect(last.errorKind).toBeUndefined();
  });
```

- [ ] **Step 4: Run tests**

```bash
cd client && npm test -- askReducer
```

Expected: both new tests pass alongside existing ones.

- [ ] **Step 5: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add client/src/lib/askTypes.ts client/src/lib/askReducer.ts client/src/lib/__tests__/askReducer.test.ts
git commit -m "ask: add errorKind discriminator to assistant errors"
```

---

## Task 2: Render Settings button for missing-key error in `Message.tsx`

**Files:**
- Modify: `client/src/components/chat/Message.tsx`

- [ ] **Step 1: Add a Settings CTA to the error block**

Replace the existing error block (lines 49–53) with a conditional layout that shows a "Go to Settings" button when `errorKind === "missingApiKey"`. Add `useNavigate` import.

Replace the imports at the top of `client/src/components/chat/Message.tsx`:

```ts
import { useNavigate } from "react-router-dom";
import type { AssistantPart, ChatMessage, TextPart } from "@/lib/askTypes";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Markdown } from "./Markdown";
import { ToolStep } from "./ToolStep";
```

Inside `Message`, declare the navigate hook at the top (before the `user` branch so it's unconditional):

```ts
export function Message({ message }: MessageProps) {
  const navigate = useNavigate();

  if (message.role === "user") {
    // ...unchanged
```

Replace the error block with:

```tsx
      {message.error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-sm px-3 py-2 flex items-start justify-between gap-3">
          <span className="flex-1">{message.error}</span>
          {message.errorKind === "missingApiKey" && (
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 border-destructive/40 text-destructive hover:bg-destructive/20"
              onClick={() => navigate("/settings")}
            >
              Go to Settings
            </Button>
          )}
        </div>
      )}
```

- [ ] **Step 2: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
cd client && npm run lint
```

Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add client/src/components/chat/Message.tsx
git commit -m "ask: surface Settings CTA on missing-API-key errors"
```

---

## Task 3: Dispatch `missingApiKey` kind from `AskPage`

**Files:**
- Modify: `client/src/pages/ask.tsx`

- [ ] **Step 1: Pass the error kind**

In `client/src/pages/ask.tsx`, inside `send` (around line 47), change:

```ts
        dispatch({
          type: "setError",
          message: "No OpenRouter API key found. Add one in Settings to begin.",
        });
```

to:

```ts
        dispatch({
          type: "setError",
          message: "No OpenRouter API key found. Add one in Settings to begin.",
          kind: "missingApiKey",
        });
```

- [ ] **Step 2: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add client/src/pages/ask.tsx
git commit -m "ask: tag missing-API-key error with kind discriminator"
```

---

## Task 4: Embed `ModelPicker` inside `ChatInput` footer

**Files:**
- Modify: `client/src/components/chat/ChatInput.tsx`

- [ ] **Step 1: Add model props and render the picker**

Replace the full contents of `client/src/components/chat/ChatInput.tsx` with:

```tsx
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ModelPicker } from "./ModelPicker";

interface ChatInputProps {
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (text: string) => void;
  model: string;
  onModelChange: (modelId: string) => void;
}

export function ChatInput({
  initialValue = "",
  placeholder = "Ask a follow-up…",
  disabled,
  onSubmit,
  model,
  onModelChange,
}: ChatInputProps) {
  const [value, setValue] = useState(initialValue);
  const [prevInitial, setPrevInitial] = useState(initialValue);
  const taRef = useRef<HTMLTextAreaElement>(null);

  if (initialValue !== prevInitial) {
    setPrevInitial(initialValue);
    setValue(initialValue);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: value is the trigger
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue("");
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const ready = !disabled && value.trim() !== "";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
        "transition-all"
      )}
    >
      <Textarea
        ref={taRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          "border-0 bg-transparent shadow-none resize-none min-h-[44px]",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "text-[15px] leading-6 px-4 py-3"
        )}
      />
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border/60">
        <span className="hidden sm:inline text-[11px] text-muted-foreground">
          <kbd className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
            ⏎
          </kbd>{" "}
          to send ·{" "}
          <kbd className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
            ⇧⏎
          </kbd>{" "}
          for newline
        </span>
        <div className="flex items-center gap-2 ml-auto">
          <ModelPicker value={model} onChange={onModelChange} />
          <Button
            onClick={submit}
            disabled={!ready}
            size="sm"
            variant={ready ? "default" : "ghost"}
          >
            Ask
          </Button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: `ask.tsx` will error because it doesn't yet pass `model` and `onModelChange`. That is expected — Task 5 wires them up. If any unrelated errors appear, fix them before proceeding.

- [ ] **Step 3: Commit**

```bash
git add client/src/components/chat/ChatInput.tsx
git commit -m "ask: embed ModelPicker inside ChatInput footer"
```

---

## Task 5: Remove header; pass model props; widen column

**Files:**
- Modify: `client/src/pages/ask.tsx`

- [ ] **Step 1: Replace the page layout**

Replace the full contents of `client/src/pages/ask.tsx` with the block below. This deletes the header, widens both the messages column and the input wrapper from `max-w-[44rem]` to `max-w-[52rem]`, passes model props to `ChatInput`, and computes `hasApiKey` for the empty-state shortcut (added in Task 7):

```tsx
import { useSession, useUserData } from "@fluffylabs/shared-ui/supabase";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatInput } from "@/components/chat/ChatInput";
import { CitationsPanel } from "@/components/chat/CitationsPanel";
import { Message } from "@/components/chat/Message";
import { Button } from "@/components/ui/button";
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
  const { isLoading: sessionLoading } = useSession();
  const { data: keyData, isLoading: keyLoading } = useUserData(
    "openrouter-api-key",
    { appScoped: true }
  );
  const isReady = !sessionLoading && !keyLoading;
  const hasApiKey = typeof keyData === "string" && keyData.trim() !== "";

  const streamHandleRef = useRef<{ abort: () => void } | null>(null);
  const hasAutoSubmittedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = useCallback(
    (text: string, options?: { startFresh?: boolean }) => {
      if (!isReady) return;
      const apiKey = hasApiKey ? (keyData as string) : null;
      if (!apiKey) {
        if (options?.startFresh) dispatch({ type: "reset" });
        dispatch({ type: "sendUserMessage", text });
        dispatch({
          type: "setError",
          message: "No OpenRouter API key found. Add one in Settings to begin.",
          kind: "missingApiKey",
        });
        return;
      }

      if (options?.startFresh) dispatch({ type: "reset" });
      dispatch({ type: "sendUserMessage", text });

      const priorMessages = options?.startFresh ? [] : state.messages;
      const nextMessages = [
        ...priorMessages,
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
    },
    [isReady, hasApiKey, keyData, dispatch, state.messages, state.model]
  );

  useEffect(() => {
    if (!autoSubmit || !initialQuery || hasAutoSubmittedRef.current) return;
    if (!isReady) return;

    hasAutoSubmittedRef.current = true;

    const lastUser = [...state.messages]
      .reverse()
      .find((m) => m.role === "user");
    const lastAssistant = [...state.messages]
      .reverse()
      .find((m): m is AssistantMessage => m.role === "assistant");
    const alreadyAnswered =
      lastUser?.content === initialQuery &&
      !!lastAssistant &&
      !lastAssistant.isStreaming &&
      !lastAssistant.error;

    if (!alreadyAnswered) {
      streamHandleRef.current?.abort();
      send(initialQuery, { startFresh: true });
    }

    const nextParams = new URLSearchParams(location.search);
    nextParams.delete("autoSubmit");
    navigate(`${location.pathname}?${nextParams.toString()}`, {
      replace: true,
    });
  }, [
    autoSubmit,
    initialQuery,
    isReady,
    location.pathname,
    location.search,
    navigate,
    send,
    state.messages,
  ]);

  useEffect(() => {
    return () => {
      streamHandleRef.current?.abort();
    };
  }, []);

  // biome-ignore lint/correctness/useExhaustiveDependencies: state.messages is the trigger
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [state.messages]);

  const lastAssistant = [...state.messages]
    .reverse()
    .find((m): m is AssistantMessage => m.role === "assistant");

  const streaming = lastAssistant?.isStreaming === true;
  const isEmpty = state.messages.length === 0;

  const handleNewChat = () => {
    streamHandleRef.current?.abort();
    streamHandleRef.current = null;
    dispatch({ type: "reset" });
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] overflow-hidden">
        <section className="flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <EmptyState
                showApiKeyCta={isReady && !hasApiKey}
                onOpenSettings={() => navigate("/settings")}
              />
            ) : (
              <>
                <div className="sticky top-0 z-10 backdrop-blur bg-background/80 border-b border-border/60">
                  <div className="max-w-[52rem] mx-auto px-6 py-2 flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleNewChat}
                    >
                      New chat
                    </Button>
                  </div>
                </div>
                <div className="max-w-[52rem] mx-auto px-6 py-8 flex flex-col gap-6">
                  {state.messages.map((m) => (
                    <Message key={m.id} message={m} />
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="max-w-[52rem] w-full mx-auto px-6 pb-6">
            <ChatInput
              initialValue={autoSubmit ? "" : initialQuery}
              disabled={streaming || !isReady}
              onSubmit={send}
              model={state.model}
              onModelChange={(m) => dispatch({ type: "setModel", model: m })}
              placeholder={
                isEmpty
                  ? "What would you like to know about JAM?"
                  : "Ask a follow-up…"
              }
            />
          </div>
        </section>

        <aside className="hidden lg:block border-l border-border overflow-y-auto bg-card/20 px-5 py-6">
          <CitationsPanel assistant={lastAssistant} cards={state.cards} />
        </aside>
      </div>
    </div>
  );
}

interface EmptyStateProps {
  showApiKeyCta: boolean;
  onOpenSettings: () => void;
}

function EmptyState({ showApiKeyCta, onOpenSettings }: EmptyStateProps) {
  return (
    <div className="max-w-[36rem] mx-auto px-6 pt-16 pb-8 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-light text-brand-dark mb-5">
        <Sparkles className="h-5 w-5" />
      </div>
      <h2 className="text-2xl font-semibold text-foreground mb-3">
        Ask anything about JAM
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed max-w-[28rem] mx-auto">
        An agent will search the Graypaper, Discord and Matrix discussions, and
        indexed pages, then answer with cited sources.
      </p>
      {showApiKeyCta && (
        <div className="mt-6">
          <Button variant="outline" onClick={onOpenSettings}>
            Configure OpenRouter API key
          </Button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Typecheck**

```bash
cd client && npm run typecheck
```

Expected: no errors.

- [ ] **Step 3: Lint**

```bash
cd client && npm run lint
```

Expected: clean.

- [ ] **Step 4: Run tests**

```bash
cd client && npm test
```

Expected: existing tests still pass.

- [ ] **Step 5: Manual verification in dev server**

```bash
cd client && npm run dev
```

Open the ask page in a browser. Verify:
- Header "Ask AI" bar is gone.
- `ModelPicker` + `Ask` button sit together on the right of the input footer; keyboard hint is on the left (and hides below `sm` breakpoint).
- With messages present: a "New chat" button sits sticky at the top of the conversation column; it remains visible when scrolling.
- Clicking "New chat" resets the conversation.
- In empty state without an API key configured: "Configure OpenRouter API key" button appears below the intro.
- In empty state with an API key configured: no CTA button appears.
- Attempting to send without an API key shows the error with a "Go to Settings" button.
- Conversation column appears wider than before on a ~1280px viewport.

- [ ] **Step 6: Commit**

```bash
git add client/src/pages/ask.tsx
git commit -m "ask: redesign header and layout to reclaim vertical space"
```

---

## Task 6: Final verification

- [ ] **Step 1: Full client test + lint + typecheck**

```bash
cd client && npm run lint && npm run typecheck && npm test
```

Expected: all clean.

- [ ] **Step 2: Confirm branch is clean**

```bash
git status
```

Expected: `working tree clean` (all work committed).

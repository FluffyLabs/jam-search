import { useUserData } from "@fluffylabs/shared-ui/supabase";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { SharePopover } from "@/components/ask/SharePopover";
import { ChatInput } from "@/components/chat/ChatInput";
import { CitationsPanel } from "@/components/chat/CitationsPanel";
import { Message } from "@/components/chat/Message";
import { ModelPicker } from "@/components/chat/ModelPicker";
import { Button } from "@/components/ui/button";
import { useAskConversation } from "@/hooks/useAskConversation";
import { useSessions } from "@/hooks/useSessions";
import { askStream } from "@/lib/askClient";
import { requestTitle } from "@/lib/askTitleClient";
import type { AssistantMessage } from "@/lib/askTypes";
import { deriveTitle } from "@/lib/sessionTypes";

export function AskPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId?: string }>();
  const searchParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  );
  const initialQuery = searchParams.get("q") ?? "";
  const autoSubmit = searchParams.get("autoSubmit") === "1";

  const { state, dispatch } = useAskConversation();
  const sessions = useSessions();
  const { data: keyData, isLoading: keyLoading } = useUserData(
    "openrouter-api-key",
    { appScoped: true }
  );

  const streamHandleRef = useRef<{ abort: () => void } | null>(null);
  const hasAutoSubmittedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hydratedRef = useRef<string | null>(null);
  const createdRef = useRef<Set<string>>(new Set());
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Hydrate when sessionId changes. Abort any running stream first.
  useEffect(() => {
    if (!sessionId) {
      if (hydratedRef.current !== null) {
        streamHandleRef.current?.abort();
        streamHandleRef.current = null;
        dispatch({ type: "reset" });
        hydratedRef.current = null;
      }
      return;
    }
    if (hydratedRef.current === sessionId) return;
    if (createdRef.current.has(sessionId)) {
      // We just created this row locally; avoid an immediate round-trip
      // that would overwrite our in-memory state with the freshly-written one.
      hydratedRef.current = sessionId;
      return;
    }
    streamHandleRef.current?.abort();
    streamHandleRef.current = null;
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

  // Persist after an assistant turn finishes streaming.
  useEffect(() => {
    if (!sessionId) return;
    if (hydratedRef.current !== sessionId) return;
    const last = state.messages[state.messages.length - 1];
    if (!last || last.role !== "assistant" || last.isStreaming) return;
    const timer = setTimeout(async () => {
      try {
        await sessions.update(sessionId, { state: stateRef.current });
        setSaveError(null);
      } catch (err) {
        setSaveError((err as Error).message);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [sessionId, sessions, state]);

  const send = async (text: string, options?: { startFresh?: boolean }) => {
    if (keyLoading) return;
    const apiKey =
      typeof keyData === "string" && keyData.trim() !== "" ? keyData : null;
    if (!apiKey) {
      if (options?.startFresh) dispatch({ type: "reset" });
      dispatch({ type: "sendUserMessage", text });
      dispatch({
        type: "setError",
        message: "No OpenRouter API key found. Add one in Settings to begin.",
      });
      return;
    }

    if (options?.startFresh) dispatch({ type: "reset" });
    dispatch({ type: "sendUserMessage", text });

    // When starting fresh, the prior history we send to the backend is empty;
    // closure-captured state.messages is stale right after dispatch(reset).
    const priorMessages = options?.startFresh ? [] : state.messages;
    const nextMessages = [
      ...priorMessages,
      { id: "pending", role: "user" as const, content: text },
    ];

    // If this is the first message in a new chat, create the session row and
    // move to /ask/:id so hydration + persistence can latch on.
    let activeId = sessionId;
    if (!activeId) {
      activeId = uuidv4();
      createdRef.current.add(activeId);
      const provisional = deriveTitle({
        ...state,
        messages: [{ id: "pending", role: "user", content: text }],
      });
      try {
        await sessions.create({
          id: activeId,
          title: provisional,
          state: {
            ...state,
            messages: [{ id: "pending", role: "user", content: text }],
          },
        });
        hydratedRef.current = activeId;
        navigate(`/ask/${activeId}`, { replace: true });
        // Fire-and-forget title generation; patch the row when it resolves.
        const newId = activeId;
        requestTitle({ question: text, openrouterKey: apiKey }).then(
          (generated) => {
            if (generated) sessions.update(newId, { title: generated });
          }
        );
      } catch (err) {
        setSaveError((err as Error).message);
      }
    }

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
  // biome-ignore lint/correctness/useExhaustiveDependencies: send changes every render; hasAutoSubmittedRef guards against re-firing
  useEffect(() => {
    if (
      autoSubmit &&
      initialQuery &&
      !hasAutoSubmittedRef.current &&
      !keyLoading
    ) {
      hasAutoSubmittedRef.current = true;
      streamHandleRef.current?.abort();
      send(initialQuery, { startFresh: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoSubmit, initialQuery, keyLoading]);

  useEffect(() => {
    return () => {
      streamHandleRef.current?.abort();
    };
  }, []);

  // Auto-scroll as messages stream in.
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

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/30">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-dark" />
            <h1 className="text-base font-semibold text-foreground">Ask AI</h1>
          </div>
          <div className="h-4 w-px bg-border" />
          <ModelPicker
            value={state.model}
            onChange={(m) => dispatch({ type: "setModel", model: m })}
          />
        </div>
        <div className="flex items-center gap-1">
          {sessionId && sessions.sessions?.find((s) => s.id === sessionId) && (
            <SharePopover
              sessionId={sessionId}
              isPublic={
                sessions.sessions.find((s) => s.id === sessionId)?.isPublic ??
                false
              }
              onToggle={(next) =>
                sessions.update(sessionId, { isPublic: next })
              }
            />
          )}
          {state.messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                streamHandleRef.current?.abort();
                streamHandleRef.current = null;
                navigate("/ask");
              }}
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
      </header>

      {saveError && (
        <div
          role="alert"
          className="flex items-center gap-3 border-b border-red-300 bg-red-50 px-6 py-2 text-sm text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100"
        >
          <span className="flex-1">Couldn't save: {saveError}</span>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              if (!sessionId) return;
              try {
                await sessions.update(sessionId, { state: stateRef.current });
                setSaveError(null);
              } catch (err) {
                setSaveError((err as Error).message);
              }
            }}
          >
            Retry
          </Button>
          <Button size="sm" variant="ghost" onClick={() => setSaveError(null)}>
            Dismiss
          </Button>
        </div>
      )}

      {/* Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] overflow-hidden">
        {/* Conversation column */}
        <section className="flex flex-col overflow-hidden">
          <div ref={scrollRef} className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <EmptyState />
            ) : (
              <div className="max-w-[44rem] mx-auto px-6 py-8 flex flex-col gap-6">
                {state.messages.map((m) => (
                  <Message key={m.id} message={m} />
                ))}
              </div>
            )}
          </div>

          <div className="max-w-[44rem] w-full mx-auto px-6 pb-6">
            <ChatInput
              initialValue={autoSubmit ? "" : initialQuery}
              disabled={streaming || keyLoading}
              onSubmit={send}
              placeholder={
                isEmpty
                  ? "What would you like to know about JAM?"
                  : "Ask a follow-up…"
              }
            />
          </div>
        </section>

        {/* Sources panel */}
        <aside className="hidden lg:block border-l border-border overflow-y-auto bg-card/20 px-5 py-6">
          <CitationsPanel assistant={lastAssistant} cards={state.cards} />
        </aside>
      </div>
    </div>
  );
}

function EmptyState() {
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
    </div>
  );
}

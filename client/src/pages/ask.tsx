import { useUserData } from "@fluffylabs/shared-ui/supabase";
import { Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChatInput } from "@/components/chat/ChatInput";
import { CitationsPanel } from "@/components/chat/CitationsPanel";
import { Message } from "@/components/chat/Message";
import { ModelPicker } from "@/components/chat/ModelPicker";
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
  const { data: keyData, isLoading: keyLoading } = useUserData(
    "openrouter-api-key",
    { appScoped: true }
  );

  const streamHandleRef = useRef<{ abort: () => void } | null>(null);
  const hasAutoSubmittedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = (text: string, options?: { startFresh?: boolean }) => {
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

  // Auto-submit once if ?q is set and ?autoSubmit=1. Before sending, wipe any
  // pre-existing conversation so the incoming question starts a fresh chat —
  // otherwise an autosubmit from the home page / results pivot would append to
  // whatever was lingering in sessionStorage from a prior session in this tab.
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
          {state.messages.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => dispatch({ type: "reset" })}
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

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
  const trimmedApiKey = typeof keyData === "string" ? keyData.trim() : "";
  const hasApiKey = trimmedApiKey !== "";

  const streamHandleRef = useRef<{ abort: () => void } | null>(null);
  const hasAutoSubmittedRef = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = useCallback(
    (text: string, options?: { startFresh?: boolean }) => {
      if (!isReady) return;
      const apiKey = hasApiKey ? trimmedApiKey : null;
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
            case "model_used":
              dispatch({ type: "setMessageModel", model: event.model });
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
    [isReady, hasApiKey, trimmedApiKey, dispatch, state.messages, state.model]
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
        <section className="flex flex-col overflow-hidden border-r-1 border-r-[#D4D4D4] dark:border-r-1 dark:border-r-[#181818]">
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
                    <Button variant="ghost" size="sm" onClick={handleNewChat}>
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

        <aside className="hidden lg:block border-l-1 border-l-white dark:border-l-1 dark:border-l-[#353535] overflow-y-auto bg-card/20 px-5 py-6">
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
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-light text-brand-dark dark:bg-brand-dark dark:text-brand mb-5">
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

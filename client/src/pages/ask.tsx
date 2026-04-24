import { useSession, useUserData } from "@fluffylabs/shared-ui/supabase";
import { Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { SharePopover } from "@/components/ask/SharePopover";
import { ChatInput } from "@/components/chat/ChatInput";
import { CitationsPanel } from "@/components/chat/CitationsPanel";
import { Message } from "@/components/chat/Message";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAskConversation } from "@/hooks/useAskConversation";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { type UseSessionsApi, useSessions } from "@/hooks/useSessions";
import { askStream } from "@/lib/askClient";
import { requestTitle } from "@/lib/askTitleClient";
import type { AskConversationState, AssistantMessage } from "@/lib/askTypes";
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
  const hydratedRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  // `sessions` identity changes on every react-query state transition
  // (mutation pending, refetch, invalidation…). The hydrate/save effects
  // only need access at call time, so we route through a ref instead of
  // listing `sessions` as a dep and re-running on every render.
  const sessionsRef = useRef<UseSessionsApi>(sessions);
  // What we last persisted to the DB for the active session. When the
  // reducer state matches this reference, the save effect skips —
  // preventing a save/invalidate/refetch/render loop.
  const lastSavedStateRef = useRef<AskConversationState | null>(null);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  useEffect(() => {
    sessionsRef.current = sessions;
  }, [sessions]);
  const [saveError, setSaveError] = useState<string | null>(null);
  // Set while fetching a session's full record from the DB on navigation.
  // Controls the loading skeleton so the UI changes immediately instead of
  // showing the previous session's messages during the network round-trip.
  const [isHydrating, setIsHydrating] = useState(false);

  // Hydrate when sessionId changes. Abort any running stream first.
  // Intentionally NOT depending on `sessions` — see sessionsRef above.
  useEffect(() => {
    if (!sessionId) {
      if (hydratedRef.current !== null) {
        const prevSessionId = hydratedRef.current;
        streamHandleRef.current?.abort();
        streamHandleRef.current = null;
        // Best-effort flush: the user may be navigating away mid-stream
        // (e.g., clicking "New chat" during the answer). `abort()` kills
        // the stream without firing `finishStreaming`, so the normal save
        // effect won't run. Persist a snapshot so the session survives.
        const snapshot = stateRef.current;
        if (
          snapshot.messages.length > 0 &&
          lastSavedStateRef.current !== snapshot
        ) {
          void sessionsRef.current
            .update(prevSessionId, { state: snapshot })
            .catch(() => {
              /* best-effort; user is leaving this session anyway */
            });
        }
        dispatch({ type: "reset" });
        hydratedRef.current = null;
        lastSavedStateRef.current = null;
      }
      return;
    }
    if (hydratedRef.current === sessionId) return;
    streamHandleRef.current?.abort();
    streamHandleRef.current = null;
    setIsHydrating(true);
    let cancelled = false;
    (async () => {
      const record = await sessionsRef.current.get(sessionId);
      if (cancelled) return;
      if (!record) {
        setIsHydrating(false);
        navigate("/ask", { replace: true });
        return;
      }
      dispatch({ type: "hydrate", state: record.state });
      hydratedRef.current = sessionId;
      // The hydrated state is by definition what's in the DB; mark it so
      // the save effect doesn't immediately re-save it on the next render.
      lastSavedStateRef.current = record.state;
      setIsHydrating(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, dispatch, navigate]);

  // Persist after an assistant turn finishes streaming. Skip when the
  // reducer state already matches what we persisted — otherwise the save
  // loops via invalidate→refetch→render→reschedule.
  useEffect(() => {
    if (!sessionId) return;
    if (hydratedRef.current !== sessionId) return;
    const last = state.messages[state.messages.length - 1];
    if (!last || last.role !== "assistant" || last.isStreaming) return;
    if (lastSavedStateRef.current === state) return;
    const timer = setTimeout(async () => {
      const stateToSave = stateRef.current;
      try {
        await sessionsRef.current.update(sessionId, { state: stateToSave });
        lastSavedStateRef.current = stateToSave;
        setSaveError(null);
      } catch (err) {
        setSaveError((err as Error).message);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [sessionId, state]);

  const send = useCallback(
    async (text: string, options?: { startFresh?: boolean }) => {
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

      // Snapshot the reducer state before dispatching; we need it for the
      // provisional title and for building the outgoing message list.
      const currentState = stateRef.current;

      if (options?.startFresh) dispatch({ type: "reset" });
      dispatch({ type: "sendUserMessage", text });

      const priorMessages = options?.startFresh ? [] : currentState.messages;
      const nextMessages = [
        ...priorMessages,
        { id: "pending", role: "user" as const, content: text },
      ];

      // If this is the first message in a new chat, create the session row and
      // move to /ask/:id so hydration + persistence can latch on.
      let activeId = sessionId;
      if (!activeId) {
        activeId = uuidv4();
        const provisional = deriveTitle({
          ...currentState,
          messages: [{ id: "pending", role: "user", content: text }],
        });
        try {
          await sessionsRef.current.create({
            id: activeId,
            title: provisional,
            state: {
              ...currentState,
              messages: [{ id: "pending", role: "user", content: text }],
            },
          });
          // Mark the new row as already-hydrated BEFORE navigating so the
          // hydrate effect short-circuits instead of round-tripping. Setting
          // this before `await create` would be wrong — a re-render during
          // the mutation's pending state would fire the nav-away flush path.
          hydratedRef.current = activeId;
          navigate(`/ask/${activeId}`, { replace: true });
          // Fire-and-forget title generation; patch the row when it resolves.
          const newId = activeId;
          requestTitle({ question: text, openrouterKey: apiKey }).then(
            (generated) => {
              if (generated) {
                void sessionsRef.current.update(newId, { title: generated });
              }
            }
          );
        } catch (err) {
          setSaveError((err as Error).message);
          return;
        }
      }

      streamHandleRef.current = askStream(
        {
          messages: nextMessages,
          model: currentState.model,
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
    [isReady, hasApiKey, trimmedApiKey, dispatch, sessionId, navigate]
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
      // eslint-disable-next-line react-hooks/set-state-in-effect
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

  const activeSession = sessionId
    ? sessions.sessions?.find((s) => s.id === sessionId)
    : undefined;

  const askTitle = (() => {
    if (!sessionId) return null;
    if (activeSession?.title) return activeSession.title;
    const fallback = deriveTitle(state);
    if (fallback) return fallback;
    return "Bamboozling…";
  })();
  useDocumentTitle(askTitle);

  return (
    <div className="flex flex-col h-full bg-background text-foreground font-light">
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
                const stateToSave = stateRef.current;
                await sessionsRef.current.update(sessionId, {
                  state: stateToSave,
                });
                lastSavedStateRef.current = stateToSave;
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
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_22rem] overflow-hidden">
        <section className="flex flex-col overflow-hidden border-l-1 border-l-white dark:border-l-[#353535] border-r-1 border-r-[#D4D4D4] dark:border-r-[#181818]">
          <SessionSectionHeader
            sessionId={sessionId}
            activeSession={activeSession}
            isHydrating={isHydrating}
            onToggleShare={(next) => {
              if (sessionId) sessions.update(sessionId, { isPublic: next });
            }}
          />
          <div
            ref={scrollRef}
            className="flex-1 overflow-y-auto border-t-1 border-t-white dark:border-t-[#353535]"
          >
            {isHydrating ? (
              <SessionLoadingSkeleton />
            ) : isEmpty ? (
              <EmptyState
                showApiKeyCta={isReady && !hasApiKey}
                onOpenSettings={() => navigate("/settings")}
              />
            ) : (
              <div className="max-w-[52rem] mx-auto px-6 py-8 flex flex-col gap-6">
                {state.messages.map((m) => (
                  <Message key={m.id} message={m} />
                ))}
              </div>
            )}
          </div>

          <div className="max-w-[52rem] w-full mx-auto px-6 pb-6">
            <ChatInput
              initialValue={autoSubmit ? "" : initialQuery}
              disabled={streaming || !isReady || isHydrating}
              onSubmit={send}
              model={state.model}
              onModelChange={(m) => dispatch({ type: "setModel", model: m })}
              placeholder={
                isEmpty
                  ? "What would you like to know about JAM?"
                  : isHydrating
                    ? "Loading conversation…"
                    : "Ask a follow-up…"
              }
            />
          </div>
        </section>

        <aside className="hidden lg:flex flex-col border-l-1 border-l-white dark:border-l-[#353535] bg-card/20 text-foreground overflow-hidden">
          {/* Muted horizontal divider: only the light highlight line on the
              content, no dark shadow on this header. */}
          <div className="h-12 shrink-0 px-5 flex items-center gap-2">
            <span className="text-sm text-foreground">Sources</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              {lastAssistant?.citations?.length ?? 0}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-4 border-t-1 border-t-white dark:border-t-[#353535]">
            {isHydrating ? (
              <div
                className="flex flex-col gap-3"
                role="status"
                aria-label="Loading sources"
              >
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
                <Skeleton className="h-20 w-full rounded-md" />
              </div>
            ) : (
              <CitationsPanel assistant={lastAssistant} cards={state.cards} />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}

function SessionSectionHeader({
  sessionId,
  activeSession,
  isHydrating,
  onToggleShare,
}: {
  sessionId: string | undefined;
  activeSession:
    | { id: string; title: string | null; isPublic: boolean }
    | undefined;
  isHydrating: boolean;
  onToggleShare: (next: boolean) => void;
}) {
  return (
    <div className="h-12 shrink-0 px-6 flex items-center gap-3">
      <div className="flex-1 min-w-0 truncate text-sm text-foreground">
        {sessionId ? (
          (activeSession?.title ?? (
            <Skeleton className="h-4 w-48 inline-block align-middle" />
          ))
        ) : (
          <span className="text-muted-foreground">New conversation</span>
        )}
      </div>
      {sessionId && activeSession && !isHydrating && (
        <SharePopover
          sessionId={sessionId}
          isPublic={activeSession.isPublic}
          onToggle={onToggleShare}
        />
      )}
    </div>
  );
}

function SessionLoadingSkeleton() {
  return (
    <div
      className="max-w-[52rem] mx-auto px-6 py-8 flex flex-col gap-6"
      role="status"
      aria-label="Loading conversation"
    >
      <div className="flex justify-end">
        <Skeleton className="h-10 w-56 rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-11/12" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-40 rounded-xl" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
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
      <h2 className="text-2xl text-foreground mb-3">Ask anything about JAM</h2>
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

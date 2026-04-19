import { useUserData } from "@fluffylabs/shared-ui/supabase";
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

  const send = (text: string) => {
    if (keyLoading) return;
    const apiKey =
      typeof keyData === "string" && keyData.trim() !== "" ? keyData : null;
    if (!apiKey) {
      dispatch({ type: "sendUserMessage", text });
      dispatch({
        type: "setError",
        message: "No OpenRouter API key found. Please add one in Settings.",
      });
      return;
    }

    dispatch({ type: "sendUserMessage", text });

    const nextMessages = [
      ...state.messages,
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
      send(initialQuery);
    }
  }, [autoSubmit, initialQuery, keyLoading]);

  useEffect(() => {
    return () => {
      streamHandleRef.current?.abort();
    };
  }, []);

  const lastAssistant = [...state.messages]
    .reverse()
    .find((m): m is AssistantMessage => m.role === "assistant");

  const streaming = lastAssistant?.isStreaming === true;

  return (
    <div className="flex flex-col h-full gap-4">
      <div className="flex items-center justify-between gap-2">
        <ModelPicker
          value={state.model}
          onChange={(m) => dispatch({ type: "setModel", model: m })}
        />
        <div className="flex gap-2">
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
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-[1fr_24rem] gap-4 overflow-hidden">
        <div className="flex flex-col gap-4 overflow-y-auto p-2">
          {state.messages.length === 0 && (
            <div className="text-sm text-muted-foreground">
              Ask a question about the JAM protocol. The agent will search the
              knowledge base (graypaper, Discord, Matrix, pages) and cite its
              sources on the right.
            </div>
          )}
          {state.messages.map((m) => (
            <Message key={m.id} message={m} />
          ))}
        </div>
        <div className="border-l border-border overflow-y-auto max-md:hidden">
          <CitationsPanel assistant={lastAssistant} cards={state.cards} />
        </div>
      </div>

      <ChatInput
        initialValue={autoSubmit ? "" : initialQuery}
        disabled={streaming || keyLoading}
        onSubmit={send}
      />
    </div>
  );
}

import { useEffect, useReducer, useRef } from "react";
import { askReducer, initialState } from "@/lib/askReducer";
import type { AskConversationState, ChatMessage } from "@/lib/askTypes";

const STORAGE_KEY = "ask-conversation";

// A refresh mid-stream leaves assistant messages with isStreaming=true and no
// live stream behind them. Mark them as finished with an error so the UI stops
// showing a perpetual loading indicator.
function resurrectMessages(messages: ChatMessage[]): ChatMessage[] {
  return messages.map((m) => {
    if (m.role !== "assistant" || !m.isStreaming) return m;
    return {
      ...m,
      isStreaming: false,
      error: m.error ?? "Response was interrupted. Ask again to retry.",
    };
  });
}

function hydrate(): AskConversationState {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as AskConversationState;
    if (!parsed || typeof parsed !== "object") return initialState;
    return {
      messages: resurrectMessages(
        Array.isArray(parsed.messages) ? parsed.messages : []
      ),
      cards: parsed.cards ?? {},
      model:
        typeof parsed.model === "string" ? parsed.model : initialState.model,
    };
  } catch {
    return initialState;
  }
}

export function useAskConversation() {
  const [state, dispatch] = useReducer(askReducer, undefined, hydrate);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // sessionStorage may be full or disabled; fail silently.
    }
  }, [state]);

  return { state, dispatch };
}

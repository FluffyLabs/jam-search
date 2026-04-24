import { useReducer } from "react";
import { askReducer, initialState } from "@/lib/askReducer";

export function useAskConversation() {
  const [state, dispatch] = useReducer(askReducer, initialState);
  return { state, dispatch };
}

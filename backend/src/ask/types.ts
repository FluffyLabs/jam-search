import { z } from "zod";

/**
 * Chat message as sent by the frontend. Assistant messages in the history may
 * have `tool_calls` when replayed, but users normally send only user/assistant
 * text turns in v1.
 */
export const chatMessageSchema = z.object({
  role: z.enum(["system", "user", "assistant", "tool"]),
  content: z.string(),
  tool_call_id: z.string().optional(),
  tool_calls: z
    .array(
      z.object({
        id: z.string(),
        type: z.literal("function"),
        function: z.object({
          name: z.string(),
          arguments: z.string(),
        }),
      })
    )
    .optional(),
});

export type ChatMessage = z.infer<typeof chatMessageSchema>;

/**
 * Events emitted by the agent loop, mirrored 1:1 as SSE events on the wire.
 */
export type AgentEvent =
  | { type: "tool_call"; name: string; args: unknown }
  | {
      type: "tool_result";
      name: string;
      resultCount: number;
      payload: unknown;
    }
  | { type: "content_delta"; text: string }
  | { type: "citation"; n: number; docId: string; sourceType: SourceType }
  | { type: "model_used"; model: string }
  | { type: "done" }
  | { type: "error"; message: string };

export type SourceType = "graypaper" | "discord" | "matrix" | "page";

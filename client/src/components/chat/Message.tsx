import { Fragment } from "react";
import { splitCitationMarkers } from "@/lib/askMarkers";
import type { AssistantPart, ChatMessage, TextPart } from "@/lib/askTypes";
import { cn } from "@/lib/utils";
import { ToolStep } from "./ToolStep";

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-xl border border-border bg-card text-card-foreground px-4 py-2.5 text-sm whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  const { parts, isStreaming } = message;
  // The blinking caret should attach to the final text part if we're still
  // streaming; otherwise we show a small "thinking…" indicator after the last
  // part (which will be a tool call mid-search).
  const lastTextIdx = lastIndexOfKind(parts, "text");
  const showTrailingIndicator =
    isStreaming &&
    (parts.length === 0 || parts[parts.length - 1].kind === "tool");

  return (
    <div className="flex flex-col gap-3">
      {parts.map((part, idx) =>
        part.kind === "tool" ? (
          <ToolStep
            key={part.id}
            step={part}
            isActive={isStreaming && idx === parts.length - 1}
          />
        ) : (
          <TextBlock
            key={part.id}
            part={part}
            streamingCaret={isStreaming && idx === lastTextIdx}
          />
        )
      )}

      {showTrailingIndicator && (
        <div className="text-xs text-muted-foreground italic">thinking…</div>
      )}

      {message.error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 text-destructive text-sm px-3 py-2">
          {message.error}
        </div>
      )}
    </div>
  );
}

function TextBlock({
  part,
  streamingCaret,
}: {
  part: TextPart;
  streamingCaret: boolean;
}) {
  const nodes = splitCitationMarkers(part.content);
  if (nodes.length === 0 && !streamingCaret) return null;
  return (
    <div
      className={cn(
        "text-[15px] leading-7 text-foreground whitespace-pre-wrap",
        streamingCaret && "ask-caret"
      )}
    >
      {nodes.map((node, idx) =>
        typeof node === "string" ? (
          // biome-ignore lint/suspicious/noArrayIndexKey: append-only streaming content
          <Fragment key={idx}>{node}</Fragment>
        ) : (
          // biome-ignore lint/suspicious/noArrayIndexKey: append-only streaming content
          <CitationRef key={idx} n={node.n} />
        )
      )}
    </div>
  );
}

function CitationRef({ n }: { n: number }) {
  return (
    <button
      type="button"
      onClick={() => {
        const el = document.getElementById(`citation-${n}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }}
      className={cn(
        "inline-flex items-center justify-center min-w-[1.5rem] h-5 px-1 mx-0.5",
        "rounded text-[11px] font-medium tabular-nums",
        "bg-brand-light text-brand-dark",
        "hover:bg-brand hover:text-white transition-colors align-middle"
      )}
    >
      {n}
    </button>
  );
}

function lastIndexOfKind(
  parts: AssistantPart[],
  kind: AssistantPart["kind"]
): number {
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].kind === kind) return i;
  }
  return -1;
}

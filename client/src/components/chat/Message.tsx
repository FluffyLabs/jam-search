import type { AssistantPart, ChatMessage, TextPart } from "@/lib/askTypes";
import { cn } from "@/lib/utils";
import { Markdown } from "./Markdown";
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
  if (!part.content && !streamingCaret) return null;
  return (
    <div className={cn("relative", streamingCaret && "ask-caret")}>
      <Markdown content={part.content} onCitationClick={scrollToCitation} />
    </div>
  );
}

function scrollToCitation(n: number): void {
  const el = document.getElementById(`citation-${n}`);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
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

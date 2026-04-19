import { Fragment } from "react";
import { splitCitationMarkers } from "@/lib/askMarkers";
import type { ChatMessage } from "@/lib/askTypes";
import { cn } from "@/lib/utils";
import { ToolStep } from "./ToolStep";

interface MessageProps {
  message: ChatMessage;
}

export function Message({ message }: MessageProps) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[80%] rounded-xl bg-primary text-primary-foreground px-4 py-2 whitespace-pre-wrap">
          {message.content}
        </div>
      </div>
    );
  }

  const nodes = splitCitationMarkers(message.content);

  return (
    <div className="flex flex-col gap-2">
      {message.toolSteps.map((step) => (
        <ToolStep key={step.id} step={step} />
      ))}
      <div
        className={cn(
          "prose prose-sm max-w-none whitespace-pre-wrap",
          message.isStreaming && "after:content-['▋'] after:animate-pulse"
        )}
      >
        {nodes.map((node, idx) =>
          typeof node === "string" ? (
            // biome-ignore lint/suspicious/noArrayIndexKey: append-only streaming content, no reordering
            <Fragment key={idx}>{node}</Fragment>
          ) : (
            // biome-ignore lint/suspicious/noArrayIndexKey: append-only streaming content, no reordering
            <CitationRef key={idx} n={node.n} />
          )
        )}
      </div>
      {message.error && (
        <div className="rounded border border-destructive/40 bg-destructive/10 text-destructive text-sm p-2">
          {message.error}
        </div>
      )}
    </div>
  );
}

function CitationRef({ n }: { n: number }) {
  return (
    <a
      href={`#citation-${n}`}
      className="font-mono text-xs px-1 rounded bg-accent text-accent-foreground hover:underline"
      onClick={(e) => {
        e.preventDefault();
        const el = document.getElementById(`citation-${n}`);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
      }}
    >
      [{n}]
    </a>
  );
}

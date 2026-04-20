import { useState } from "react";
import type { ToolPart } from "@/lib/askTypes";
import { cn } from "@/lib/utils";

interface ToolStepProps {
  step: ToolPart;
  /** True when this is the most recent step and the message is still streaming. */
  isActive?: boolean;
}

export function ToolStep({ step, isActive = false }: ToolStepProps) {
  const [open, setOpen] = useState(false);
  const pending = step.resultCount === undefined;
  const preview = summarizeArgs(step.args);

  return (
    <div
      className={cn(
        "text-xs leading-6 transition-opacity",
        // Completed, non-active tool steps fade back so the latest activity
        // and streamed prose read as the focal points.
        !pending && !isActive && "opacity-60 hover:opacity-100"
      )}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 w-full text-left text-muted-foreground hover:text-foreground transition-colors"
      >
        <span
          className={cn(
            "inline-block w-1.5 h-1.5 rounded-full shrink-0",
            pending
              ? "bg-brand-dark animate-pulse"
              : isActive
                ? "bg-brand-dark"
                : "bg-brand-dark/50"
          )}
        />
        <span className="font-medium text-foreground/80 shrink-0">
          {step.toolName}
        </span>
        {preview && (
          <span className="truncate text-muted-foreground">{preview}</span>
        )}
        <span className="flex-1" />
        {pending ? (
          <span className="text-muted-foreground italic shrink-0">
            searching…
          </span>
        ) : (
          <span className="text-muted-foreground shrink-0 tabular-nums">
            {step.resultCount} result{step.resultCount === 1 ? "" : "s"}
          </span>
        )}
      </button>
      {open && (
        <pre className="mt-1 ml-3.5 p-2 bg-muted/60 rounded-md text-[11px] text-muted-foreground overflow-x-auto whitespace-pre-wrap">
          {JSON.stringify(step.args, null, 2)}
        </pre>
      )}
    </div>
  );
}

function summarizeArgs(args: unknown): string {
  if (!args || typeof args !== "object") return "";
  const entries = Object.entries(args as Record<string, unknown>);
  if (entries.length === 0) return "";
  const [k, v] = entries[0];
  if (typeof v === "string") {
    const truncated = v.length > 70 ? `${v.slice(0, 70)}…` : v;
    return `"${truncated}"`;
  }
  return `${k}: …`;
}

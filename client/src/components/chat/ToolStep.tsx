import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ToolStep as ToolStepType } from "@/lib/askTypes";

interface ToolStepProps {
  step: ToolStepType;
}

export function ToolStep({ step }: ToolStepProps) {
  const [open, setOpen] = useState(false);
  const pending = step.resultCount === undefined;
  const label = pending
    ? `Calling ${step.toolName}…`
    : `${step.toolName}: ${step.resultCount} result${
        step.resultCount === 1 ? "" : "s"
      }`;

  return (
    <div className="text-xs text-muted-foreground">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1 hover:text-foreground transition-colors",
          pending && "animate-pulse"
        )}
      >
        <span>{open ? "▾" : "▸"}</span>
        <span>{label}</span>
      </button>
      {open && (
        <pre className="mt-1 ml-4 p-2 rounded bg-muted text-[10px] overflow-x-auto">
          {JSON.stringify(step.args, null, 2)}
        </pre>
      )}
    </div>
  );
}

import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ModelPicker } from "./ModelPicker";

interface ChatInputProps {
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (text: string) => void;
  model: string;
  onModelChange: (modelId: string) => void;
}

export function ChatInput({
  initialValue = "",
  placeholder = "Ask a follow-up…",
  disabled,
  onSubmit,
  model,
  onModelChange,
}: ChatInputProps) {
  const [value, setValue] = useState(initialValue);
  const [prevInitial, setPrevInitial] = useState(initialValue);
  const taRef = useRef<HTMLTextAreaElement>(null);

  if (initialValue !== prevInitial) {
    setPrevInitial(initialValue);
    setValue(initialValue);
  }

  // biome-ignore lint/correctness/useExhaustiveDependencies: value is the trigger
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue("");
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const ready = !disabled && value.trim() !== "";

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card",
        "focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30",
        "transition-all"
      )}
    >
      <Textarea
        ref={taRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          "border-0 bg-transparent shadow-none resize-none min-h-[44px]",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "text-[15px] leading-6 px-4 py-3"
        )}
      />
      <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border/60">
        <span className="hidden sm:inline text-[11px] text-muted-foreground">
          <kbd className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
            ⏎
          </kbd>{" "}
          to send ·{" "}
          <kbd className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
            ⇧⏎
          </kbd>{" "}
          for newline
        </span>
        <div className="flex items-center gap-2 ml-auto">
          <ModelPicker value={model} onChange={onModelChange} />
          <Button
            onClick={submit}
            disabled={!ready}
            size="sm"
            variant={ready ? "default" : "ghost"}
          >
            Ask
          </Button>
        </div>
      </div>
    </div>
  );
}

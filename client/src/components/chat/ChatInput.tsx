import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  initialValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onSubmit: (text: string) => void;
}

export function ChatInput({
  initialValue = "",
  placeholder = "Ask a follow-up…",
  disabled,
  onSubmit,
}: ChatInputProps) {
  const [value, setValue] = useState(initialValue);
  const taRef = useRef<HTMLTextAreaElement>(null);

  // Auto-grow up to a reasonable max
  // biome-ignore lint/correctness/useExhaustiveDependencies: value is the trigger
  useEffect(() => {
    const el = taRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  // Sync with external changes to initialValue (e.g. navigating with ?q=…)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue("");
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    // Don't submit while an IME is composing (Enter confirms the composition
    // in CJK languages — it shouldn't also submit the form).
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
      <div className="flex items-center justify-between px-3 py-2 border-t border-border/60">
        <span className="text-[11px] text-muted-foreground">
          <kbd className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
            ⏎
          </kbd>{" "}
          to send ·{" "}
          <kbd className="px-1 py-0.5 rounded bg-muted text-muted-foreground text-[10px]">
            ⇧⏎
          </kbd>{" "}
          for newline
        </span>
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
  );
}

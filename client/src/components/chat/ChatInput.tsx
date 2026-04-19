import { useState, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    setValue("");
    onSubmit(trimmed);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2">
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1"
        rows={2}
      />
      <Button onClick={submit} disabled={disabled || value.trim() === ""}>
        Ask
      </Button>
    </div>
  );
}

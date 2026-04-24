import { Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function SharePopover({
  sessionId,
  isPublic,
  onToggle,
}: {
  sessionId: string;
  isPublic: boolean;
  onToggle: (next: boolean) => Promise<void> | void;
}) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}${window.location.pathname}#/ask/s/${sessionId}`;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 font-light">
          <Share2 className="size-4" />
          {isPublic ? "Public" : "Share"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex items-center justify-between gap-3">
          <label
            htmlFor={`public-toggle-${sessionId}`}
            className="flex-1 text-sm"
          >
            Make this conversation public
          </label>
          <input
            id={`public-toggle-${sessionId}`}
            type="checkbox"
            className="size-4"
            checked={isPublic}
            onChange={(e) => {
              void onToggle(e.target.checked);
            }}
          />
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className={isPublic ? "" : "opacity-60"}
          />
          <Button
            size="icon"
            variant="outline"
            aria-label="Copy link"
            onClick={async () => {
              await navigator.clipboard.writeText(url);
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
          >
            <Copy className="size-4" />
          </Button>
        </div>
        {!isPublic && (
          <p className="mt-2 text-xs text-muted-foreground">
            Off — anyone with the link will see a 404.
          </p>
        )}
        {copied && (
          <p className="mt-2 text-xs text-muted-foreground">Copied!</p>
        )}
      </PopoverContent>
    </Popover>
  );
}

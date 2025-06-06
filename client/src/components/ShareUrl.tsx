import { Check, Share } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";

export const ShareUrl = () => {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const [copied, setCopied] = useState(false);

  const Ico = copied ? Check : Share;

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full text-xs flex items-center text-muted-foreground hover:text-foreground transition-colors min-w-auto"
      onClick={handleCopyLink}
    >
      <Ico className="w-4 h-4" />
      <span className="hidden md:inline overflow-hidden ml-1.5">
        { copied ? 'copied!' : 'share results' }
      </span>
    </Button>
  );
};

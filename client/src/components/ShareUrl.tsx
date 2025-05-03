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

  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      onClick={handleCopyLink}
    >
      {copied ? (
        <div className="flex items-center">
          <Check className="w-4 h-4 mr-1.5" />
          copied!
        </div>
      ) : (
        <div className="flex items-center">
          <Share className="w-4 h-4 mr-1.5" />
          share results
        </div>
      )}
    </Button>
  );
};

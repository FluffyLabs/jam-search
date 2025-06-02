import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SearchResult } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { MATRIX_CHANNELS } from "@/consts";
import { useState } from "react";

interface ViewEmbeddedDialogProps {
  url: string;
  className?: string;
  results?: SearchResult[];
}

export const ViewEmbeddedDialog = ({
  url,
  results,
}: ViewEmbeddedDialogProps) => {
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isOpen, setIsOpen] = useState(false);
  const hasSidebar = results && results.length > 0;

  const getUrl = (result: SearchResult) => {
    const channelUrl = MATRIX_CHANNELS.find(
      (channel) => channel.id === result.roomid
    )?.archiveUrl;
    return `${channelUrl}#${result.messageid}`;
  };

  const handleItemClick = (result: SearchResult) => {
    setCurrentUrl("");
    const newUrl = getUrl(result);
    setCurrentUrl(newUrl);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button className="text-xs text-brand flex items-center w-fit hover:opacity-60">
            <svg
              className="w-3 h-3 mr-1"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
            View embedded
          </button>
        </DialogTrigger>
        <DialogContent
          className={`w-full max-w-full h-full p-0 mt-[100px] ml-[-110px] border border-border rounded-2xl overflow-hidden ${
            hasSidebar ? "w-[calc(100vw-410px)]" : ""
          }`}
        >
          {currentUrl && (
            <iframe
              src={currentUrl}
              style={{
                width: "100%",
                height: "100%",
                colorScheme: "dark",
              }}
              title="Embedded thread view"
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Sidebar positioned outside the modal */}
      {hasSidebar && isOpen && (
        <div className="fixed top-[84px] right-0 w-[300px] h-full bg-card border border-border rounded-2xl shadow-lg z-[60] overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {results.map((result: SearchResult) => {
                const itemUrl = getUrl(result);
                const isSelected = currentUrl === itemUrl;

                return (
                  <div
                    key={result.messageid}
                    className={`p-3 rounded-md mb-2 cursor-pointer transition-colors border ${
                      isSelected
                        ? "bg-accent border-brand/50 shadow-sm"
                        : "bg-background border-border hover:bg-muted/50 hover:border-border"
                    }`}
                    onClick={() => handleItemClick(result)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`font-medium text-sm truncate pr-2 ${
                          isSelected ? "text-brand" : "text-foreground"
                        }`}
                      >
                        {result.sender}
                      </span>
                      {result.timestamp && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(result.timestamp)}
                        </span>
                      )}
                    </div>

                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-3 mb-3">
                      {result.content}
                    </p>

                    {result.messageid && (
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs ${
                            isSelected
                              ? "text-brand/80"
                              : "text-muted-foreground"
                          }`}
                        >
                          Click to view
                        </span>
                        <a
                          href={itemUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-brand flex items-center hover:opacity-70 transition-opacity"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg
                            className="w-3 h-3 mr-1"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                          </svg>
                          Open
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

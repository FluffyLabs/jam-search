import { SearchResult } from "@/lib/api";
import { highlightText, SearchMode } from "@/lib/utils";
import { MATRIX_CHANNELS } from "@/consts";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface MatrixResultListProps {
  results: SearchResult[];
  searchQuery: string;
  searchMode: SearchMode;
}

export const MatrixResultList = ({
  results,
  searchQuery,
  searchMode,
}: MatrixResultListProps) => {
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);

  if (results.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          No results found for your search.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {results.map((result: SearchResult) => (
        <div key={result.messageid} className="border-b border-border pb-6">
          <div className="mb-2">
            <div className="flex items-center mb-1">
              <span className="font-medium  text-foreground">
                {result.sender}{" "}
              </span>
              {result.timestamp && (
                <span className="text-xs text-muted-foreground ml-2">
                  {formatDate(result.timestamp)}
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-sm mb-2">
              {highlightText(
                result.content || "",
                searchQuery.split(/\s+/),
                searchMode
              )}
            </p>
            {result.messageid && (
              <div className="flex space-x-4">
                <a
                  href={`${
                    MATRIX_CHANNELS.find(
                      (channel) => channel.id === result.roomid
                    )?.archiveUrl
                  }#${result.messageid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand flex items-center w-fit hover:opacity-60"
                >
                  <svg
                    className="w-3 h-3 mr-1"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Go to thread
                </a>

                <Dialog>
                  <DialogTrigger asChild>
                    <button
                      onClick={() => {
                        const channelUrl = MATRIX_CHANNELS.find(
                          (channel) => channel.id === result.roomid
                        )?.archiveUrl;
                        setSelectedUrl(`${channelUrl}#${result.messageid}`);
                      }}
                      className="text-xs text-brand flex items-center w-fit hover:opacity-60"
                    >
                      <svg
                        className="w-3 h-3 mr-1"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect
                          x="2"
                          y="3"
                          width="20"
                          height="14"
                          rx="2"
                          ry="2"
                        ></rect>
                        <line x1="8" y1="21" x2="16" y2="21"></line>
                        <line x1="12" y1="17" x2="12" y2="21"></line>
                      </svg>
                      View embedded
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-full sm:max-w-[80vw] w-[105ch] h-[80vh] p-0 border border-border rounded-2xl overflow-hidden">
                    {selectedUrl && (
                      <iframe
                        src={selectedUrl}
                        style={{
                          width: "100%",
                          height: "100%",
                        }}
                        title="Embedded thread view"
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

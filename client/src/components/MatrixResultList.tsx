import { SearchResult } from "@/lib/api";
import { highlightText, SearchMode } from "@/lib/utils";
import { MATRIX_CHANNELS } from "@/consts";
import { formatDate } from "@/lib/utils";
import { ViewEmbeddedDialog } from "./ViewEmbeddedDialog";

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
  if (results.length === 0) {
    return (
      <div className="text-center p-8">
        <p className="text-muted-foreground">
          No results found for your search.
        </p>
      </div>
    );
  }

  const getUrl = (result: SearchResult) => {
    const channelUrl = MATRIX_CHANNELS.find(
      (channel) => channel.id === result.roomid
    )?.archiveUrl;
    return `${channelUrl}#${result.messageid}`;
  };

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

                <ViewEmbeddedDialog url={getUrl(result)} />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

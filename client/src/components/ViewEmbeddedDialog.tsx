import { SearchResult } from "@/lib/api";
import { cn, formatDate, highlightText, SearchMode } from "@/lib/utils";
import { MATRIX_CHANNELS } from "@/consts";
import { useEffect, useState } from "react";
import {useEmbeddedViewer} from "@/providers/EmbeddedResultsContext";
import {Button} from "./ui/button";
import {PageResult} from "./PageResults";

interface ViewEmbeddedDialogProps {
  url: string;
  className?: string;
  searchQuery: string;
  searchMode: SearchMode;
  results?: SearchResult[] | PageResult[];
}

export const ViewEmbeddedDialog = ({
  url,
  results,
  searchQuery,
  searchMode,
}: ViewEmbeddedDialogProps) => {
  const embeddedViewer = useEmbeddedViewer();
  const content = (
    <Content
      url={url}
      results={results}
      searchQuery={searchQuery}
      searchMode={searchMode}
      close={() => embeddedViewer.close()}
    ></Content>
  );

  return (
    <button
      onMouseEnter={() => embeddedViewer.render(content, false) }
      onClick={() => embeddedViewer.render(content)}
      className="text-xs text-brand flex items-center w-fit hover:opacity-60">
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
  );
};
   
const Content = ({
  url, results, close, searchQuery, searchMode,
}: ViewEmbeddedDialogProps & { close: () => void }) => {
  const [currentUrl, setCurrentUrl] = useState(url);

  // update the iframe content when the external url changes.
  useEffect(() => {
    setCurrentUrl(url);
  }, [url]);

  const hasSidebar = results && results.length > 0;

  const getUrl = (result: SearchResult) => {
    const channelUrl = MATRIX_CHANNELS.find(
      (channel) => channel.id === result.roomid
    )?.archiveUrl;
    return `${channelUrl}#${result.messageid}`;
  };

  const handleItemClick = (newUrl: string) => {
    setCurrentUrl("");
    setCurrentUrl(newUrl);
  };


  return (
    <div className={cn(
      "flex h-full",
      {
        "p-8 relative": !hasSidebar
      }
    )}>
      <div className={cn(
        "m-2 flex-1 border border-border rounded-2xl overflow-hidden",
        { "relative": hasSidebar }
      )}>
        <Button variant="ghost"  className="text-brand absolute top-0 right-0" onClick={close}>
          <CloseIcon />
        </Button>
        <iframe
          src={currentUrl ?? 'about:blank'}
          style={{
            width: "100%",
            height: "100%",
            colorScheme: "dark",
          }}
          title="Embedded thread view"
        />
      </div>
      {hasSidebar && (
        <div className="w-[300px] h-full bg-card border border-border shadow-lg overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-2">
              {results.map((inResult: SearchResult | PageResult) => {
                const res = detectType(inResult);
                const { isPageResult, result } = res;
              
                const itemUrl =  isPageResult ? result.url : getUrl(result);
                const isSelected = currentUrl === itemUrl;
                const id = isPageResult ? result.id : result.messageid ?? result.id;

                return (
                  <a
                    key={id}
                    href={itemUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleItemClick(itemUrl)
                    }}>
                  <div
                    className={`p-2 rounded-md mb-2 cursor-pointer transition-colors border ${
                      isSelected
                        ? "bg-brand-dark/15 border-brand/50 shadow-sm"
                        : "bg-background border-border hover:bg-muted/50 hover:border-border"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`font-medium text-sm truncate pr-2 ${
                          isSelected ? "text-brand" : "text-white light:text-neutral-800"
                        }`}
                      >
                        {isPageResult ? result.title : result.sender}
                      </span>
                      <span className="text-sm text-muted-foreground whitespace-nowrap">
                        {isPageResult ? formatDate(result.lastModified) : formatDate(result.timestamp)}
                      </span>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                      { /* TODO [ToDr] use markdown highlighter for pages */ }
                      {highlightText(
                        result.content || "",
                        searchQuery.split(/\s+/),
                        searchMode
                      )}
                    </p>
                  </div>
                  </a>
                );
              })}
            </div>
          </div>
          </div>
      )}
    </div>
  );
};

function detectType(result: SearchResult | PageResult): ({
  isPageResult: true,
  result: PageResult,
} | {
  isPageResult: false,
  result: SearchResult,
}) {
  return 'url' in result 
    ? { isPageResult: true, result }
    : { isPageResult: false, result }
}

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    aria-label="Close"
    role="img"
  >
    <line
      x1="6"
      y1="6"
      x2="18"
      y2="18"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
    />
    <line
      x1="6"
      y1="18"
      x2="18"
      y2="6"
      stroke="currentColor"
    />
  </svg>
);

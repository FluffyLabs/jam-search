import { PageResult, SearchResult } from "@/lib/api";
import { cn, formatDate, highlightText, SearchMode } from "@/lib/utils";
import { MATRIX_CHANNELS } from "@/consts";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {useEmbeddedViewer} from "@/providers/EmbeddedResultsContext";
import {Button} from "./ui/button";
import {PageResultHighlighter} from "./PageResultHighlighter";

interface ViewEmbeddedProps {
  label?: ReactNode,
  noEmbed?: boolean,
  url: string;
  className?: string;
  searchQuery: string;
  searchMode: SearchMode;
  loadMore?: () => Promise<SearchResult[] | PageResult[]>;
  results?: SearchResult[] | PageResult[];
}

export const ViewEmbedded = ({
  label = 'Preview',
  url,
  loadMore,
  results,
  searchQuery,
  searchMode,
  noEmbed = false,
}: ViewEmbeddedProps) => {
  const embeddedViewer = useEmbeddedViewer();
  const content = useMemo(() => (
    <Content
      url={url}
      loadMore={loadMore}
      results={results}
      searchQuery={searchQuery}
      searchMode={searchMode}
      close={() => embeddedViewer.close()}
    ></Content>
  ), [url, loadMore, results, searchQuery, searchMode, embeddedViewer]);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => embeddedViewer.render(content, false) }
      onClick={(e) => {
        // allow opening in new tab
        if (e.ctrlKey || e.metaKey || e.button === 1) {
          return;
        }
        // no iframe if we don't want it
        if (noEmbed) {
          return;
        }
        e.preventDefault();
        embeddedViewer.render(content)
      }}
      className="inline-flex items-center text-primary text-xs gap-1 after:absolute after:inset-0 hover:text-accent-foreground transition-colors"
    >
      {label}
    </a>
  );
};
   
const Content = ({
  url, results: initialResults, loadMore, close, searchQuery, searchMode,
}: ViewEmbeddedProps & { close: () => void }) => {
  const [results, setResults] = useState(initialResults);
  const [currentUrl, setCurrentUrl] = useState(url);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setResults(initialResults);
  }, [initialResults]);

  const handleLoadMore = useCallback(async () => {
    if (loadMore) {
      setResults(await loadMore());
    }
  }, [loadMore]);

  // update the iframe content when the external url changes.
  useEffect(() => {
    setCurrentUrl(url);
  }, [url]);

  // TODO [ToDr] changing iframe's src causes history
  // entries to be created which fucks up back/forward
  const hasSidebar = results && results.length > 0 && window.innerWidth > 500;

  const getUrl = (result: SearchResult) => {
    const channelUrl = MATRIX_CHANNELS.find(
      (channel) => channel.id === result.roomid
    )?.archiveUrl;
    return `${channelUrl}#${result.messageid}`;
  };

  const handleItemClick = useCallback((newUrl: string) => {
    setCurrentUrl(newUrl);
  }, []);

  const handleIframeLoadStart = useCallback(() => {
    setIsLoaded(false);
  }, []);

  const handleIframeLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const pages = loadMore !== undefined ? (
    <Button
      variant="ghost"
      onClick={handleLoadMore}
      className="text-primary w-full text-sm"
    >more</Button>
  ) : null;

  return (
    <div className={cn(
      "flex h-full",
      {
        "px-4 py-8 relative": !hasSidebar
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
          onLoadStart={handleIframeLoadStart}
          onLoad={handleIframeLoad}
          src={currentUrl ?? 'about:blank'}
          style={{
            width: "100%",
            height: "100%",
            colorScheme: "dark",
            opacity: isLoaded ? 100 : 0,
          }}
          className="animate-in fade-in-0"
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
                    className={`text-xs p-2 rounded-md mb-2 cursor-pointer transition-colors border ${
                      isSelected
                        ? "bg-brand-dark/15 border-brand/50 shadow-sm"
                        : "bg-card border-border hover:bg-accent hover:border-brand/50"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <span
                        className={`font-medium truncate pr-2 ${
                          isSelected ? "text-brand" : "text-white light:text-neutral-800"
                        }`}
                      >
                        {isPageResult ? result.title : result.sender}
                      </span>
                      <span className="text-muted-foreground whitespace-nowrap">
                        {isPageResult ? formatDate(result.lastModified) : formatDate(result.timestamp)}
                      </span>
                    </div>

                    { isPageResult ? (
                      <PageResultHighlighter
                        result={result}
                        searchQuery={searchQuery}
                        searchMode={searchMode}
                        options={{maxLength: 150, contextLength: 50}}
                      /> ) : (
                        <p className="text-muted-foreground leading-relaxed line-clamp-3">
                          {highlightText(
                            result.content || "",
                            searchQuery.split(/\s+/),
                            searchMode
                          )}
                        </p>
                      )}
                  </div>
                  </a>
                );
              })}

              {pages}
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

import { useLocation, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/SearchForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { parseSearchQuery, SearchMode, highlightText } from "@/lib/utils";
import { useSearchGraypaper } from "@/hooks/useSearchGraypaper";
import { ShareUrl } from "@/components/ShareUrl";

const GraypaperResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const searchModeParam =
    (new URLSearchParams(location.search).get("searchMode") as SearchMode) ||
    "strict";

  // Use our graypaper search hook with 10 results per page
  const {
    results,
    totalResults,
    currentPage,
    totalPages,
    isLoading,
    isError,
    pagination,
  } = useSearchGraypaper({
    query,
    pageSize: 10,
    searchMode: searchModeParam,
  });

  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl overflow-hidden text-card-foreground">
      <div className="w-full bg-card border-b border-border mb-6 sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="mt-0" asChild>
              <Link to={`/results${location.search}`}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-lg font-medium">Graypaper Results</h1>
            <span className="text-muted-foreground text-sm">
              {totalResults.toLocaleString()} results
            </span>
          </div>
          <ShareUrl />
        </div>
      </div>

      <div className="w-full max-w-4xl px-7">
        <SearchForm showSearchOptions={false} />

        {/* Display active filters as tags */}
        {query && parseSearchQuery(query).filters.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mt-2">
              {parseSearchQuery(query).filters.map((filter, index) => (
                <div
                  key={index}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary"
                >
                  <span className="font-semibold mr-1">{filter.key}:</span>
                  <span>{filter.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-lg font-medium mb-4">
          Graypaper Results ({totalResults} results)
        </h2>

        <div className="mt-8">
          {isLoading ? (
            <div className="text-center p-8">Loading graypaper results...</div>
          ) : isError ? (
            <div className="text-center p-8 text-destructive">
              Error loading graypaper results
            </div>
          ) : !results || results.length === 0 ? (
            <div className="text-center p-8">
              No graypaper results found for your search.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                {results.map((section) => (
                  <SectionResult
                    key={section.id}
                    title={section.title}
                    text={section.text}
                    query={query}
                    url={`https://graypaper.fluffylabs.dev/#/?search=${query}&section=${section.title}`}
                    searchMode={searchModeParam}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 mb-8 space-x-2">
                  <Button
                    onClick={pagination.previousPage}
                    disabled={!pagination.hasPreviousPage}
                    className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-muted-foreground"
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={pagination.nextPage}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-muted-foreground"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SectionResult = ({
  text,
  title,
  query,
  url,
  searchMode,
}: {
  text: string;
  title: string;
  query: string;
  url: string;
  searchMode: SearchMode;
}) => {
  return (
    <Card className="relative bg-card border-border">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs text-white font-normal truncate">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-3 pt-0">
        <div className="text-xs">
          {getTextToDisplay(text, query, searchMode)}
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary text-xs gap-1 font-extralight after:absolute after:inset-0 hover:underline"
        >
          <LinkIcon className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Read more</span>
        </a>
      </CardContent>
    </Card>
  );
};

const limit = 700;
const getTextToDisplay = (
  text: string,
  query: string,
  searchMode: SearchMode
) => {
  if (!text || !query) return text;

  // Get the first word from the query
  const queryWords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 2);

  if (queryWords.length === 0)
    return text.length > limit ? `${text.slice(0, limit)}...` : text;

  const normalizedText = text.toLowerCase();

  // Find the first occurrence of any query word
  const matchedWordResult = queryWords.reduce(
    (result, word) => {
      if (result.index !== -1) return result;

      const index = normalizedText.indexOf(word);
      if (index !== -1) {
        return {
          index,
          word,
        };
      }
      return result;
    },
    {
      index: -1,
      word: "",
    }
  );

  if (matchedWordResult.index === -1) {
    return text.length > limit ? `${text.slice(0, limit)}...` : text;
  }

  // Calculate initial start and end indices for the context window
  let startIndex = Math.max(0, matchedWordResult.index - limit / 2);
  let endIndex = Math.min(
    text.length,
    matchedWordResult.index + matchedWordResult.word.length + limit / 2
  );

  // Adjust startIndex to include full words
  if (startIndex > 0) {
    // Find the beginning of the first word
    const beforeText = text.slice(0, startIndex);
    const lastSpaceBeforeStart = beforeText.lastIndexOf(" ");
    if (lastSpaceBeforeStart !== -1) {
      startIndex = lastSpaceBeforeStart + 1;
    }
  }

  // Adjust endIndex to include full words
  if (endIndex < text.length) {
    // Find the end of the last word
    const nextSpaceAfterEnd = text.indexOf(" ", endIndex);
    if (nextSpaceAfterEnd !== -1) {
      endIndex = nextSpaceAfterEnd;
    } else {
      // If no more spaces, include the rest of the text
      endIndex = text.length;
    }
  }

  const result = [
    startIndex > 0 ? "..." : "",
    ...highlightText(text.slice(startIndex, endIndex), queryWords, searchMode),
    endIndex < text.length ? "..." : "",
  ];

  return result;
};

export default GraypaperResults;

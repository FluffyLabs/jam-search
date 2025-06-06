import { useLocation, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { SearchMode, highlightText } from "@/lib/utils";
import { useSearchGraypaper } from "@/hooks/useSearchGraypaper";
import {Skeleton} from "@/components/ui/skeleton";
import {ViewEmbedded} from "@/components/ViewEmbedded";
import {ResultHeader} from "@/components/results/ResultHeader";
import {Paging} from "@/components/Paging";
import {useRef} from "react";
import {Container} from "@/components/Container";

const GraypaperResultsAll = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const searchModeParam =
    (new URLSearchParams(location.search).get("searchMode") as SearchMode) ||
    "strict";
  const topRef = useRef(null);

  const queryResult = useSearchGraypaper({
    query,
    pageSize: 20,
    searchMode: searchModeParam,
  });

  const {
    results,
    totalResults,
    isLoading,
    isError,
  } = queryResult;

  const pages = (<Paging queryResult={queryResult} scrollTo={topRef} />);

  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl overflow-hidden text-card-foreground">
      <div ref={topRef}></div>
      <ResultHeader 
        left={
          <Button variant="ghost" size="icon" className="mt-0 w-auto h-8" asChild>
            <Link to={`/results${location.search}`}>
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">All sources</span>
            </Link>
          </Button>
        }
      />

      <Container>
        <h1 className="text-md font-medium text-white mb-2">{query}</h1>
        <span className="text-muted-foreground text-sm font-light">
          Found {totalResults.toLocaleString()} matches in <span className="text-white">Gray Paper</span>
        </span>

        <div className="mt-8">
          <div className="flex flex-col gap-4">
            {isLoading && results.length === 0 ? (
              <>
                <Skeleton className="w-full h-3 my-4" />
                <Skeleton className="w-full h-3 my-4" />
                <Skeleton className="w-full h-3 my-4" />
                <Skeleton className="w-full h-3 my-4" />
                <Skeleton className="w-full h-3 my-4" />
              </>
            ) : isError ? (
              <div className="text-center p-8 text-destructive">
                Error loading graypaper results
              </div>
            ) : !results || results.length === 0 ? (
              <div className="text-center p-8">
                No graypaper results found for your search.
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4">
                  {results.map((section) => (
                    <SectionResult
                      key={section.text}
                      title={section.title}
                      text={section.text}
                      query={query}
                      url={`https://graypaper.fluffylabs.dev/#/?search=${query}&section=${section.title}`}
                      searchMode={searchModeParam}
                    />
                  ))}
                </div>

                {pages}
              </>
            )}
          </div>
        </div>
      </Container>
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
    <Card className="relative bg-card border-border border-0 border-b rounded-none hover:bg-accent">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-sm text-white font-normal truncate">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-3 pt-0">
        <div className="text-sm font-light">
          {getTextToDisplay(text, query, searchMode)}
        </div>
        <div className="flex justify-end">
          <ViewEmbedded
            label="Open reader"
            url={url}
            results={[]}
            searchQuery={query}
            searchMode={searchMode}
          />
        </div>
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

export default GraypaperResultsAll;

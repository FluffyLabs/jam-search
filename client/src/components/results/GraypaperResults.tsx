import { Link, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link as RouterLink, useLocation } from "react-router";
import { Section } from "./Section";
import { highlightText, SearchMode } from "@/lib/utils";
import GraypaperReaderLogo from "@/assets/logos/graypaper.png";
import {useResults} from "@/hooks/useResults";
import {NoResults} from "./NoResults";
import {ResultCard} from "./ResultCard";

interface GraypaperResultsProps {
  queryResult: ReturnType<typeof useResults>['graypaper'],
  query: string;
  searchMode?: SearchMode;
}

export const GraypaperResults = ({
  queryResult,
  query,
  searchMode = "strict",
}: GraypaperResultsProps) => {
  const location = useLocation();
  const { isLoading, isError, results, totalResults } = queryResult;

  const graypaperReader = {
    title: "Gray Paper",
    url: 'https://graypaper.fluffylabs.dev',
    logo: GraypaperReaderLogo,
  };

  return (
    <div className="flex flex-col gap-4 mb-7">
      <Section
        logo={
          <img
            src={graypaperReader.logo}
            className="size-4"
            alt={`${graypaperReader.title} logo`}
          />
        }
        url={graypaperReader.url}
        title={graypaperReader.title}
        endBlock={
          <RouterLink to={`/results/graypaper${location.search}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary flex items-center text-xs"
            >
              {totalResults > 6 && (<>
                View all {totalResults} results
                <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </>)}
            </Button>
          </RouterLink>
        }
      />
      {isError || (results.length === 0 && !isLoading) ? (
        <NoResults isError={isError} />
      ) : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        { isLoading ? (<>
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
          <ResultCard.Skeleton />
        </>) : null }
        {results.map((section) => (
          <ResultCard
            key={section.id}
            header={section.title}
            content={
              <>
                <div className="text-xs">
                  {getTextToDisplay(section.text, query, searchMode)}
                </div>
                <a
                  href={`https://graypaper.fluffylabs.dev/#/?search=${query}&section=${section.title}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary text-xs gap-1 font-extralight after:absolute after:inset-0 hover:underline"
                >
                  <Link className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>Read more</span>
                </a>
              </>
            }
          />
        ))}
      </div>
    </div>
  );
};

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
    return text.length > 100 ? `${text.slice(0, 100)}...` : text;

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
    return text.length > 100 ? `${text.slice(0, 100)}...` : text;
  }

  // Calculate initial start and end indices for the context window
  let startIndex = Math.max(0, matchedWordResult.index - 40);
  let endIndex = Math.min(
    text.length,
    matchedWordResult.index + matchedWordResult.word.length + 40
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

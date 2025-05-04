import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link as RouterLink, useLocation } from "react-router";
import { useSearchGraypaper } from "@/hooks/useSearchGraypaper";
import { CommercialBanner } from "./CommercialBanner";

interface GraypaperResultsProps {
  query: string;
  searchMode?: string;
}

export const GraypaperResults = ({
  query,
  searchMode = "strict",
}: GraypaperResultsProps) => {
  const location = useLocation();

  // Use our graypaper search hook with 6 results per page (for compact view)
  const { results, totalResults, isLoading, isError } = useSearchGraypaper({
    query,
    pageSize: 6,
    searchMode,
  });

  if (isLoading) {
    return null;
  }

  if (isError) {
    return null; // No error message in compact view
  }

  if (!results || results.length === 0) {
    return null; // No empty state in compact view
  }

  const graypaperReader = {
    title: "Fluffy Labs - Gray Paper Reader",
    url: {
      display: "graypaper.fluffylabs.dev",
      href: "https://graypaper.fluffylabs.dev",
    },
  };

  return (
    <div className="flex flex-col gap-4 mb-7">
      <div className="flex justify-between items-center">
        <h2 className="text-sm">Graypaper ({totalResults} results)</h2>

        {totalResults > 6 && (
          <RouterLink to={`/results/graypaper${location.search}`}>
            <Button
              variant="ghost"
              size="sm"
              className="text-primary flex items-center text-xs"
            >
              View all {totalResults} results
              <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </RouterLink>
        )}
      </div>

      <CommercialBanner
        title={graypaperReader.title}
        url={graypaperReader.url}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {results.map((section) => (
          <SectionResult
            key={section.id}
            title={section.title}
            text={section.text}
            query={query}
            url="https://graypaper.fluffylabs.dev"
          />
        ))}
      </div>
    </div>
  );
};

const SectionResult = ({
  text,
  title,
  query,
  url,
}: {
  text: string;
  title: string;
  query: string;
  url: string;
}) => {
  return (
    <Card className="relative bg-card border-border">
      <CardHeader className="p-3 pb-1">
        <CardTitle className="text-xs text-white font-normal truncate">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 p-3 pt-0">
        <div className="text-xs">"{getTextToDisplay(text, query)}"</div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-primary text-xs gap-1 font-extralight after:absolute after:inset-0 hover:underline"
        >
          <Link className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Read more</span>
        </a>
      </CardContent>
    </Card>
  );
};

const getTextToDisplay = (text: string, query: string) => {
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
    ...highlightText(text.slice(startIndex, endIndex), queryWords),
    endIndex < text.length ? "..." : "",
  ];

  return result;
};

export const highlightText = (text: string, words: string[]) => {
  // TODO: this is not secure solution as words comes from user input
  const regex = new RegExp(`(${words.join("|")})`, "gi");
  const result = [];

  let match = regex.exec(text);
  let lastIndex = 0;

  while (match) {
    const before = text.slice(lastIndex, match.index);
    result.push(before);
    result.push(<span className="text-foreground font-bold">{match[0]}</span>);
    lastIndex = match.index + match[0].length;
    match = regex.exec(text);
  }

  const after = text.slice(lastIndex);
  result.push(after);

  return result;
};

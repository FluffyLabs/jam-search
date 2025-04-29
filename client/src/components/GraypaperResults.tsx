import { searchGraypaper } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";
import Logo from "@/assets/logo.svg";

const useGraypaperSearch = (query: string) => {
  return useQuery({
    queryKey: ["graypaper-search", query],
    queryFn: () =>
      searchGraypaper(query, {
        page: 1,
        pageSize: 6,
      }),
    enabled: !!query,
    staleTime: 0,
  });
};

export const GraypaperResults = ({ query }: { query: string }) => {
  const { data } = useGraypaperSearch(query);

  if (!data || data.results.length === 0) {
    return null;
  }

  const graypaperReader = {
    title: "Fluffy Labs - Gray Paper Reader",
    url: {
      display: "graypaper.fluffylabs.dev",
      href: "https://graypaper.fluffylabs.dev",
    },
    description:
      "We build fluffy blockchain stuff. Talk is cheap, so see our GitHub for the code. Projects no fluff - we build...",
  };

  return (
    <div className="flex flex-col gap-4 mb-4">
      <h2 className="text-sm">Top Graypaper Results</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.results.map((section) => (
          <SectionResult
            key={section.id}
            title={section.title}
            text={section.text}
            query={query}
            url="https://graypaper.fluffylabs.dev"
          />
        ))}
      </div>
      <GraypaperReaderBanner
        title={graypaperReader.title}
        url={graypaperReader.url}
        description={graypaperReader.description}
      />
    </div>
  );
};

const GraypaperReaderBanner = ({
  title,
  url,
  description,
}: {
  title: string;
  url: {
    display: string;
    href: string;
  };
  description: string;
}) => {
  return (
    <Card className="relative bg-secondary border-border">
      <CardContent className="p-1.5 flex gap-2 shrink-0 items-center">
        <div className="bg-muted p-2 rounded-full border-border border">
          <img src={Logo} className="size-6" alt="Fluffy Labs Logo" />
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <CardTitle className="text-sm text-primary">{title}</CardTitle>
            <a
              href={url.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground after:absolute after:inset-0"
            >
              {url.display}
            </a>
          </div>
          <p className="text-xs text-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
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

const highlightText = (text: string, words: string[]) => {
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

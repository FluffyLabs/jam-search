import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "lucide-react";
import { highlightText, SearchMode } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Components } from "react-markdown";

interface PageResult {
  id: number;
  url: string;
  title: string;
  content: string;
  lastModified: string;
  similarity?: number;
  score?: number;
}

interface PageResultsProps {
  results: PageResult[];
  searchQuery: string;
  searchMode?: SearchMode;
}

const truncateContent = (
  content: string,
  searchQuery: string,
  searchMode: SearchMode
): string => {
  const MAX_LENGTH = 500;
  const CONTEXT_LENGTH = 250; // Characters to show before and after the highlight

  // Find the first occurrence of the search query
  const regex = new RegExp(
    searchMode === "strict" ? searchQuery : searchQuery.split("").join(".*?"),
    "i"
  );
  const match = content.match(regex);

  if (!match) {
    // If no match found, return first MAX_LENGTH characters
    return content.length > MAX_LENGTH
      ? content.slice(0, MAX_LENGTH) + "..."
      : content;
  }

  const matchIndex = match.index || 0;
  const start = Math.max(0, matchIndex - CONTEXT_LENGTH);
  const end = Math.min(
    content.length,
    matchIndex + match[0].length + CONTEXT_LENGTH
  );

  let truncated = content.slice(start, end);

  // Add ellipsis if we're not at the start/end of the content
  if (start > 0) truncated = "..." + truncated;
  if (end < content.length) truncated = truncated + "...";

  return truncated;
};

const HighlightedText = ({
  children,
  searchQuery,
  searchMode,
}: {
  children: React.ReactNode;
  searchQuery: string;
  searchMode: SearchMode;
}) => {
  if (typeof children !== "string") return <>{children}</>;

  return highlightText(children, [searchQuery], searchMode);
};

export const PageResults = ({
  results,
  searchQuery,
  searchMode = "strict",
}: PageResultsProps) => {
  if (!results.length) {
    return (
      <div className="text-center text-muted-foreground p-8">
        No results found
      </div>
    );
  }

  const markdownComponents: Components = {
    p: ({ children }) => (
      <p>
        <HighlightedText searchQuery={searchQuery} searchMode={searchMode}>
          {children}
        </HighlightedText>
      </p>
    ),
    h1: ({ children }) => (
      <h1>
        <HighlightedText searchQuery={searchQuery} searchMode={searchMode}>
          {children}
        </HighlightedText>
      </h1>
    ),
    h2: ({ children }) => (
      <h2>
        <HighlightedText searchQuery={searchQuery} searchMode={searchMode}>
          {children}
        </HighlightedText>
      </h2>
    ),
    h3: ({ children }) => (
      <h3>
        <HighlightedText searchQuery={searchQuery} searchMode={searchMode}>
          {children}
        </HighlightedText>
      </h3>
    ),
    h4: ({ children }) => (
      <h4>
        <HighlightedText searchQuery={searchQuery} searchMode={searchMode}>
          {children}
        </HighlightedText>
      </h4>
    ),
    h5: ({ children }) => (
      <h5>
        <HighlightedText searchQuery={searchQuery} searchMode={searchMode}>
          {children}
        </HighlightedText>
      </h5>
    ),
    h6: ({ children }) => (
      <h6>
        <HighlightedText searchQuery={searchQuery} searchMode={searchMode}>
          {children}
        </HighlightedText>
      </h6>
    ),
    li: ({ children }) => (
      <li>
        <HighlightedText searchQuery={searchQuery} searchMode={searchMode}>
          {children}
        </HighlightedText>
      </li>
    ),
    code: ({ children }) => (
      <code>
        <HighlightedText searchQuery={searchQuery} searchMode={searchMode}>
          {children}
        </HighlightedText>
      </code>
    ),
    pre: ({ children }) => (
      <pre>
        <HighlightedText searchQuery={searchQuery} searchMode={searchMode}>
          {children}
        </HighlightedText>
      </pre>
    ),
  };

  return (
    <div className="space-y-4">
      {results.map((result) => (
        <Card key={result.id} className="bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline flex items-center gap-2"
              >
                {result.title}
                <Link className="h-4 w-4" />
              </a>
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Last modified:{" "}
              {new Date(result.lastModified).toLocaleDateString()}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none overflow-hidden [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_p]:break-words [&_table]:w-full [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto">
              <ReactMarkdown components={markdownComponents}>
                {truncateContent(result.content, searchQuery, searchMode)}
              </ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

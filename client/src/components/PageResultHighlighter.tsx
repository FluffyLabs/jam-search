import ReactMarkdown from "react-markdown";
import { Components } from "react-markdown";
import { cn, highlightText, SearchMode } from "@/lib/utils";
import { ClassValue } from "clsx";
import { PageResult } from "@/lib/api";

interface PageResultHighlighterProps {
  result: PageResult;
  searchQuery: string;
  searchMode: SearchMode;
  options: {
    maxLength: number;
    contextLength: number;
  };
}

export const PageResultHighlighter = ({
  result,
  searchQuery,
  searchMode,
  options,
}: PageResultHighlighterProps) => {
  const markdownComponents: Components = {
    p: createHighlightedComponent(
      "p",
      searchQuery,
      searchMode
    ) as Components["p"],
    em: createHighlightedComponent(
      "em",
      searchQuery,
      searchMode
    ) as Components["em"],
    h1: createHighlightedComponent(
      "h1",
      searchQuery,
      searchMode
    ) as Components["h1"],
    h2: createHighlightedComponent(
      "h2",
      searchQuery,
      searchMode
    ) as Components["h2"],
    h3: createHighlightedComponent(
      "h3",
      searchQuery,
      searchMode
    ) as Components["h3"],
    h4: createHighlightedComponent(
      "h4",
      searchQuery,
      searchMode
    ) as Components["h4"],
    h5: createHighlightedComponent(
      "h5",
      searchQuery,
      searchMode
    ) as Components["h5"],
    h6: createHighlightedComponent(
      "h6",
      searchQuery,
      searchMode
    ) as Components["h6"],
    li: createHighlightedComponent(
      "li",
      searchQuery,
      searchMode
    ) as Components["li"],
    code: createHighlightedComponent(
      "code",
      searchQuery,
      searchMode
    ) as Components["code"],
    pre: createHighlightedComponent(
      "pre",
      searchQuery,
      searchMode
    ) as Components["pre"],
  };

  return (
    <div className="text-muted-foreground font-light prose prose-sm dark:prose-invert max-w-none overflow-hidden [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_p]:break-words [&_table]:w-full [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto">
      <ReactMarkdown components={markdownComponents}>
        {truncateContent(result.content, searchQuery, searchMode, options)}
      </ReactMarkdown>
    </div>
  );
};

const createHighlightedComponent = (
  Component: React.ElementType,
  searchQuery: string,
  searchMode: SearchMode
) => {
  return ({
    children,
    ...props
  }: { children?: React.ReactNode } & Record<string, unknown>) => {
    const childArray = Array.isArray(children) ? children : [children];

    return (
      <Component
        {...props}
        className={cn(
          (Component as string).includes("h") ? "font-normal underline" : "",
          props.className as ClassValue
        )}
      >
        {childArray.map((child) =>
          typeof child === "string"
            ? highlightText(child, [searchQuery], searchMode)
            : child
        )}
      </Component>
    );
  };
};

// This function assumes that the content and search query words are separated with spaces
const findBestMatch = (
  content: string,
  searchQuery: string,
  searchMode: SearchMode
) => {
  const contentLower = content.toLowerCase();
  const searchQueryLower = searchQuery.toLowerCase();

  if (searchMode === "strict") {
    const index = contentLower.indexOf(searchQueryLower);
    return index !== -1 ? { index, length: searchQueryLower.length } : null;
  }

  const queryWords = searchQueryLower
    .split(" ")
    .filter((word) => word.length > 0);
  if (queryWords.length === 0) return null;

  // Try to find consecutive subsequences, starting with the longest
  for (let length = queryWords.length; length >= 1; length--) {
    for (let start = 0; start <= queryWords.length - length; start++) {
      const subsequence = queryWords.slice(start, start + length);
      const searchText = subsequence.join(" ");

      const index = contentLower.indexOf(searchText);
      if (index === -1) continue;

      return {
        index,
        length: searchText.length,
      };
    }
  }

  return null;
};

const truncateContent = (
  content: string,
  searchQuery: string,
  searchMode: SearchMode,
  options: {
    maxLength: number;
    contextLength: number;
  }
): string => {
  // Normalize spaces in both content and query
  const normalizedContent = content.replace(/\s+/g, " ");
  const normalizedQuery = searchQuery.replace(/\s+/g, " ");

  // Find the best match of the search query
  const match = findBestMatch(normalizedContent, normalizedQuery, searchMode);

  if (!match) {
    // If no match found, return first MAX_LENGTH characters
    return normalizedContent.length > options.maxLength
      ? normalizedContent.slice(0, options.maxLength) + "..."
      : normalizedContent;
  }

  const start = Math.max(0, match.index - options.contextLength);
  const end = Math.min(
    normalizedContent.length,
    match.index + match.length + options.contextLength
  );

  let truncated = normalizedContent.slice(start, end);

  // Add ellipsis if we're not at the start/end of the content
  if (start > 0) truncated = "..." + truncated;
  if (end < normalizedContent.length) truncated = truncated + "...";

  return truncated;
};

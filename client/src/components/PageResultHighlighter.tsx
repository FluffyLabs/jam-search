import type { ClassValue } from "clsx";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import type { PageResult } from "@/lib/api";
import { cn, highlightText } from "@/lib/utils";

interface PageResultHighlighterProps {
  result: PageResult;
  searchQuery: string;
  options: {
    maxLength: number;
    contextLength: number;
    preserveWhitespace?: boolean;
  };
}

export const PageResultHighlighter = ({
  result,
  searchQuery,
  options,
}: PageResultHighlighterProps) => {
  const markdownComponents: Components = {
    p: createHighlightedComponent("p", searchQuery) as Components["p"],
    em: createHighlightedComponent("em", searchQuery) as Components["em"],
    h1: createHighlightedComponent("h1", searchQuery) as Components["h1"],
    h2: createHighlightedComponent("h2", searchQuery) as Components["h2"],
    h3: createHighlightedComponent("h3", searchQuery) as Components["h3"],
    h4: createHighlightedComponent("h4", searchQuery) as Components["h4"],
    h5: createHighlightedComponent("h5", searchQuery) as Components["h5"],
    h6: createHighlightedComponent("h6", searchQuery) as Components["h6"],
    li: createHighlightedComponent("li", searchQuery) as Components["li"],
    code: createHighlightedComponent("code", searchQuery) as Components["code"],
    pre: createHighlightedComponent("pre", searchQuery) as Components["pre"],
  };

  return (
    <div className="text-muted-foreground font-light prose prose-sm dark:prose-invert max-w-none overflow-hidden [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_p]:break-words [&_table]:w-full [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto">
      <ReactMarkdown components={markdownComponents}>
        {truncateContent(result.content, searchQuery, options)}
      </ReactMarkdown>
    </div>
  );
};

const createHighlightedComponent = (
  Component: React.ElementType,
  searchQuery: string
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
            ? highlightText(child, [searchQuery])
            : child
        )}
      </Component>
    );
  };
};

// This function assumes that the content and search query words are separated with spaces
// eslint-disable-next-line react-refresh/only-export-components
export const findBestMatch = (
  content: string,
  searchQuery: string
): { index: number; length: number } | null => {
  if (searchQuery.length === 0) return null;

  const contentLower = content.toLowerCase();
  const searchQueryLower = searchQuery.toLowerCase();

  const queryWords = searchQueryLower
    .split(/\s+/)
    .filter((word) => word.length > 0);
  if (queryWords.length === 0) return null;

  // Binary search for the longest matching subsequence
  // Invariant: If a subsequence of length k exists, then subsequences of all lengths ≤ k also exist
  let left = 1;
  let right = queryWords.length;
  let bestMatch: { index: number; length: number } | null = null;

  // Helper function to check if any subsequence of given length exists
  const hasMatchOfLength = (targetLength: number) => {
    for (let start = 0; start <= queryWords.length - targetLength; start++) {
      const subsequence = queryWords.slice(start, start + targetLength);
      const searchText = subsequence.join(" ");
      const index = contentLower.indexOf(searchText);

      if (index !== -1) {
        bestMatch = { index, length: searchText.length };
        return true;
      }
    }
    return false;
  };

  // Binary search to find maximum length with a match
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (hasMatchOfLength(mid)) {
      left = mid + 1; // Try longer sequences
    } else {
      right = mid - 1; // Try shorter sequences
    }
  }

  return bestMatch;
};

const truncateContent = (
  content: string,
  searchQuery: string,
  options: {
    maxLength: number;
    contextLength: number;
    preserveWhitespace?: boolean;
  }
): string => {
  // When preserving whitespace (e.g. for code), don't collapse newlines/indentation
  const normalizedContent = options.preserveWhitespace
    ? content
    : content.replace(/\s+/g, " ");
  const normalizedQuery = searchQuery.replace(/\s+/g, " ");

  // Find the best match of the search query
  const match = findBestMatch(normalizedContent, normalizedQuery);

  if (!match) {
    // If no match found, return first MAX_LENGTH characters
    return normalizedContent.length > options.maxLength
      ? `${normalizedContent.slice(0, options.maxLength)}...`
      : normalizedContent;
  }

  const start = Math.max(0, match.index - options.contextLength);
  const end = Math.min(
    normalizedContent.length,
    match.index + match.length + options.contextLength
  );

  let truncated = normalizedContent.slice(start, end);

  // Add ellipsis if we're not at the start/end of the content
  if (start > 0) truncated = `...${truncated}`;
  if (end < normalizedContent.length) truncated = `${truncated}...`;

  return truncated;
};

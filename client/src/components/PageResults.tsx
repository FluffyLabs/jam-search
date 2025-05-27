import { cn, formatDate, highlightText, SearchMode } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Components } from "react-markdown";
import React from "react";
import { ClassValue } from "clsx";
import { ViewEmbeddedDialog } from "./ViewEmbeddedDialog";

interface PageResult {
  id: number;
  url: string;
  site: string;
  title: string;
  content: string;
  lastModified: string;
  similarity?: number;
  score?: number;
  createdAt: string;
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

const createHighlightedComponent = (
  Component: React.ElementType,
  searchQuery: string,
  searchMode: SearchMode
) => {
  return ({
    children,
    ...props
  }: { children?: React.ReactNode } & Record<string, unknown>) => {
    if (typeof children === "string") {
      return (
        <Component
          {...props}
          className={cn(
            (Component as string).includes("h") ? "font-bold" : "",
            props.className as ClassValue
          )}
        >
          {highlightText(children, [searchQuery], searchMode)}
        </Component>
      );
    }
    return <Component {...props}>{children}</Component>;
  };
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
    p: createHighlightedComponent(
      "p",
      searchQuery,
      searchMode
    ) as Components["p"],
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
    <div className="space-y-6">
      {results.map((result) => (
        <div key={result.id} className="border-b border-border pb-6">
          <div className="mb-2">
            <div className="flex items-center mb-1">
              <div className="font-medium text-foreground mr-2">
                {result.title}
              </div>
              {result.site.includes("github") && (
                <span className="text-xs text-muted-foreground">
                  {result.url.includes("/pull/") ? "PR" : "Issue"}
                  {" - "}
                  {formatDate(result.createdAt)}
                </span>
              )}
            </div>
            <div className="text-sm text-muted-foreground prose prose-sm dark:prose-invert max-w-none overflow-hidden [&_pre]:overflow-x-auto [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words [&_p]:break-words [&_table]:w-full [&_table]:overflow-x-auto [&_img]:max-w-full [&_img]:h-auto">
              <ReactMarkdown components={markdownComponents}>
                {truncateContent(result.content, searchQuery, searchMode)}
              </ReactMarkdown>
            </div>
            <div className="flex space-x-4 mt-2">
              <a
                href={result.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brand flex items-center w-fit hover:opacity-60"
              >
                <svg
                  className="w-3 h-3 mr-1"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Go to page
              </a>

              <ViewEmbeddedDialog url={result.url} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

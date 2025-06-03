import { formatDate, SearchMode } from "@/lib/utils";
import { ViewEmbeddedDialog } from "./ViewEmbeddedDialog";
import {PageResultHighlighter} from "./PageResultHighlighter";

export interface PageResult {
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
            <PageResultHighlighter
              result={result}
              searchQuery={searchQuery}
              searchMode={searchMode}
              options={{maxLength: 250, contextLength: 75}}
            />
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

              <ViewEmbeddedDialog 
                url={result.url}
                results={results}
                searchQuery={searchQuery}
                searchMode={searchMode}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

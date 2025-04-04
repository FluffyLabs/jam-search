import { useEffect } from "react";
import { SearchForm } from "@/components/SearchForm";
import { useSearch } from "@/hooks/useSearch";
import { useLocation } from "react-router";
import { SearchResult } from "@/lib/api";
import { Button } from "@/components/ui/button";

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const {
    search,
    searchQuery,
    results,
    totalResults,
    isLoading,
    isError,
    pagination,
  } = useSearch({ initialQuery: query });

  useEffect(() => {
    if (query) {
      search(query);
    }
  }, [query]);

  if (isLoading) {
    return <div className="text-center p-8">Loading results...</div>;
  }

  if (isError) {
    return (
      <div className="text-center p-8 text-destructive">
        Error loading search results
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl p-4 text-card-foreground">
      {/* Top results bar */}
      <div className="w-full max-w-4xl bg-card border-b border-border mb-4">
        <div className="flex items-center justify-between py-2.5 px-1">
          <div className="flex items-center space-x-2">
            <div className="flex items-center border-1 px-2 py-1 rounded">
              <span className="text-muted-foreground text-sm mr-1">Source</span>
              <span className="bg-muted rounded-full px-2 py-0.5 text-xs text-muted-foreground mr-3">
                1
              </span>
            </div>
            <span className="text-muted-foreground text-sm">
              {totalResults.toLocaleString()} results
            </span>
          </div>
          <Button variant="outline">
            <svg
              className="w-4 h-4 mr-1.5 opacity-70"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            copy link
          </Button>
        </div>
      </div>

      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-foreground mb-6">
          {searchQuery}
        </h2>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            More Findings
          </h3>

          {results.length === 0 ? (
            <div className="text-center p-8">
              <p className="text-muted-foreground">
                No results found for your search.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {results.map((result: SearchResult, index) => (
                <div key={index} className="border-b border-border pb-6">
                  <div className="mb-2">
                    <div className="flex items-center mb-1">
                      <span className="font-medium text-foreground">
                        Matrix Chat: {result.title}
                      </span>
                      {result.timestamp && (
                        <span className="text-xs text-muted-foreground ml-2">
                          {new Date(result.timestamp).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </span>
                      )}
                    </div>
                    <p className="text-muted-foreground text-sm mb-2">
                      "{result.content}"
                    </p>
                    {result.link && (
                      <a
                        href={result.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-brand flex items-center w-fit hover:text-brand-dark"
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
                        View thread
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {results.length > 0 && (
          <div className="flex justify-center items-center mt-6 mb-8 space-x-2">
            <Button
              onClick={pagination.previousPage}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-1 bg-muted rounded disabled:opacity-50 text-muted-foreground"
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.currentPage + 1}
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
        <SearchForm />
      </div>
    </div>
  );
};

export default SearchResults;

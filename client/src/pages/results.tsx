import { useEffect } from "react";
import { SearchForm } from "@/components/SearchForm";
import { useSearch } from "@/hooks/useSearch";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { ResultList } from "@/components/ResultList";

interface ResultHeaderProps {
  totalResults: number;
  sourceCount?: number;
}

const ResultHeader = ({ totalResults, sourceCount = 1 }: ResultHeaderProps) => {
  return (
    <div className="w-full bg-card border-b border-border mb-6 sticky top-0 z-10 px-2">
      <div className="flex items-center justify-between py-3 px-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-card/80 border border-border px-2 py-1 rounded-md">
            <span className="text-muted-foreground text-sm font-medium mr-1.5">
              Source
            </span>
            <span className="bg-muted rounded-full px-2 py-0.5 text-xs text-muted-foreground">
              {sourceCount}
            </span>
          </div>
          <span className="text-muted-foreground text-sm">
            {totalResults.toLocaleString()} results
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
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
  );
};

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
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl overflow-hidden text-card-foreground">
      <ResultHeader totalResults={totalResults} />

      <div className="w-full max-w-4xl">
        <SearchForm />

        <h2 className="text-2xl font-bold text-foreground mb-6">
          {searchQuery}
        </h2>

        <div className="mb-8">
          <ResultList results={results} />
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
              Page {pagination.currentPage}
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
      </div>
    </div>
  );
};

export default SearchResults;

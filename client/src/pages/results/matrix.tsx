import { useEffect } from "react";
import { useLocation, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/SearchForm";
import { ResultList } from "@/components/ResultList";
import { useSearch } from "@/hooks/useSearch";
import { MATRIX_CHANNELS } from "@/consts";
import { parseSearchQuery } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const MatrixResults = () => {
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
  } = useSearch({
    initialQuery: query,
    channelId: MATRIX_CHANNELS[0].id,
    pageSize: 10,
  });

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / pagination.pageSize);

  useEffect(() => {
    if (query) {
      // Parse the query to extract filters
      const { rawQuery, filters } = parseSearchQuery(query);

      // Pass the raw query and filters separately
      search(rawQuery, { filters });
    }
  }, [query]);

  if (isError) {
    return (
      <div className="text-center p-8 text-destructive">
        Error loading search results
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl overflow-hidden text-card-foreground">
      <div className="w-full bg-card border-b border-border mb-6 sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/results?q=${encodeURIComponent(query)}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-medium">Element Chat Results</h1>
            <span className="text-muted-foreground text-sm">
              {totalResults.toLocaleString()} results
            </span>
          </div>
        </div>
      </div>

      <div className="w-full max-w-4xl px-7">
        <SearchForm initialQuery={query} />

        {/* Display active filters as tags */}
        {query && parseSearchQuery(query).filters.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mt-2">
              {parseSearchQuery(query).filters.map((filter, index) => (
                <div
                  key={index}
                  className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-sm font-medium text-primary"
                >
                  <span className="font-semibold mr-1">{filter.key}:</span>
                  <span>{filter.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mb-8">
          {isLoading && !results.length ? (
            <div className="text-center p-8">Loading results...</div>
          ) : (
            <ResultList results={results} searchQuery={searchQuery} />
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
              Page {pagination.currentPage} of {totalPages || 1}
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

export default MatrixResults;

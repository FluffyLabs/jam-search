import { useLocation, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/SearchForm";
import { ResultList } from "@/components/ResultList";
import { useSearch } from "@/hooks/useSearch";
import { MATRIX_CHANNELS } from "@/consts";
import { parseSearchQuery, SearchMode } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { ShareUrl } from "@/components/ShareUrl";

const MatrixResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const richQuery = searchParams.get("q") || "";
  const channelId = searchParams.get("channelId") || MATRIX_CHANNELS[0].id;
  const searchMode = searchParams.get("searchMode") || "strict";
  // Find the channel name based on the channelId
  const channel =
    MATRIX_CHANNELS.find((ch) => ch.id === channelId) || MATRIX_CHANNELS[0];

  // Parse the query to extract filters
  const { query, filters } = parseSearchQuery(richQuery);

  // Use our search hook with the extracted query and filters
  const {
    results,
    totalResults,
    currentPage,
    totalPages,
    isLoading,
    isError,
    pagination,
  } = useSearch({
    query,
    channelId,
    pageSize: 10,
    filters,
    searchMode,
  });

  if (isError) {
    return (
      <div className="text-center text-2xl p-8 text-destructive-foreground">
        Error loading search results
      </div>
    );
  }

  const backParams = new URLSearchParams(location.search);
  backParams.delete("channelId");

  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl overflow-hidden text-card-foreground">
      <div className="w-full bg-card border-b border-border mb-6 sticky top-0 z-10 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to={`/results?${backParams.toString()}`}>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-lg font-medium">{channel.name} @ Matrix</h1>
            <span className="text-muted-foreground text-sm">
              ({totalResults.toLocaleString()} results)
            </span>
          </div>
          <ShareUrl />
        </div>
      </div>

      <div className="w-full max-w-4xl px-7">
        <SearchForm />

        {/* Display active filters as tags */}
        {query && filters.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.map((filter, index) => (
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
            <ResultList
              results={results}
              searchQuery={query}
              searchMode={searchMode as SearchMode}
            />
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
              Page {currentPage} of {totalPages || 1}
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

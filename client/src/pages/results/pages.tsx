import { useLocation, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { SearchForm } from "@/components/SearchForm";
import { PageResults } from "@/components/PageResults";
import { useSearchPages } from "@/hooks/useSearchPages";
import { parseSearchQuery, SearchMode } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { ShareUrl } from "@/components/ShareUrl";

const PagesResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const richQuery = searchParams.get("q") || "";
  const searchMode = searchParams.get("searchMode") || "strict";
  const site = searchParams.get("site") || undefined;

  // Parse the query to extract filters
  const { query } = parseSearchQuery(richQuery);

  // Use our pages search hook
  const { results, currentPage, totalPages, isLoading, isError, pagination } =
    useSearchPages({
      query,
      pageSize: 10,
      searchMode,
      site,
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
            <span className="text-muted-foreground text-sm">
              {site && (
                <span className="text-lg font-medium">@&nbsp;{site}</span>
              )}
              &nbsp;(
              {results.length.toLocaleString()} results)
            </span>
          </div>
          <ShareUrl />
        </div>
      </div>

      <div className="w-full max-w-4xl px-7">
        <SearchForm showSearchOptions={false} />

        <div className="mb-8">
          {isLoading && !results.length ? (
            <div className="text-center p-8">Loading results...</div>
          ) : (
            <PageResults
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

export default PagesResults;

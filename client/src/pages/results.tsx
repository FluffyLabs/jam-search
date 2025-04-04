import { useEffect } from "react";
import { SearchForm } from "@/components/SearchForm";
import { useSearch } from "@/hooks/useSearch";
import { useLocation } from "react-router";
import { SearchResult } from "@/lib/api";

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
      <div className="text-center p-8 text-red-500">
        Error loading search results
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full bg-card rounded-xl p-4">
      <div className="w-full max-w-4xl mb-8">
        <h2 className="text-2xl font-bold mb-4">
          {totalResults} results for "{searchQuery}"
        </h2>

        {results.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-muted-foreground">
              No results found for your search.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {results.map((result: SearchResult, index) => (
              <div key={index} className="bg-card p-4 rounded-lg border">
                <h3 className="font-medium mb-2">
                  {result.title || "Untitled"}
                </h3>
                <p className="text-sm text-muted-foreground mb-2">
                  {result.content}
                </p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <span>{result.source}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={pagination.previousPage}
              disabled={!pagination.hasPreviousPage}
              className="px-3 py-1 bg-muted rounded disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm">Page {pagination.currentPage + 1}</span>
            <button
              onClick={pagination.nextPage}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 bg-muted rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl mt-8 mb-12">
        <h3 className="text-xl font-medium mb-4 text-center">Search again</h3>
        <SearchForm />
      </div>
    </div>
  );
};

export default SearchResults;

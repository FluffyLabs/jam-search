import { useEffect, useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { useSearch } from "@/hooks/useSearch";
import { useLocation } from "react-router";
import { Button } from "@/components/ui/button";
import { ResultList } from "@/components/ResultList";
import { MultiSelect } from "@/components/ui/multi-select";

interface ResultHeaderProps {
  totalResults: number;
  onSourceChange?: (sources: string[]) => void;
}

const SOURCE_OPTIONS = [
  { label: "Element channels", value: "element" },
  { label: "Graypaper.pdf", value: "graypaper" },
  { label: "JamCha.in/docs", value: "jamchain" },
  { label: "Web3 Foundation", value: "w3f" },
  { label: "GitHub Source Code", value: "github" },
];

const ResultHeader = ({ totalResults, onSourceChange }: ResultHeaderProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>(["element"]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSourceChange = (sources: string[]) => {
    setSelectedSources(sources);
    onSourceChange?.(sources);
  };

  return (
    <div className="w-full bg-card border-b border-border mb-6 sticky top-0 z-10 px-2">
      <div className="flex items-center justify-between py-3 px-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-card/80 border border-border px-2 py-1 rounded-md">
            <MultiSelect
              options={SOURCE_OPTIONS}
              selectedValues={selectedSources}
              onValueChange={handleSourceChange}
              placeholder="Select sources"
              className="min-w-[140px]"
              showSearch
              maxCount={0}
              required
            />
          </div>
          <span className="text-muted-foreground text-sm">
            {totalResults.toLocaleString()} results
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleCopyLink}
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
          {copied ? "copied!" : "copy link"}
        </Button>
      </div>
    </div>
  );
};

const SearchResults = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";
  const [, setSelectedSources] = useState<string[]>([]);

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

  const handleSourceChange = (sources: string[]) => {
    setSelectedSources(sources);
    // TODO: Implement source filtering logic here
  };

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
      <ResultHeader
        totalResults={totalResults}
        onSourceChange={handleSourceChange}
      />

      <div className="w-full max-w-4xl">
        <SearchForm initialQuery={query} />

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

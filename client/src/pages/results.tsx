import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { useSearch } from "@/hooks/useSearch";
import { useLocation, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ResultList } from "@/components/ResultList";
import { MultiSelect } from "@/components/ui/multi-select";
import { GraypaperResults } from "@/components/GraypaperResults";
import { Check, Share, ArrowRight } from "lucide-react";
import { MATRIX_CHANNELS } from "@/consts";
import { parseSearchQuery } from "@/lib/utils";

interface ResultHeaderProps {
  totalResults: number;
  onSourceChange?: (sources: string[]) => void;
}

const SOURCE_OPTIONS = [
  { label: "Matrix channels", value: "element" },
  { label: "Graypaper.pdf", value: "graypaper" },
  { label: "JamCha.in/docs", value: "jamchain", disabled: true },
  { label: "Web3 Foundation", value: "w3f", disabled: true },
  { label: "GitHub Source Code", value: "github", disabled: true },
];

const initialSources = ["element", "graypaper"];

const ResultHeader = ({ onSourceChange }: ResultHeaderProps) => {
  const [copied, setCopied] = useState(false);
  const [selectedSources, setSelectedSources] =
    useState<string[]>(initialSources);

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
        <div className="flex items-center bg-card/80 border border-border rounded-md">
          <MultiSelect
            options={SOURCE_OPTIONS}
            selectedValues={selectedSources}
            onValueChange={handleSourceChange}
            placeholder="Select sources"
            className="min-w-[90px] sm:min-w-[155px]"
            maxCount={0}
            required
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
          onClick={handleCopyLink}
        >
          {copied ? (
            <div className="flex items-center">
              <Check className="w-4 h-4 mr-1.5" />
              copied!
            </div>
          ) : (
            <div className="flex items-center">
              <Share className="w-4 h-4 mr-1.5" />
              share results
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

const SearchResults = () => {
  const location = useLocation();
  const richQuery = new URLSearchParams(location.search).get("q") || "";
  const [selectedSources, setSelectedSources] =
    useState<string[]>(initialSources);

  // Parse the query to extract filters
  const { query, filters } = parseSearchQuery(richQuery);

  // Use our search hook with the extracted query and filters
  const { results, totalResults, isLoading, isError } = useSearch({
    query,
    channelId: MATRIX_CHANNELS[0].id,
    pageSize: 2, // Limit to 2 items
    filters,
  });

  const handleSourceChange = (sources: string[]) => {
    setSelectedSources(sources);
    // TODO: Implement source filtering logic here
  };

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
          {selectedSources.includes("graypaper") && (
            <GraypaperResults query={query} />
          )}

          {selectedSources.includes("element") && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm">Top Element Chat Results</h2>
                {totalResults > 2 && (
                  <Link to={`/results/matrix?q=${encodeURIComponent(query)}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary flex items-center text-xs"
                    >
                      View all {totalResults} results
                      <ArrowRight className="h-3.5 w-3.5 ml-1" />
                    </Button>
                  </Link>
                )}
              </div>
              {isLoading && !results.length ? (
                <div className="text-center p-8">Loading results...</div>
              ) : (
                <ResultList results={results} searchQuery={query} />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

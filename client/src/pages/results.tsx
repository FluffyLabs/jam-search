import { useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { useSearch } from "@/hooks/useSearch";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MatrixResultList } from "@/components/MatrixResultList";
import { MultiSelect } from "@/components/ui/multi-select";
import { GraypaperResults } from "@/components/GraypaperResults";
import { ArrowRight } from "lucide-react";
import { MATRIX_CHANNELS } from "@/consts";
import { parseSearchQuery, SearchMode } from "@/lib/utils";
import { CommercialBanner } from "@/components/CommercialBanner";
import { ShareUrl } from "@/components/ShareUrl";
import { Skeleton } from "@/components/ui/skeleton";

interface ResultHeaderProps {
  onSourceChange?: (sources: string[]) => void;
}

const SOURCE_OPTIONS = [
  { label: "Matrix channels", value: "matrix" },
  { label: "Graypaper.pdf", value: "graypaper" },
  { label: "JamCha.in/docs", value: "jamchain", disabled: true },
  { label: "Web3 Foundation", value: "w3f", disabled: true },
  { label: "GitHub Source Code", value: "github", disabled: true },
];

const initialSources = ["matrix", "graypaper"];

const ResultHeader = ({ onSourceChange }: ResultHeaderProps) => {
  const [selectedSources, setSelectedSources] =
    useState<string[]>(initialSources);

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
        <ShareUrl />
      </div>
    </div>
  );
};

const SearchResults = () => {
  const location = useLocation();
  const richQuery = new URLSearchParams(location.search).get("q") || "";
  const searchModeParam =
    new URLSearchParams(location.search).get("searchMode") || "strict";
  const [selectedSources, setSelectedSources] =
    useState<string[]>(initialSources);

  // Parse the query to extract filters
  const { query, filters } = parseSearchQuery(richQuery);

  // Search for graypaper channel
  const {
    results: graypaperResults,
    totalResults: graypaperTotalResults,
    isLoading: isGraypaperLoading,
    isError: isGraypaperError,
  } = useSearch({
    query,
    channelId: MATRIX_CHANNELS[0].id,
    pageSize: 2, // Limit to 2 items
    filters,
    searchMode: searchModeParam,
  });

  // Search for jam channel
  const {
    results: jamResults,
    totalResults: jamTotalResults,
    isLoading: isJamLoading,
    isError: isJamError,
  } = useSearch({
    query,
    channelId: MATRIX_CHANNELS[1].id,
    pageSize: 2, // Limit to 2 items
    filters,
    searchMode: searchModeParam,
  });

  const handleSourceChange = (sources: string[]) => {
    setSelectedSources(sources);
    // TODO: Implement source filtering logic here
  };

  const isError = isGraypaperError || isJamError;
  if (isError) {
    return (
      <div className="text-center text-2xl p-8 text-destructive-foreground">
        Error loading search results
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl overflow-hidden text-card-foreground">
      <ResultHeader onSourceChange={handleSourceChange} />

      <div className="w-full max-w-4xl px-7">
        <SearchForm
          showSearchOptions={
            selectedSources.length === 1 && selectedSources[0] === "matrix"
          }
        />

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
            <GraypaperResults
              query={query}
              searchMode={searchModeParam as SearchMode}
            />
          )}

          {selectedSources.includes("matrix") && (
            <>
              {/* Graypaper channel results */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm">
                    {MATRIX_CHANNELS[0].name} @ Matrix ({graypaperTotalResults}{" "}
                    results)
                  </h2>

                  {graypaperTotalResults > 2 && (
                    <Link
                      to={(() => {
                        const params = new URLSearchParams(location.search);
                        params.set("channelId", MATRIX_CHANNELS[0].id);
                        return `/results/matrix?${params.toString()}`;
                      })()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary flex items-center text-xs"
                      >
                        View all {graypaperTotalResults} results
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="mb-4">
                  <CommercialBanner
                    title="Matrix archiver"
                    url={{
                      display: "paritytech.github.io/matrix-archiver",
                      href: "https://paritytech.github.io/matrix-archiver",
                    }}
                  />
                </div>
                {isGraypaperLoading && !graypaperResults.length ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 border-b border-border pb-6">
                      <Skeleton className="h-4 w-[160px] my-1" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-[80px] mt-1" />
                    </div>
                    <div className="flex flex-col gap-2 border-b border-border pb-6">
                      <Skeleton className="h-4 w-[160px] my-1" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-[80px] mt-1" />
                    </div>
                  </div>
                ) : (
                  <MatrixResultList
                    results={graypaperResults}
                    searchQuery={query}
                    searchMode={searchModeParam as SearchMode}
                  />
                )}
              </div>

              {/* Jam channel results */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-sm">
                    {MATRIX_CHANNELS[1].name} @ Matrix ({jamTotalResults}{" "}
                    results)
                  </h2>
                  {jamTotalResults > 2 && (
                    <Link
                      to={(() => {
                        const params = new URLSearchParams(location.search);
                        params.set("channelId", MATRIX_CHANNELS[1].id);
                        return `/results/matrix?${params.toString()}`;
                      })()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary flex items-center text-xs"
                      >
                        View all {jamTotalResults} results
                        <ArrowRight className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </Link>
                  )}
                </div>

                <div className="mb-4">
                  <CommercialBanner
                    title="Matrix archiver"
                    url={{
                      display: "paritytech.github.io/matrix-archiver",
                      href: "https://paritytech.github.io/matrix-archiver",
                    }}
                  />
                </div>
                {isJamLoading && !jamResults.length ? (
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2 border-b border-border pb-6">
                      <Skeleton className="h-4 w-[160px] my-1" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-[80px] mt-1" />
                    </div>
                    <div className="flex flex-col gap-2 border-b border-border pb-6">
                      <Skeleton className="h-4 w-[160px] my-1" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-2 w-[80px] mt-1" />
                    </div>
                  </div>
                ) : (
                  <MatrixResultList
                    results={jamResults}
                    searchQuery={query}
                    searchMode={searchModeParam as SearchMode}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

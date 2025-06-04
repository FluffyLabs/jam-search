import { useCallback, useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { useLocation, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MultiSelect } from "@/components/ui/multi-select";
import { GraypaperResults } from "@/components/results/GraypaperResults";
import { ArrowRight } from "lucide-react";
import { MATRIX_CHANNELS } from "@/consts";
import { SearchMode } from "@/lib/utils";
import { Section } from "@/components/results/Section";
import { ShareUrl } from "@/components/ShareUrl";
import { Skeleton } from "@/components/ui/skeleton";
import { PageResults } from "@/components/PageResults";
import JamchainLogo from "@/assets/logos/jamchain.webp";
import GithubLogo from "@/assets/logos/github.png";
import {useResults} from "@/hooks/useResults";
import {initialSources, Source, SOURCE_OPTIONS, stringToSource} from "@/lib/sources";
import {MatrixResults} from "@/components/results/MatrixResults";

interface ResultHeaderProps {
  selectedSources: Source[];
  onSourceChange: (sources: Source[]) => void;
}

const ResultHeader = ({ 
  selectedSources,
  onSourceChange
}: ResultHeaderProps) => {
  const handleSourceChange = useCallback((stringSources: string[]) => {
    const sources = stringSources.map(x => stringToSource(x)!);
    onSourceChange?.(sources);
  }, [onSourceChange]);

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
        <SearchForm
          showSearchOptions={
            selectedSources.length === 1 && selectedSources[0] === Source.Matrix
          }
        />
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
    useState<Source[]>(initialSources);

  const { query, filters, graypaperChat, jamChat, jamchain, w3f, graypaper } = useResults(richQuery, searchModeParam, selectedSources);
  
  const isError =
    graypaperChat.isError ||
    jamChat.isError ||
    jamchain.isError ||
    w3f.isError;
  if (isError) {
    return (
      <div className="text-center text-2xl p-8 text-destructive-foreground">
        Error loading search results
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl overflow-hidden text-card-foreground">
      <ResultHeader 
        selectedSources={selectedSources}
        onSourceChange={setSelectedSources}
      />

      <div className="w-full max-w-4xl px-7">
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
          {selectedSources.includes(Source.Graypaper) && (
            <GraypaperResults
              queryResult={graypaper}
              query={query}
              searchMode={searchModeParam as SearchMode}
            />
          )}

          {selectedSources.includes(Source.Matrix) && (
            <>
              <MatrixResults
                channel={MATRIX_CHANNELS[0]}
                queryResult={graypaperChat}
                query={query}
                searchMode={searchModeParam as SearchMode}
              />
              <MatrixResults
                channel={MATRIX_CHANNELS[1]}
                queryResult={jamChat}
                query={query}
                searchMode={searchModeParam as SearchMode}
              />
            </>
          )}

          {selectedSources.includes(Source.Jamchain) && (
            <div className="mt-6">
              <div className="mb-4">
                <Section
                  logo={
                    <img
                      src={JamchainLogo}
                      className="size-4"
                      alt="JamChain Logo"
                    />
                  }
                  url="https://docs.jamcha.in"
                  title="docs.jamcha.in"
                  endBlock={
                    <Link
                      to={(() => {
                        const params = new URLSearchParams(location.search);
                        params.set("site", "docs.jamcha.in");
                        return `/results/pages?${params.toString()}`;
                      })()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary flex items-center text-xs"
                      >
                        {jamchain.pagination.hasNextPage && (<>
                          View all {jamchain.totalResults} results
                          <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </>)}
                      </Button>
                    </Link>
                  }
                />
              </div>

              {jamchain.isLoading && !jamchain.results.length ? (
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
                <PageResults
                  results={jamchain.results}
                  searchQuery={query}
                  searchMode={searchModeParam as SearchMode}
                />
              )}
            </div>
          )}

          {selectedSources.includes(Source.GithubW3fJamtestvectors) && (
            <div className="mt-6">
              <div className="mb-4">
                <Section
                  logo={
                    <img
                      src={GithubLogo}
                      className="size-4"
                      alt="Github Logo"
                    />
                  }
                  url="https://github.com/w3f/jamtestvectors"
                  title="w3f/jamtestvectors"
                  endBlock={
                    <Link
                      to={(() => {
                        const params = new URLSearchParams(location.search);
                        params.set("site", "github.com/w3f/jamtestvectors");
                        return `/results/pages?${params.toString()}`;
                      })()}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary flex items-center text-xs"
                      >
                        {w3f.pagination.hasNextPage && (<>
                          View all {w3f.totalResults} results
                          <ArrowRight className="h-3.5 w-3.5 ml-1" />
                        </>)}
                      </Button>
                    </Link>
                  }
                />
              </div>

              {w3f.isLoading && !w3f.results.length ? (
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
                <PageResults
                  results={w3f.results}
                  searchQuery={query}
                  searchMode={searchModeParam as SearchMode}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

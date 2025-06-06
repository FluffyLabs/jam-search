import { useCallback, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { MultiSelect } from "@/components/ui/multi-select";
import { GraypaperResults } from "@/components/results/GraypaperResults";
import { MATRIX_CHANNELS } from "@/consts";
import { SearchMode } from "@/lib/utils";
import { Section } from "@/components/results/Section";
import JamchainLogo from "@/assets/logos/jamchain.webp";
import GithubLogo from "@/assets/logos/github.png";
import {useResults} from "@/hooks/useResults";
import {initialSources, Source, SOURCE_OPTIONS, stringToSource} from "@/lib/sources";
import {MatrixResults} from "@/components/results/MatrixResults";
import {PageResultCards} from "@/components/results/PageResultCards";
import {ResultHeader} from "@/components/results/ResultHeader";
import {ShowAll} from "@/components/ShowAll";

const SearchResults = () => {
  const location = useLocation();
  const richQuery = new URLSearchParams(location.search).get("q") || "";
  const searchModeParam =
    new URLSearchParams(location.search).get("searchMode") || "strict";
  const [selectedSources, setSelectedSources] =
    useState<Source[]>(initialSources);

  const handleSourceChange = useCallback((stringSources: string[]) => {
    const sources = stringSources.map(x => stringToSource(x)!);
    setSelectedSources(sources);
  }, []);

  const { query, filters, graypaperChat, jamChat, jamchain, w3f, graypaper } = useResults(richQuery, searchModeParam, selectedSources);
  
  return (
    <div className="flex flex-col items-center min-h-full w-full bg-card rounded-xl overflow-hidden text-card-foreground">
      <ResultHeader 
        left={
          <div className="flex items-center bg-card/80 border border-border rounded-md">
            <MultiSelect
              options={SOURCE_OPTIONS}
              selectedValues={selectedSources}
              onValueChange={handleSourceChange}
              placeholder="Select sources"
              maxCount={0}
              required
            />
          </div>
        }
        showSearchOptions={selectedSources.length === 1 && selectedSources[0] === Source.Matrix}
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
                  logo={<img
                    src={JamchainLogo}
                    className="size-4"
                    alt="JamChain Logo"
                  />}
                  url="https://docs.jamcha.in"
                  title="docs.jamcha.in"
                  endBlock={
                    <Link
                      to={ (() => {
                        const params = new URLSearchParams(location.search);
                        params.set("site", "docs.jamcha.in");
                        return `/results/pages?${params.toString()}`;
                      })()}
                    >
                      <ShowAll
                        hasNextPage={jamchain.pagination.hasNextPage} 
                        totalResults={jamchain.totalResults}
                      />
                    </Link>
                  }
                />
              </div>
              <PageResultCards
                queryResult={jamchain}
                searchQuery={query}
                searchMode={searchModeParam as SearchMode}
              />
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
                      <ShowAll
                        hasNextPage={w3f.pagination.hasNextPage} 
                        totalResults={w3f.totalResults}
                      />
                    </Link>
                  }
                />
              </div>
              <PageResultCards
                queryResult={w3f}
                searchQuery={query}
                searchMode={searchModeParam as SearchMode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;

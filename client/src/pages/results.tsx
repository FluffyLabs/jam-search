import GithubLogo from "@/assets/logos/github.png";
import JamWeb3FoundationLogo from "@/assets/logos/jam-web3-foundation.png";
import JamchainLogo from "@/assets/logos/jamchain.webp";
import { Container } from "@/components/Container";
import { ShowAll } from "@/components/ShowAll";
import { DiscordResults } from "@/components/results/DiscordResults";
import { GraypaperResults } from "@/components/results/GraypaperResults";
import { MatrixResults } from "@/components/results/MatrixResults";
import { PageResultCards } from "@/components/results/PageResultCards";
import { ResultHeader } from "@/components/results/ResultHeader";
import { Section } from "@/components/results/Section";
import { MultiSelect } from "@/components/ui/multi-select";
import { useResults } from "@/hooks/useResults";
import {
  SOURCE_OPTIONS,
  Source,
  getStoredSources,
  setStoredSources,
  stringToSource,
} from "@/lib/sources";
import type { SearchMode } from "@/lib/utils";
import * as discord from "@shared/discord";
import * as matrix from "@shared/matrix";
import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const richQuery = new URLSearchParams(location.search).get("q") || "";
  const searchModeParam =
    new URLSearchParams(location.search).get("searchMode") || "strict";
  const [selectedSources, setSelectedSources] =
    useState<Source[]>(getStoredSources);

  const handleSourceChange = useCallback((stringSources: string[]) => {
    const sources = stringSources
      .map((x) => stringToSource(x))
      .filter((x) => x !== undefined);
    setSelectedSources(sources);
    // Save the updated sources to localStorage
    setStoredSources(sources);
  }, []);

  const {
    query,
    filters,
    graypaperChat,
    jamChat,
    jamConformanceChat,
    jamchain,
    w3fJamtestvectors,
    w3fMilestoneDelivery,
    graypaper,
    implementersDiscord,
    jamWeb3Foundation,
  } = useResults(richQuery, searchModeParam, selectedSources);

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
        showSearchOptions={
          selectedSources.length === 1 && selectedSources[0] === Source.Matrix
        }
      />

      <Container>
        {/* Display active filters as tags */}
        {query && filters.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.map((filter) => (
                <div
                  key={`${filter.key}-${filter.value}`}
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
                channel={matrix.ROOMS[0]}
                queryResult={graypaperChat}
                query={query}
                searchMode={searchModeParam as SearchMode}
              />
              <MatrixResults
                channel={matrix.ROOMS[1]}
                queryResult={jamChat}
                query={query}
                searchMode={searchModeParam as SearchMode}
              />
              <MatrixResults
                channel={matrix.ROOMS[2]}
                queryResult={jamConformanceChat}
                query={query}
                searchMode={searchModeParam as SearchMode}
              />
            </>
          )}

          {selectedSources.includes(Source.JamDaoDiscord) && (
            <DiscordResults
              channel={discord.CHANNELS[0]}
              queryResult={implementersDiscord}
              query={query}
              searchMode={searchModeParam as SearchMode}
            />
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
                        hasNextPage={w3fJamtestvectors.pagination.hasNextPage}
                        totalResults={w3fJamtestvectors.totalResults}
                      />
                    </Link>
                  }
                />
              </div>
              <PageResultCards
                queryResult={w3fJamtestvectors}
                searchQuery={query}
                searchMode={searchModeParam as SearchMode}
              />
            </div>
          )}

          {selectedSources.includes(Source.GithubW3fJamMilestoneDelivery) && (
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
                  url="https://github.com/w3f/jam-milestone-delivery"
                  title="w3f/jam-milestone-delivery"
                  endBlock={
                    <Link
                      to={(() => {
                        const params = new URLSearchParams(location.search);
                        params.set(
                          "site",
                          "github.com/w3f/jam-milestone-delivery"
                        );
                        return `/results/pages?${params.toString()}`;
                      })()}
                    >
                      <ShowAll
                        hasNextPage={
                          w3fMilestoneDelivery.pagination.hasNextPage
                        }
                        totalResults={w3fMilestoneDelivery.totalResults}
                      />
                    </Link>
                  }
                />
              </div>
              <PageResultCards
                queryResult={w3fMilestoneDelivery}
                searchQuery={query}
                searchMode={searchModeParam as SearchMode}
              />
            </div>
          )}

          {selectedSources.includes(Source.JamWeb3Foundation) && (
            <div className="mt-6">
              <div className="mb-4">
                <Section
                  logo={
                    <img
                      src={JamWeb3FoundationLogo}
                      className="size-4"
                      alt="Jam Web3 Foundation Logo"
                    />
                  }
                  url="https://jam.web3.foundation"
                  title="jam.web3.foundation"
                  endBlock={
                    <Link
                      to={(() => {
                        const params = new URLSearchParams(location.search);
                        params.set("site", "jam.web3.foundation");
                        return `/results/pages?${params.toString()}`;
                      })()}
                    >
                      <ShowAll
                        hasNextPage={jamWeb3Foundation.pagination.hasNextPage}
                        totalResults={jamWeb3Foundation.totalResults}
                      />
                    </Link>
                  }
                />
              </div>
              <PageResultCards
                queryResult={jamWeb3Foundation}
                searchQuery={query}
                searchMode={searchModeParam as SearchMode}
              />
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default SearchResults;

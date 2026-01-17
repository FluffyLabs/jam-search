import { Source, stringToSource } from "@shared/sources";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GithubLogo from "@/assets/logos/github.png";
import JamWeb3FoundationLogo from "@/assets/logos/jam-web3-foundation.png";
import JamchainLogo from "@/assets/logos/jamchain.webp";
import { Container } from "@/components/Container";
import { DiscordResults } from "@/components/results/DiscordResults";
import { GraypaperResults } from "@/components/results/GraypaperResults";
import { MatrixResults } from "@/components/results/MatrixResults";
import { PageResultCards } from "@/components/results/PageResultCards";
import { ResultHeader } from "@/components/results/ResultHeader";
import { Section } from "@/components/results/Section";
import { ShowAll } from "@/components/ShowAll";
import { MultiSelect } from "@/components/ui/multi-select";
import { useResults } from "@/hooks/useResults";
import { SearchMode } from "@/lib/mode";
import {
  getStoredSources,
  SOURCE_OPTIONS,
  setStoredSources,
} from "@/lib/sources";

const pageLogos: Record<string, string> = {
  "docs.jamcha.in": JamchainLogo,
  "jam.web3.foundation": JamWeb3FoundationLogo,
};
function getLogo(logo: string) {
  return pageLogos[logo] ?? GithubLogo;
}

const SearchResults = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const richQuery = searchParams.get("q") || "";
  const searchMode = searchParams.get("searchMode") || SearchMode.Regular;

  const [selectedSources, setSelectedSources] =
    useState<Source[]>(getStoredSources);

  const handleSourceChange = (stringSources: string[]) => {
    const sources = stringSources
      .map((x) => stringToSource(x))
      .filter((x) => x !== undefined);
    setSelectedSources(sources);
    // Save the updated sources to localStorage
    setStoredSources(sources);
  };

  const {
    query,
    filters,
    pagesResults,
    discordResults,
    matrixResults,
    graypaperResults,
    githubResults,
  } = useResults(richQuery, selectedSources, searchMode !== SearchMode.Regular);

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
        {filters.length > 0 && (
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
            <GraypaperResults queryResult={graypaperResults} query={query} />
          )}

          {matrixResults.map((data) => {
            if (!selectedSources.includes(data.room.source)) {
              return null;
            }

            return (
              <MatrixResults
                key={data.room.id}
                channel={data.room}
                queryResult={data.results}
                query={query}
              />
            );
          })}

          {discordResults.map((data) => {
            if (!selectedSources.includes(data.channel.source)) {
              return null;
            }

            return (
              <DiscordResults
                key={data.channel.channelId}
                channel={data.channel}
                queryResult={data.results}
                query={query}
              />
            );
          })}

          {pagesResults.map((data) => {
            if (!selectedSources.includes(data.page.source)) {
              return null;
            }

            return (
              <div className="mt-6" key={data.page.dbId}>
                <div className="mb-4">
                  <Section
                    logo={
                      <img
                        src={getLogo(data.page.dbId)}
                        className="size-4"
                        alt={`${data.page.dbId} logo`}
                      />
                    }
                    url={data.page.link}
                    title={data.page.dbId}
                    endBlock={
                      <Link
                        to={(() => {
                          const params = new URLSearchParams(location.search);
                          params.set("site", data.page.dbId);
                          return `/results/pages?${params.toString()}`;
                        })()}
                      >
                        <ShowAll
                          hasNextPage={data.results.pagination.hasNextPage}
                          totalResults={data.results.totalResults}
                        />
                      </Link>
                    }
                  />
                </div>
                <PageResultCards
                  queryResult={data.results}
                  searchQuery={query}
                />
              </div>
            );
          })}

          {githubResults.map((data) => {
            if (!selectedSources.includes(data.repo.source)) {
              return null;
            }

            return (
              <div className="mt-6" key={data.repo.dbId}>
                <div className="mb-4">
                  <Section
                    logo={
                      <img
                        src={GithubLogo}
                        className="size-4"
                        alt="Github Logo"
                      />
                    }
                    url={`https://github.com/${data.repo.owner}/${data.repo.repo}`}
                    title={`${data.repo.owner}/${data.repo.repo}`}
                    endBlock={
                      <Link
                        to={(() => {
                          const params = new URLSearchParams(location.search);
                          params.set(
                            "site",
                            `github.com/${data.repo.owner}/${data.repo.repo}`
                          );
                          return `/results/pages?${params.toString()}`;
                        })()}
                      >
                        <ShowAll
                          hasNextPage={data.results.pagination.hasNextPage}
                          totalResults={data.results.totalResults}
                        />
                      </Link>
                    }
                  />
                </div>
                <PageResultCards
                  queryResult={data.results}
                  searchQuery={query}
                />
              </div>
            );
          })}
        </div>
      </Container>
    </div>
  );
};

export default SearchResults;

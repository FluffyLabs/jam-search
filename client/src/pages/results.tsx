import { Source, stringToSource } from "@shared/sources";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import GithubLogo from "@/assets/logos/github.png";
import JamWeb3FoundationLogo from "@/assets/logos/jam-web3-foundation.png";
import JamchainLogo from "@/assets/logos/jamchain.webp";
import { AskAboutResults } from "@/components/AskAboutResults";
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
  } = useResults(richQuery, searchMode !== SearchMode.Regular);

  // Track which sources have results, are loading, or are empty
  const sourceStatuses = new Map<
    Source,
    { hasResults: boolean; isLoading: boolean; totalResults: number }
  >();
  for (const opt of SOURCE_OPTIONS) {
    sourceStatuses.set(opt.value, {
      hasResults: false,
      isLoading: false,
      totalResults: 0,
    });
  }
  const graypaperStatus = sourceStatuses.get(Source.Graypaper);
  if (graypaperStatus) {
    if (graypaperResults.isLoading) graypaperStatus.isLoading = true;
    if (graypaperResults.results.length > 0) graypaperStatus.hasResults = true;
    graypaperStatus.totalResults += graypaperResults.totalResults;
  }
  for (const data of matrixResults) {
    const status = sourceStatuses.get(data.room.source);
    if (status) {
      if (data.results.isLoading) status.isLoading = true;
      if (data.results.results.length > 0) status.hasResults = true;
      status.totalResults += data.results.totalResults;
    }
  }
  for (const data of discordResults) {
    const status = sourceStatuses.get(data.channel.source);
    if (status) {
      if (data.results.isLoading) status.isLoading = true;
      if (data.results.results.length > 0) status.hasResults = true;
      status.totalResults += data.results.totalResults;
    }
  }
  for (const data of pagesResults) {
    const status = sourceStatuses.get(data.page.source);
    if (status) {
      if (data.results.isLoading) status.isLoading = true;
      if (data.results.results.length > 0) status.hasResults = true;
      status.totalResults += data.results.totalResults;
    }
  }
  for (const data of githubResults) {
    const status = sourceStatuses.get(data.repo.source);
    if (status) {
      if (data.results.isLoading) status.isLoading = true;
      if (data.results.results.length > 0) status.hasResults = true;
      status.totalResults += data.results.totalResults;
    }
  }

  const checkedEmptySources = SOURCE_OPTIONS.filter((opt) => {
    const status = sourceStatuses.get(opt.value);
    return (
      selectedSources.includes(opt.value) &&
      status &&
      !status.hasResults &&
      !status.isLoading
    );
  });
  const disabledSources = SOURCE_OPTIONS.filter(
    (opt) => !selectedSources.includes(opt.value)
  );

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
          {selectedSources.includes(Source.Graypaper) &&
            (graypaperResults.results.length > 0 ||
              graypaperResults.isLoading) && (
              <GraypaperResults queryResult={graypaperResults} query={query} />
            )}

          {matrixResults.map((data) => {
            if (!selectedSources.includes(data.room.source)) {
              return null;
            }
            if (data.results.results.length === 0 && !data.results.isLoading) {
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
            if (data.results.results.length === 0 && !data.results.isLoading) {
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
            if (data.results.results.length === 0 && !data.results.isLoading) {
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
            if (data.results.results.length === 0 && !data.results.isLoading) {
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

          {checkedEmptySources.length > 0 &&
            checkedEmptySources.length === selectedSources.length && (
              <div className="text-center p-8">
                <p className="font-light text-muted-foreground">
                  No results found for your search.
                </p>
              </div>
            )}

          {(checkedEmptySources.length > 0 || disabledSources.length > 0) && (
            <div className="mt-6 py-4 border-t border-border text-sm text-muted-foreground">
              {checkedEmptySources.length > 0 && (
                <p>
                  No results from:{" "}
                  {checkedEmptySources.map((s) => s.label).join(", ")}
                </p>
              )}
              {disabledSources.length > 0 && (
                <p className={checkedEmptySources.length > 0 ? "mt-2" : ""}>
                  Not included:{" "}
                  {disabledSources
                    .map((s) => {
                      const status = sourceStatuses.get(s.value);
                      if (!status) return s.label;
                      if (status.isLoading) return `${s.label} (\u2026)`;
                      return `${s.label} (${status.totalResults})`;
                    })
                    .join(", ")}
                  .{" "}
                  <button
                    type="button"
                    className="text-primary hover:underline cursor-pointer"
                    onClick={() =>
                      handleSourceChange(SOURCE_OPTIONS.map((o) => o.value))
                    }
                  >
                    Search everywhere
                  </button>
                </p>
              )}
            </div>
          )}

          {richQuery && <AskAboutResults searchQuery={richQuery} />}
        </div>
      </Container>
    </div>
  );
};

export default SearchResults;

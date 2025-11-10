import { discord, github, matrix, pages } from "@shared/index";

import { useSearchDiscord } from "@/hooks/useSearchDiscord";
import { useSearchMatrix } from "@/hooks/useSearchMatrix";
import { useSearchPages } from "@/hooks/useSearchPages";
import { parseSearchQuery } from "@/lib/utils";
import { Source } from "@shared/sources";
import { useSearchGraypaper } from "./useSearchGraypaper";

export function useResults(
  richQuery: string,
  searchMode: string,
  selectedSources: string[]
) {
  // Parse the query to extract filters
  const { query, filters } = parseSearchQuery(richQuery);

  const matrixResults = matrix.ROOMS.map((room) => {
    return {
      room,
      results: useSearchMatrix({
        query,
        channelId: room.id,
        pageSize: 6,
        filters,
        searchMode: searchMode,
        enabled: selectedSources.includes(room.source),
      }),
    };
  });

  const discordResults = discord.CHANNELS.map((channel) => {
    return {
      channel,
      results: useSearchDiscord({
        query,
        pageSize: 6,
        filters,
        channelId: channel.channelId,
        searchMode: searchMode,
        enabled: selectedSources.includes(channel.source),
      }),
    };
  });

  const pagesResults = pages.PAGES.map((page) => {
    return {
      page,
      results: useSearchPages({
        query,
        pageSize: 4,
        searchMode: searchMode,
        site: page.dbId,
        enabled: selectedSources.includes(page.source),
      }),
    };
  });

  const githubResults = github.REPOSITORIES.map((repo) => {
    return {
      repo,
      results: useSearchPages({
        query,
        pageSize: 4,
        searchMode: searchMode,
        site: repo.dbId,
        enabled: selectedSources.includes(repo.source),
      }),
    };
  });

  // Use our graypaper search hook with 6 results per page (for compact view)
  const graypaperResults = useSearchGraypaper({
    query,
    pageSize: 6,
    searchMode,
    enabled: selectedSources.includes(Source.Graypaper),
  });

  return {
    query,
    filters,
    graypaperResults,
    githubResults,
    pagesResults,
    discordResults,
    matrixResults,
  };
}

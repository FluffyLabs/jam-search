import { discord, github, matrix, pages } from "@shared/index";

import { useSearchDiscord } from "@/hooks/useSearchDiscord";
import { useSearchMatrix } from "@/hooks/useSearchMatrix";
import { useSearchPages } from "@/hooks/useSearchPages";
import { parseSearchQuery } from "@/lib/utils";
import { Source } from "@shared/sources";
import { useEmbedding } from "./useEmbedding";
import { useSearchGraypaper } from "./useSearchGraypaper";

export function useResults(
  richQuery: string,
  selectedSources: string[],
  isExtendedSearch: boolean
) {
  // Parse the query to extract filters
  const { query, filters } = parseSearchQuery(richQuery);
  const embedding = useEmbedding(query, isExtendedSearch).data;

  const matrixResults = matrix.ROOMS.map((room) => {
    return {
      room,

      // eslint-disable-next-line react-hooks/rules-of-hooks
      results: useSearchMatrix({
        query,
        embedding,
        channelId: room.id,
        pageSize: 6,
        filters,
        enabled: selectedSources.includes(room.source),
      }),
    };
  });

  const discordResults = discord.CHANNELS.map((channel) => {
    return {
      channel,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      results: useSearchDiscord({
        query,
        embedding,
        pageSize: 6,
        filters,
        channelId: channel.channelId,
        enabled: selectedSources.includes(channel.source),
      }),
    };
  });

  const pagesResults = pages.PAGES.map((page) => {
    return {
      page,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      results: useSearchPages({
        query,
        embedding,
        pageSize: 4,
        site: page.dbId,
        enabled: selectedSources.includes(page.source),
      }),
    };
  });

  const githubResults = github.REPOSITORIES.map((repo) => {
    return {
      repo,
      // eslint-disable-next-line react-hooks/rules-of-hooks
      results: useSearchPages({
        query,
        embedding,
        pageSize: 4,
        site: repo.dbId,
        enabled: selectedSources.includes(repo.source),
      }),
    };
  });

  // Use our graypaper search hook with 6 results per page (for compact view)
  const graypaperResults = useSearchGraypaper({
    query,
    embedding,
    pageSize: 6,
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

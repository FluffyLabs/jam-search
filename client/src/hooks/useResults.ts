import { MATRIX_CHANNELS } from "@/consts";

import { useSearchMatrix } from "@/hooks/useSearchMatrix";
import { useSearchPages } from "@/hooks/useSearchPages";
import { parseSearchQuery } from "@/lib/utils";
import {useSearchGraypaper} from "./useSearchGraypaper";
import {Source} from "@/lib/sources";

export function useResults(
  richQuery: string,
  searchMode: string,
  selectedSources: string[],
) {
  // Parse the query to extract filters
  const { query, filters } = parseSearchQuery(richQuery);

  // Search for graypaper channel
  const graypaperChat = useSearchMatrix({
    query,
    channelId: MATRIX_CHANNELS[0].id,
    pageSize: 6,
    filters,
    searchMode: searchMode,
    enabled: selectedSources.includes(Source.Matrix),
  });

  // Search for jam channel
  const jamChat = useSearchMatrix({
    query,
    channelId: MATRIX_CHANNELS[1].id,
    pageSize: 6,
    filters,
    searchMode: searchMode,
    enabled: selectedSources.includes(Source.Matrix),
  });

  // Search for JamCha.in docs
  const jamchain = useSearchPages({
    query,
    pageSize: 4,
    searchMode: searchMode,
    site: "docs.jamcha.in",
    enabled: selectedSources.includes(Source.Jamchain),
  });

  // Search for  github.com/w3f/jamtestvectors pages
  const w3f = useSearchPages({
    query,
    pageSize: 4,
    searchMode: searchMode,
    site: "github.com/w3f/jamtestvectors",
    enabled: selectedSources.includes(Source.GithubW3fJamtestvectors),
  });

  // Use our graypaper search hook with 6 results per page (for compact view)
  const graypaper = useSearchGraypaper({
    query,
    pageSize: 6,
    searchMode,
    enabled: selectedSources.includes(Source.Graypaper),
  });

  return {
    query,
    filters,
    graypaper,
    graypaperChat,
    jamChat,
    jamchain,
    w3f,
  };
}

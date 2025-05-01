/**
 * Query keys for React Query
 * These keys are used to identify cached data in the global state
 */

export const QUERY_KEYS = {
  SEARCH_RESULTS: "searchResults",
  SEARCH_PARAMS: "searchParams",
};

export function getSearchResultsKey(
  query: string,
  page: number,
  pageSize: number,
  channelId?: string
) {
  return [QUERY_KEYS.SEARCH_RESULTS, query, page, pageSize, channelId].filter(
    Boolean
  );
}

export function getSearchParamsKey(channelId?: string) {
  return [QUERY_KEYS.SEARCH_PARAMS, channelId].filter(Boolean);
}

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
  pageSize: number
) {
  return [QUERY_KEYS.SEARCH_RESULTS, query, page, pageSize];
}

export function getSearchParamsKey() {
  return [QUERY_KEYS.SEARCH_PARAMS];
}

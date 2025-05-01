import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSearchResults, SearchResponse } from "@/lib/api";
import { getSearchResultsKey, getSearchParamsKey } from "@/lib/queryKeys";
import { MATRIX_CHANNELS } from "@/consts";
interface UseSearchOptions {
  initialQuery?: string;
  pageSize?: number;
  channelId?: (typeof MATRIX_CHANNELS)[number]["id"];
}

interface SearchFilter {
  key: string;
  value: string;
}

interface SearchParams {
  query: string;
  currentPage: number;
  pageSize: number;
  filters?: SearchFilter[];
  channelId?: string;
}

export function useSearch({
  initialQuery = "",
  channelId,
  pageSize = 10,
}: UseSearchOptions = {}) {
  // Get query client instance
  const queryClient = useQueryClient();
  // Get search params from global state or use defaults
  const searchParamsKey = getSearchParamsKey(channelId);
  const defaultParams: SearchParams = {
    query: initialQuery,
    currentPage: 1,
    pageSize,
    filters: [],
    channelId,
  };

  const searchParams =
    queryClient.getQueryData<SearchParams>(searchParamsKey) || defaultParams;

  const { query: searchQuery, currentPage } = searchParams;

  // Use React Query to store and access the global search state
  const searchResultsKey = getSearchResultsKey(
    searchQuery,
    currentPage,
    pageSize,
    channelId
  );

  // Mutation for fetching search results
  const searchMutation = useMutation({
    mutationFn: (params: SearchParams) =>
      fetchSearchResults(params.query, {
        page: params.currentPage,
        pageSize: params.pageSize,
        filters: params.filters,
        channelId,
      }),
    onSuccess: (data) => {
      // Store results in global cache
      queryClient.setQueryData(searchResultsKey, data);
    },
    onError: (error) => {
      console.error("Error fetching search results", error);
    },
  });

  // Get data from cache or return empty defaults
  const cachedData = queryClient.getQueryData<SearchResponse>(searchResultsKey);
  const results = cachedData?.results || [];
  const totalResults = cachedData?.total || 0;

  const search = (query: string, options?: { filters?: SearchFilter[] }) => {
    const newParams = {
      ...searchParams,
      query,
      currentPage: 1,
      filters: options?.filters || [],
      channelId,
    };

    // Update search params in global state
    queryClient.setQueryData<SearchParams>(searchParamsKey, newParams);

    if (query.trim()) {
      searchMutation.mutate(newParams);
    }
  };

  const nextPage = () => {
    if (results.length === pageSize) {
      const newParams = {
        ...searchParams,
        currentPage: currentPage + 1,
      };

      // Update page in global state
      queryClient.setQueryData<SearchParams>(searchParamsKey, newParams);

      searchMutation.mutate(newParams);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      const newParams = {
        ...searchParams,
        currentPage: currentPage - 1,
      };

      // Update page in global state
      queryClient.setQueryData<SearchParams>(searchParamsKey, newParams);

      searchMutation.mutate(newParams);
    }
  };

  const goToPage = (page: number) => {
    const newPage = Math.max(1, page);

    const newParams = {
      ...searchParams,
      currentPage: newPage,
    };

    // Update page in global state
    queryClient.setQueryData<SearchParams>(searchParamsKey, newParams);

    searchMutation.mutate(newParams);
  };

  return {
    search,
    searchQuery,
    results,
    totalResults,
    isLoading: searchMutation.isPending,
    isError: searchMutation.isError,
    error: searchMutation.error,
    refetch: () => searchMutation.mutate(searchParams),
    pagination: {
      currentPage,
      pageSize,
      nextPage,
      previousPage,
      goToPage,
      hasNextPage: results.length === pageSize,
      hasPreviousPage: currentPage > 1,
    },
  };
}

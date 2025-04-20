import { useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchSearchResults, SearchResponse } from "@/lib/api";
import { getSearchResultsKey, getSearchParamsKey } from "@/lib/queryKeys";

interface UseSearchOptions {
  initialQuery?: string;
  pageSize?: number;
}

interface SearchParams {
  query: string;
  currentPage: number;
  pageSize: number;
}

export function useSearch({
  initialQuery = "",
  pageSize = 10,
}: UseSearchOptions = {}) {
  // Get query client instance
  const queryClient = useQueryClient();

  // Get search params from global state or use defaults
  const searchParamsKey = getSearchParamsKey();
  const defaultParams: SearchParams = {
    query: initialQuery,
    currentPage: 1,
    pageSize,
  };

  const searchParams =
    queryClient.getQueryData<SearchParams>(searchParamsKey) || defaultParams;

  const { query: searchQuery, currentPage } = searchParams;

  // Use React Query to store and access the global search state
  const searchResultsKey = getSearchResultsKey(
    searchQuery,
    currentPage,
    pageSize
  );

  // Mutation for fetching search results
  const searchMutation = useMutation({
    mutationFn: (params: SearchParams) =>
      fetchSearchResults(params.query, {
        page: params.currentPage,
        pageSize: params.pageSize,
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

  const search = (query: string) => {
    const newParams = {
      ...searchParams,
      query,
      currentPage: 1,
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

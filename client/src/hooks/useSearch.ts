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
    currentPage: 0,
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
    mutationFn: () => fetchSearchResults(searchQuery),
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
    // Update search params in global state
    queryClient.setQueryData<SearchParams>(searchParamsKey, {
      ...searchParams,
      query,
      currentPage: 0,
    });

    if (query.trim()) {
      searchMutation.mutate();
    }
  };

  const nextPage = () => {
    if (results.length === pageSize) {
      // Update page in global state
      queryClient.setQueryData<SearchParams>(searchParamsKey, {
        ...searchParams,
        currentPage: currentPage + 1,
      });

      searchMutation.mutate();
    }
  };

  const previousPage = () => {
    if (currentPage > 0) {
      // Update page in global state
      queryClient.setQueryData<SearchParams>(searchParamsKey, {
        ...searchParams,
        currentPage: currentPage - 1,
      });

      searchMutation.mutate();
    }
  };

  const goToPage = (page: number) => {
    const newPage = Math.max(0, page);

    // Update page in global state
    queryClient.setQueryData<SearchParams>(searchParamsKey, {
      ...searchParams,
      currentPage: newPage,
    });

    searchMutation.mutate();
  };

  return {
    search,
    searchQuery,
    results,
    totalResults,
    isLoading: searchMutation.isPending,
    isError: searchMutation.isError,
    error: searchMutation.error,
    refetch: () => searchMutation.mutate(),
    pagination: {
      currentPage,
      pageSize,
      nextPage,
      previousPage,
      goToPage,
      hasNextPage: results.length === pageSize,
      hasPreviousPage: currentPage > 0,
    },
  };
}

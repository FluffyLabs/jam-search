import { useQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "@/lib/api";
import { MATRIX_CHANNELS } from "@/consts";
import { useState } from "react";

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
  // State for search parameters
  const [searchParams, setSearchParams] = useState<SearchParams>({
    query: initialQuery,
    currentPage: 1,
    pageSize,
    filters: [],
    channelId,
  });

  // Destructure for convenience
  const { query: searchQuery, currentPage, filters } = searchParams;

  // Use React Query to fetch search results
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "search",
      searchQuery,
      currentPage,
      pageSize,
      channelId,
      filters,
    ],
    queryFn: () =>
      fetchSearchResults(searchQuery, {
        page: currentPage,
        pageSize,
        filters,
        channelId,
      }),
    enabled: !!searchQuery.trim(), // Only fetch if we have a non-empty query
  });

  // Extract results
  const results = data?.results || [];
  const totalResults = data?.total || 0;

  // Function to set a new search query
  const search = (query: string, options?: { filters?: SearchFilter[] }) => {
    setSearchParams({
      ...searchParams,
      query,
      currentPage: 1, // Reset to first page on new search
      filters: options?.filters || [],
    });
  };

  // Pagination functions
  const nextPage = () => {
    if (results.length === pageSize) {
      setSearchParams({
        ...searchParams,
        currentPage: currentPage + 1,
      });
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setSearchParams({
        ...searchParams,
        currentPage: currentPage - 1,
      });
    }
  };

  const goToPage = (page: number) => {
    const newPage = Math.max(1, page);
    setSearchParams({
      ...searchParams,
      currentPage: newPage,
    });
  };

  return {
    search,
    searchQuery,
    results,
    totalResults,
    isLoading,
    isError,
    error,
    refetch,
    pagination: {
      currentPage,
      pageSize,
      nextPage,
      previousPage,
      goToPage,
      hasNextPage: results.length === pageSize,
      hasPreviousPage: currentPage > 1,
    },
    channelId,
  };
}

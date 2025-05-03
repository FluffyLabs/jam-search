import { useQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "@/lib/api";
import { MATRIX_CHANNELS } from "@/consts";
import { useState } from "react";

interface UseSearchOptions {
  query: string;
  initialPage?: number;
  pageSize?: number;
  channelId?: (typeof MATRIX_CHANNELS)[number]["id"];
  filters?: SearchFilter[];
  fuzzySearch?: boolean;
}

interface SearchFilter {
  key: string;
  value: string;
}

export function useSearch({
  query,
  initialPage = 1,
  pageSize = 10,
  channelId,
  filters = [],
  fuzzySearch,
}: UseSearchOptions) {
  // Only manage pagination state
  const [page, setPage] = useState(initialPage);

  // Use React Query to fetch search results
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [
      "search",
      query,
      page,
      pageSize,
      channelId,
      filters,
      fuzzySearch,
    ],
    queryFn: () =>
      fetchSearchResults(query, {
        page,
        pageSize,
        filters,
        channelId,
        fuzzySearch,
      }),
    enabled: !!query.trim(), // Only fetch if we have a non-empty query
  });

  // Extract results
  const results = data?.results || [];
  const totalResults = data?.total || 0;

  // Calculate total pages
  const totalPages = data ? Math.ceil(totalResults / pageSize) : 0;

  // Pagination functions
  const nextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const previousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const goToPage = (newPage: number) => {
    setPage(Math.max(1, Math.min(newPage, totalPages || 1)));
  };

  return {
    results,
    totalResults,
    currentPage: page,
    totalPages,
    pageSize,
    isLoading,
    isError,
    error,
    refetch,
    pagination: {
      nextPage,
      previousPage,
      goToPage,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
    channelId,
  };
}

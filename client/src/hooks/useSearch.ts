import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchAzureSearchResults } from "@/lib/api";

interface UseSearchOptions {
  enabled?: boolean;
  initialQuery?: string;
  pageSize?: number;
  useAzureSearch?: boolean;
}

export function useSearch({
  enabled = false,
  initialQuery = "",
  pageSize = 10,
  useAzureSearch = true,
}: UseSearchOptions = {}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(0);

  const queryResult = useQuery({
    queryKey: ["azureSearch", searchQuery, currentPage, pageSize],
    queryFn: () =>
      fetchAzureSearchResults(searchQuery, {
        top: pageSize,
        skip: currentPage * pageSize,
        orderBy: "timestamp desc",
      }),
    enabled: enabled && !!searchQuery.trim() && useAzureSearch,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  const { data, isLoading, isError, error, refetch } = queryResult;

  const search = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0); // Reset to first page on new search
    if (query.trim()) {
      refetch();
    }
  };

  const nextPage = () => {
    if (data && data.results.length === pageSize) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(0, page));
  };

  return {
    search,
    searchQuery,
    results: data?.results || [],
    totalResults: data?.total || 0,
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
      hasNextPage: data ? data.results.length === pageSize : false,
      hasPreviousPage: currentPage > 0,
    },
  };
}

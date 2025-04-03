import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { fetchAzureSearchResults, SearchResult } from "@/lib/api";

interface UseSearchOptions {
  initialQuery?: string;
  pageSize?: number;
  useAzureSearch?: boolean;
}

export function useSearch({
  initialQuery = "",
  pageSize = 10,
  useAzureSearch = true,
}: UseSearchOptions = {}) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(0);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalResults, setTotalResults] = useState(0);

  const mutation = useMutation({
    mutationFn: () =>
      fetchAzureSearchResults(searchQuery, {
        top: pageSize,
        skip: currentPage * pageSize,
        orderBy: "timestamp desc",
      }),
    onSuccess: (data) => {
      setResults(data.results);
      setTotalResults(data.total);
    },
    onError: (error) => {
      console.error("Error fetching search results", error);
    },
  });

  const search = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(0); // Reset to first page on new search
    if (query.trim() && useAzureSearch) {
      mutation.mutate();
    }
  };

  const nextPage = () => {
    if (results.length === pageSize) {
      setCurrentPage((prev) => prev + 1);
      mutation.mutate();
    }
  };

  const previousPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
    mutation.mutate();
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(0, page));
    mutation.mutate();
  };

  return {
    search,
    searchQuery,
    results,
    totalResults,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    refetch: mutation.mutate,
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

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { searchGraypaper } from "@/lib/api";

interface UseSearchGraypaperOptions {
  query: string;
  initialPage?: number;
  pageSize?: number;
  searchMode?: string;
  enabled?: boolean;
}

export function useSearchGraypaper({
  query,
  initialPage = 1,
  pageSize = 10,
  searchMode = "strict",
  enabled = true,
}: UseSearchGraypaperOptions) {
  const [page, setPage] = useState(initialPage);
  const currentPageSize = pageSize;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["graypaper-search", query, page, currentPageSize, searchMode],
    queryFn: () =>
      searchGraypaper(query, { page, pageSize: currentPageSize, searchMode }),
    enabled: enabled && !!query.trim(),
  });

  // Calculate total pages
  const totalPages = data ? Math.ceil(data.total / currentPageSize) : 0;
  const totalResults = data?.total || 0;
  const results = data?.results || [];

  // Pagination controls
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
    pageSize: currentPageSize,
    isLoading,
    isError,
    error,
    pagination: {
      nextPage,
      previousPage,
      goToPage,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

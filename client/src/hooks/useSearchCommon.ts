import type { UseQueryResult } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";

export const useSearchCommon = <TData, TError>(
  { initialPage, pageSize }: { initialPage: number; pageSize: number },
  useGetPageQuery: (
    page: number
  ) => UseQueryResult<{ results: TData[]; total: number }, TError>
) => {
  const [page, setPage] = useState(initialPage);
  const [totalResults, setTotalResults] = useState(0);
  const [prefetchedPage, setPrefetchPage] = useState(page);

  const { data, isLoading, isError, error } = useGetPageQuery(page);
  // prefetch next page
  useGetPageQuery(prefetchedPage);

  // Preserve last non-zero total across loading/refetch cycles.
  if (data?.total && data.total !== totalResults) {
    setTotalResults(data.total);
  }

  // Calculate total pages
  const totalPages = Math.ceil(totalResults / pageSize);
  const results = data?.results || [];

  // Pagination controls
  const nextPage = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  const prefetchNextPage = useCallback(() => {
    if (page < totalPages) {
      setPrefetchPage(page + 1);
    }
  }, [page, totalPages]);

  const previousPage = useCallback(() => {
    setPage((page) => (page > 1 ? page - 1 : page));
  }, []);

  const goToPage = useCallback(
    (newPage: number) => {
      setPage(Math.max(1, Math.min(newPage, totalPages || 1)));
    },
    [totalPages]
  );

  const pagination = useMemo(
    () => ({
      nextPage,
      prefetchNextPage,
      previousPage,
      goToPage,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
      currentPage: page,
      totalPages,
      pageSize,
    }),
    [
      nextPage,
      prefetchNextPage,
      previousPage,
      goToPage,
      page,
      totalPages,
      pageSize,
    ]
  );

  return {
    results,
    totalResults,
    isLoading,
    isError,
    error,
    pagination,
  };
};

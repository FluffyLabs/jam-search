import { useQuery } from "@tanstack/react-query";
import { searchGraypaper } from "@/lib/api";
import {useSearchCommon} from "./useSearchCommon";

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
  const useGetPageQuery = (page: number) => useQuery({
    queryKey: ["graypaper-search", query, page, pageSize, searchMode],
    queryFn: () =>
      searchGraypaper(query, { page, pageSize, searchMode }),
    enabled: enabled && !!query.trim(),
  });

  return useSearchCommon(
    { initialPage, pageSize },
    useGetPageQuery
  );
}

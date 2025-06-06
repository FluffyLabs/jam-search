import { useQuery } from "@tanstack/react-query";
import { searchPages } from "@/lib/api";
import {useSearchCommon} from "./useSearchCommon";

interface UseSearchPagesOptions {
  query: string;
  initialPage?: number;
  pageSize?: number;
  searchMode?: string;
  site?: string;
  enabled?: boolean;
}

export function useSearchPages({
  query,
  initialPage = 1,
  pageSize = 10,
  searchMode = "strict",
  site,
  enabled = true,
}: UseSearchPagesOptions) {
  const useGetPageQuery = (page: number) => useQuery({
    queryKey: ["pages-search", query, page, pageSize, searchMode, site],
    queryFn: () =>
      searchPages(query, { page, pageSize: pageSize, searchMode, site }),
    enabled: enabled && !!query.trim(),
  });

  return useSearchCommon({ initialPage, pageSize}, useGetPageQuery);
}

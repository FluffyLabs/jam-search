import { useQuery } from "@tanstack/react-query";
import { searchPages } from "@/lib/api";
import { useSearchCommon } from "./useSearchCommon";

interface UseSearchPagesOptions {
  query: string;
  embedding?: string;
  initialPage?: number;
  pageSize?: number;
  site?: string;
  enabled?: boolean;
}

export function useSearchPages({
  query,
  embedding,
  initialPage = 1,
  pageSize = 10,
  site,
  enabled = true,
}: UseSearchPagesOptions) {
  const useGetPageQuery = (page: number) =>
    useQuery({
      queryKey: ["pages-search", query, embedding, page, pageSize, site],
      queryFn: () =>
        searchPages(query, embedding, { page, pageSize: pageSize, site }),
      enabled,
    });

  return useSearchCommon({ initialPage, pageSize }, useGetPageQuery);
}

import { searchGraypaper } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useSearchCommon } from "./useSearchCommon";

interface UseSearchGraypaperOptions {
  query: string;
  embedding?: string;
  initialPage?: number;
  pageSize?: number;
  enabled?: boolean;
}

export function useSearchGraypaper({
  query,
  embedding,
  initialPage = 1,
  pageSize = 10,
  enabled = true,
}: UseSearchGraypaperOptions) {
  const useGetPageQuery = (page: number) =>
    useQuery({
      queryKey: ["graypaper-search", query, page, pageSize, embedding],
      queryFn: () => searchGraypaper(query, embedding, { page, pageSize }),
      enabled,
    });

  return useSearchCommon({ initialPage, pageSize }, useGetPageQuery);
}

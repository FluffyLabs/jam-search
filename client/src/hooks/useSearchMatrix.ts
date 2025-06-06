import { useQuery } from "@tanstack/react-query";
import { fetchSearchResults } from "@/lib/api";
import { MATRIX_CHANNELS } from "@/consts";
import {useSearchCommon} from "./useSearchCommon";

interface UseSearchMatrixOptions {
  query: string;
  initialPage?: number;
  pageSize?: number;
  channelId?: (typeof MATRIX_CHANNELS)[number]["id"];
  filters?: SearchFilter[];
  searchMode?: string;
  enabled?: boolean;
}

interface SearchFilter {
  key: string;
  value: string;
}

export function useSearchMatrix({
  query,
  initialPage = 1,
  pageSize = 10,
  channelId,
  filters = [],
  searchMode = "strict",
  enabled = true,
}: UseSearchMatrixOptions) {

  // Use React Query to fetch search results
  const useGetPageQuery = (page: number) => useQuery({
    queryKey: ["search", query, page, pageSize, channelId, filters, searchMode],
    queryFn: () =>
      fetchSearchResults(query, {
        page,
        pageSize,
        filters,
        channelId,
        searchMode,
      }),
    enabled: enabled && !!query.trim(), // Only fetch if we have a non-empty query
  });

  const res = useSearchCommon({ initialPage, pageSize }, useGetPageQuery);

  return {
    ...res,
    channelId,
  };
}

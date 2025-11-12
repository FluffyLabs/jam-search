import { fetchSearchResults } from "@/lib/api";
import type * as matrix from "@shared/matrix";
import { useQuery } from "@tanstack/react-query";
import { useSearchCommon } from "./useSearchCommon";

interface UseSearchMatrixOptions {
  query: string;
  embedding?: string;
  initialPage?: number;
  pageSize?: number;
  channelId?: (typeof matrix.ROOMS)[number]["id"];
  filters?: SearchFilter[];
  enabled?: boolean;
}

interface SearchFilter {
  key: string;
  value: string;
}

export function useSearchMatrix({
  query,
  embedding,
  initialPage = 1,
  pageSize = 10,
  channelId,
  filters = [],
  enabled = true,
}: UseSearchMatrixOptions) {
  // Use React Query to fetch search results
  const useGetPageQuery = (page: number) =>
    useQuery({
      queryKey: [
        "search",
        query,
        embedding,
        page,
        pageSize,
        channelId,
        filters,
      ],
      queryFn: () =>
        fetchSearchResults(query, embedding, {
          page,
          pageSize,
          filters,
          channelId,
        }),
      enabled,
    });

  const res = useSearchCommon({ initialPage, pageSize }, useGetPageQuery);

  return {
    ...res,
    channelId,
  };
}

import { useQuery } from "@tanstack/react-query";
import { fetchDiscordSearchResults } from "@/lib/api";
import { useSearchCommon } from "./useSearchCommon";

interface UseSearchDiscordOptions {
  query: string;
  initialPage?: number;
  pageSize?: number;
  channelId?: string;
  filters?: SearchFilter[];
  searchMode?: string;
  enabled?: boolean;
}

interface SearchFilter {
  key: string;
  value: string;
}

export function useSearchDiscord({
  query,
  initialPage = 1,
  pageSize = 10,
  channelId,
  filters = [],
  searchMode = "strict",
  enabled = true,
}: UseSearchDiscordOptions) {
  // Use React Query to fetch search results
  const useGetPageQuery = (page: number) =>
    useQuery({
      queryKey: [
        "-discord-search",
        query,
        page,
        pageSize,
        channelId,
        filters,
        searchMode,
      ],
      queryFn: () =>
        fetchDiscordSearchResults(query, {
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

import { useQuery } from "@tanstack/react-query";
import { fetchDiscordSearchResults } from "@/lib/api";
import { useSearchCommon } from "./useSearchCommon";

interface UseSearchDiscordOptions {
  query: string;
  embedding?: string;
  initialPage?: number;
  pageSize?: number;
  channelId?: string;
  filters?: SearchFilter[];
  enabled?: boolean;
}

interface SearchFilter {
  key: string;
  value: string;
}

export function useSearchDiscord({
  query,
  embedding,
  initialPage = 1,
  pageSize = 10,
  channelId,
  filters = [],
  enabled = true,
}: UseSearchDiscordOptions) {
  // Use React Query to fetch search results
  const useGetPageQuery = (page: number) =>
    useQuery({
      queryKey: [
        "-discord-search",
        query,
        embedding,
        page,
        pageSize,
        channelId,
        filters,
      ],
      queryFn: () =>
        fetchDiscordSearchResults(query, embedding, {
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

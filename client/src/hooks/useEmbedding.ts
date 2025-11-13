import { fetchApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useEmbedding(query: string, isExtendedSearch: boolean) {
  return useQuery({
    queryKey: ["embedding", query, isExtendedSearch],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("q", query);

      return fetchApi<string>(`/embeddings?${queryParams.toString()}`);
    },
    enabled: isExtendedSearch,
  });
}

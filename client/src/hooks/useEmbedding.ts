import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api";

export function useEmbedding(query: string, isExtendedSearch: boolean) {
  return useQuery({
    queryKey: ["embedding", query, isExtendedSearch],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      queryParams.append("q", query);

      // Backend now returns { id: string } instead of the full embedding
      const response = await fetchApi<{ id: string }>(
        `/embeddings?${queryParams.toString()}`
      );
      return response.id;
    },
    enabled: isExtendedSearch,
  });
}

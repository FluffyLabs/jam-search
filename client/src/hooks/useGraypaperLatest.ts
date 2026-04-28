import type { GraypaperLatest } from "@shared/graypaper";
import { useQuery } from "@tanstack/react-query";
import { fetchGraypaperLatest } from "@/lib/api";

const EMPTY: GraypaperLatest = { hash: null, version: null };

/**
 * Latest graypaper hash + version, fetched once and cached forever within the
 * session. Consumers receive {hash: null, version: null} until the fetch
 * resolves; the shared URL composer falls back to the un-pinned URL in that
 * case.
 */
export function useGraypaperLatest(): GraypaperLatest {
  const { data } = useQuery({
    queryKey: ["graypaper-latest"],
    queryFn: fetchGraypaperLatest,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
  });
  return data ?? EMPTY;
}

export interface GraypaperLatest {
  hash: string | null;
  version: string | null;
}

const READER_BASE = "https://graypaper.fluffylabs.dev/#/";
const SHORT_HASH_LEN = 7;

// The Graypaper reader's hash router treats `query` and `title` as raw
// path-after-fragment text — encoding them breaks the existing search/section
// parsing. Keep them un-encoded to match the reader's expectations.
export function buildGraypaperUrl(
  title: string,
  query: string,
  latest: GraypaperLatest
): string {
  const params = `search=${query}&section=${title}`;
  if (!latest.hash || !latest.version) {
    return `${READER_BASE}?${params}`;
  }
  const shortHash = latest.hash.slice(0, SHORT_HASH_LEN);
  return `${READER_BASE}${shortHash}?v=${latest.version}&${params}`;
}

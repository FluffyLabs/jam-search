/**
 * API client for making network requests
 */

// Base URL for API requests
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://matrix-bot-jam-5e043e51602b.herokuapp.com";

/**
 * Type definitions for API responses
 */
export interface SearchResult {
  id: number;
  messageid: string | null;
  roomid: string | null;
  sender: string | null;
  content: string | null;
  timestamp: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

/**
 * Base fetch function with error handling
 */
export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "An unknown error occurred" }));
    throw new Error(error.message || `API error: ${response.status}`);
  }

  return response.json();
}

// Fetch search results
export async function fetchSearchResults(
  query: string,
  options: {
    page?: number;
    pageSize?: number;
    filters?: Array<{ key: string; value: string }>;
    channelId?: string;
    searchMode?: string;
  } = {}
): Promise<SearchResponse> {
  const {
    page = 1,
    pageSize = 10,
    filters = [],
    channelId,
    searchMode = "strict",
  } = options;

  // Build the query parameters
  const queryParams = new URLSearchParams();
  queryParams.append("q", query);
  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());

  // Add filter parameters if provided
  filters.forEach((filter) => {
    queryParams.append(`filter_${filter.key}`, filter.value);
  });

  // Add channelId parameter if provided
  if (channelId) {
    queryParams.append("channelId", channelId);
  }

  // Add searchMode parameter if not strict (default)
  if (searchMode !== "strict") {
    queryParams.append("searchMode", searchMode);
  }

  return fetchApi<SearchResponse>(`/search/messages?${queryParams.toString()}`);
}

export interface GraypaperSearchResult {
  id: number;
  title: string;
  text: string;
}

export interface GraypaperSearchResponse {
  results: GraypaperSearchResult[];
  total: number;
}

export async function searchGraypaper(
  query: string,
  options: {
    page?: number;
    pageSize?: number;
    searchMode?: string;
  } = {}
): Promise<GraypaperSearchResponse> {
  const { page = 1, pageSize = 10, searchMode = "strict" } = options;

  const queryParams = new URLSearchParams();
  queryParams.append("q", query);
  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());

  // Add searchMode parameter if not strict (default)
  if (searchMode !== "strict") {
    queryParams.append("searchMode", searchMode);
  }

  return fetchApi(`/search/graypaper?${queryParams.toString()}`);
}

export interface PageSearchResponse {
  results: Array<{
    id: number;
    url: string;
    site: string;
    title: string;
    content: string;
    lastModified: string;
    createdAt: string;
    similarity?: number;
    score?: number;
  }>;
  total: number;
  page: number;
  pageSize: number;
}

export async function searchPages(
  query: string,
  options: {
    page?: number;
    pageSize?: number;
    searchMode?: string;
    site?: string;
  } = {}
): Promise<PageSearchResponse> {
  const { page = 1, pageSize = 10, searchMode = "strict", site } = options;

  const queryParams = new URLSearchParams();
  queryParams.append("q", query);
  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());

  // Add searchMode parameter if not strict (default)
  if (searchMode !== "strict") {
    queryParams.append("searchMode", searchMode);
  }

  // Add site parameter if provided
  if (site) {
    queryParams.append("site", site);
  }

  return fetchApi<PageSearchResponse>(
    `/search/pages?${queryParams.toString()}`
  );
}

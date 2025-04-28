/**
 * API client for making network requests
 */

// Base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

/**
 * Type definitions for API responses
 */
export interface SearchResult {
  id: number;
  messageid: string | null;
  roomid: string | null;
  sender: string | null;
  link: string | null;
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
  } = {}
): Promise<SearchResponse> {
  const { page = 1, pageSize = 10, filters = [] } = options;

  // Build the query parameters
  const queryParams = new URLSearchParams();
  queryParams.append("q", query);
  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());

  // Add filter parameters if provided
  filters.forEach((filter) => {
    queryParams.append(`filter_${filter.key}`, filter.value);
  });

  return fetchApi<SearchResponse>(`/search?${queryParams.toString()}`);
}

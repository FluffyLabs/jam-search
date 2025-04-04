/**
 * API client for making network requests
 */

// Base URL for API requests
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
// Azure AI Search configuration
const AZURE_SEARCH_ENDPOINT = import.meta.env.VITE_AZURE_SEARCH_ENDPOINT || "";
const AZURE_SEARCH_API_KEY = import.meta.env.VITE_AZURE_SEARCH_API_KEY || "";
const AZURE_SEARCH_INDEX = import.meta.env.VITE_AZURE_SEARCH_INDEX || "";

/**
 * Type definitions for API responses
 */
export interface SearchResult {
  id: string;
  title: string;
  content: string;
  source: string;
  score: number;
  link?: string;
  timestamp?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
}

export interface Document {
  id: string;
  title: string;
  content: string;
  source: string;
  metadata: Record<string, unknown>;
}

/**
 * Azure AI Search specific types
 */
export interface AzureSearchResult {
  messageId: string;
  roomId: string;
  sender: string;
  link: string;
  content: string;
  timestamp: string;
  "@search.score": number;
}

export interface AzureSearchResponse {
  "@odata.count"?: number;
  value: AzureSearchResult[];
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

/**
 * Azure AI Search direct call with error handling
 */
export async function searchAzure(
  query: string,
  options: {
    top?: number;
    skip?: number;
    filter?: string;
    orderBy?: string;
  } = {}
): Promise<AzureSearchResponse> {
  if (!AZURE_SEARCH_ENDPOINT || !AZURE_SEARCH_API_KEY || !AZURE_SEARCH_INDEX) {
    throw new Error("Azure Search configuration is missing");
  }

  const { top = 10, skip = 0, filter, orderBy } = options;
  const url = `${AZURE_SEARCH_ENDPOINT}/indexes/${AZURE_SEARCH_INDEX}/docs/search?api-version=2023-11-01`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": AZURE_SEARCH_API_KEY,
    },
    body: JSON.stringify({
      search: query,
      count: true,
      top,
      skip,
      filter,
      orderby: orderBy,
      queryType: "simple",
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({
      message: "An unknown error occurred with Azure Search",
    }));
    throw new Error(
      error.error?.message || `Azure Search error: ${response.status}`
    );
  }

  return response.json();
}

/**
 * Maps Azure AI Search results to the application's standard format
 */
export function mapAzureResultsToStandard(
  azureResponse: AzureSearchResponse
): SearchResponse {
  return {
    results: azureResponse.value.map((item) => ({
      id: item.messageId,
      title: item.sender,
      content: item.content,
      source: "matrix",
      score: item["@search.score"],
      link: item.link,
      timestamp: item.timestamp,
    })),
    total: azureResponse["@odata.count"] || azureResponse.value.length,
  };
}

/**
 * Example API functions that can be used with React Query
 */

// Fetch search results
export async function fetchSearchResults(
  query: string
): Promise<SearchResponse> {
  return fetchApi<SearchResponse>(`/search?q=${encodeURIComponent(query)}`);
}

// Fetch search results directly from Azure AI Search
export async function fetchAzureSearchResults(
  query: string,
  options?: { top?: number; skip?: number; filter?: string; orderBy?: string }
): Promise<SearchResponse> {
  const azureResponse = await searchAzure(query, options);
  return mapAzureResultsToStandard(azureResponse);
}

// Fetch document by id
export async function fetchDocument(id: string): Promise<Document> {
  return fetchApi<Document>(`/documents/${id}`);
}

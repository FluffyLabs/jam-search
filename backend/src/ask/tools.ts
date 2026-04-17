/**
 * Tool definitions in OpenAI chat-completions tool format. OpenRouter accepts
 * these unchanged. Only two tools: unified search + full-doc fetch.
 */
export const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    function: {
      name: "search_all",
      description:
        "Search across all indexed knowledge sources (graypaper, discord, matrix, pages). Returns up to `limit` result chunks with a stable `id`, a `sourceType`, and a short preview of the content. Use this first to discover relevant material; follow up with get_full_document if a preview is insufficient.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Natural-language or keyword query.",
          },
          limit: {
            type: "integer",
            minimum: 1,
            maximum: 20,
            default: 10,
            description: "Max results per source (so up to 4 × limit total).",
          },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_full_document",
      description:
        "Fetch the full markdown of a single document by the `id` returned from search_all. Use when a search preview is insufficient to answer the question.",
      parameters: {
        type: "object",
        properties: {
          id: {
            type: "string",
            description: "The `id` from a search_all result.",
          },
        },
        required: ["id"],
      },
    },
  },
];

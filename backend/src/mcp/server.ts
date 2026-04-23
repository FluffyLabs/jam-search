// MCP server exposing the same two tools as the /ask agent. The tool handlers
// delegate to executeSearchAll / executeGetFullDocument in ../ask/tools.ts so
// both surfaces share one implementation — keep tool semantics in sync there.
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import { executeGetFullDocument, executeSearchAll } from "../ask/tools.js";
import type { SearchDB } from "../data/searchIndex.js";

const SearchAllInputSchema = z.object({
  query: z.string().describe("Natural-language or keyword query."),
  // `.optional()` after `.default()` keeps `limit` out of JSON-schema `required`,
  // so strict MCP clients don't have to pass it explicitly.
  limit: z
    .number()
    .int()
    .min(1)
    .max(20)
    .default(10)
    .optional()
    .describe("Max results per source (so up to 4 × limit total)."),
});

const GetFullDocumentInputSchema = z.object({
  id: z.string().describe("The `id` from a search_all result."),
});

const TOOLS = [
  {
    name: "search_all",
    description:
      "Search across all indexed knowledge sources (graypaper, discord, matrix, pages). Returns up to `limit` result chunks per source with a stable `id`, a `sourceType`, and a short preview. Use this first to discover relevant material; follow up with get_full_document if a preview is insufficient.",
    inputSchema: z.toJSONSchema(SearchAllInputSchema),
  },
  {
    name: "get_full_document",
    description:
      "Fetch the full markdown of a single document by the `id` returned from search_all. Use when a search preview is insufficient to answer the question.",
    inputSchema: z.toJSONSchema(GetFullDocumentInputSchema),
  },
];

export function createMcpServer(db: SearchDB, dataDir: string): Server {
  const server = new Server(
    {
      name: "jam-search",
      version: "1.0.0",
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return { tools: TOOLS };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "search_all": {
          const parsed = SearchAllInputSchema.parse(args);
          const results = await executeSearchAll(parsed, db, dataDir);
          return {
            content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
          };
        }
        case "get_full_document": {
          const parsed = GetFullDocumentInputSchema.parse(args);
          const doc = await executeGetFullDocument(parsed, db);
          if (!doc) {
            return {
              content: [
                { type: "text", text: `Document not found: ${parsed.id}` },
              ],
              isError: true,
            };
          }
          return {
            content: [{ type: "text", text: JSON.stringify(doc, null, 2) }],
          };
        }
        default:
          return {
            content: [{ type: "text", text: `Unknown tool: ${name}` }],
            isError: true,
          };
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      return {
        content: [{ type: "text", text: `Error: ${message}` }],
        isError: true,
      };
    }
  });

  return server;
}

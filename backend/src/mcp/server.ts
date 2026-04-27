// MCP server exposing the same two tools as the /ask agent. Tool specs and
// implementations are sourced from ../ask/tools.ts so both surfaces stay in
// sync. MCP explicitly disables embeddings to keep the server's OpenAI quota
// off the anonymous path.
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import {
  executeGetFullDocument,
  executeSearchAll,
  TOOL_SPECS,
} from "../ask/tools.js";
import type { SearchDB } from "../data/searchIndex.js";

const MCP_TOOLS = TOOL_SPECS.map((spec) => ({
  name: spec.name,
  description: spec.description,
  inputSchema: z.toJSONSchema(spec.schema),
}));

function specFor(name: string) {
  return TOOL_SPECS.find((spec) => spec.name === name);
}

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
    return { tools: MCP_TOOLS };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case "search_all": {
          const spec = specFor("search_all");
          if (!spec) throw new Error("search_all spec missing");
          const parsed = spec.schema.parse(args) as {
            query: string;
            limit?: number;
          };
          const results = await executeSearchAll(parsed, db, dataDir, {
            useEmbeddings: false,
          });
          return {
            content: [{ type: "text", text: JSON.stringify(results, null, 2) }],
          };
        }
        case "get_full_document": {
          const spec = specFor("get_full_document");
          if (!spec) throw new Error("get_full_document spec missing");
          const parsed = spec.schema.parse(args) as { id: string };
          const doc = await executeGetFullDocument(parsed, db, dataDir);
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
      // Zod validation errors describe the caller's own input and are safe
      // (and useful) to surface. Anything else might contain internal detail
      // like file paths or DB errors — log server-side, return generic text.
      if (error instanceof z.ZodError) {
        return {
          content: [
            { type: "text", text: `Invalid arguments: ${error.message}` },
          ],
          isError: true,
        };
      }
      console.error("MCP tool execution failed:", error);
      return {
        content: [{ type: "text", text: "Tool execution failed" }],
        isError: true,
      };
    }
  });

  return server;
}

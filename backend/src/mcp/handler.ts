// Stateless Streamable HTTP MCP endpoint. Every request gets a fresh
// Server + Transport pair — no session map, no module-level state.
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import type { Context } from "hono";
import type { SearchDB } from "../data/searchIndex.js";
import { createMcpServer } from "./server.js";

export function createMcpHandler(db: SearchDB, dataDir: string) {
  return async (c: Context): Promise<Response> => {
    const transport = new WebStandardStreamableHTTPServerTransport();
    const server = createMcpServer(db, dataDir);
    try {
      await server.connect(transport);
      return await transport.handleRequest(c.req.raw);
    } catch (error) {
      console.error("MCP request failed:", error);
      return c.json(
        {
          jsonrpc: "2.0",
          error: {
            code: -32603,
            message: "Internal server error",
          },
          id: null,
        },
        500
      );
    }
  };
}

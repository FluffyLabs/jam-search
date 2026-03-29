import { randomUUID } from "node:crypto";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import type { Context } from "hono";
import type { SearchDB } from "../data/searchIndex.js";
import { createMcpServer } from "./server.js";

const transports = new Map<string, WebStandardStreamableHTTPServerTransport>();

let _db: SearchDB;
let _dataDir: string;

export function initMcpHandler(db: SearchDB, dataDir: string): void {
  _db = db;
  _dataDir = dataDir;
}

function getSessionId(c: Context): string | undefined {
  return c.req.header("mcp-session-id");
}

async function createTransportForSession(): Promise<{
  transport: WebStandardStreamableHTTPServerTransport;
  server: ReturnType<typeof createMcpServer>;
}> {
  const server = createMcpServer(_db, _dataDir);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
    onsessioninitialized: (sessionId: string) => {
      console.log(`MCP session initialized: ${sessionId}`);
      transports.set(sessionId, transport);
    },
  });

  server.onclose = async () => {
    const sid = transport.sessionId;
    if (sid && transports.has(sid)) {
      console.log(`MCP transport closed for session ${sid}`);
      transports.delete(sid);
    }
  };

  await server.connect(transport);
  return { transport, server };
}

export async function handleMcpPost(c: Context): Promise<Response> {
  const sessionId = getSessionId(c);

  let transport: WebStandardStreamableHTTPServerTransport;
  let body: unknown;

  try {
    body = await c.req.json();
  } catch {
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32700,
          message: "Parse error: Invalid JSON",
        },
        id: null,
      },
      400
    );
  }

  if (sessionId && transports.has(sessionId)) {
    const existingTransport = transports.get(sessionId);
    if (!existingTransport) {
      return c.json(
        {
          jsonrpc: "2.0",
          error: {
            code: -32000,
            message: "Session not found",
          },
          id: (body as { id?: unknown })?.id ?? null,
        },
        400
      );
    }
    transport = existingTransport;
  } else if (!sessionId && isInitializeRequest(body)) {
    const result = await createTransportForSession();
    transport = result.transport;
  } else {
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No valid session ID provided",
        },
        id: (body as { id?: unknown })?.id ?? null,
      },
      400
    );
  }

  return transport.handleRequest(c.req.raw, { parsedBody: body });
}

export async function handleMcpGet(c: Context): Promise<Response> {
  const sessionId = getSessionId(c);

  if (!sessionId) {
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No session ID provided",
        },
        id: null,
      },
      400
    );
  }

  const transport = transports.get(sessionId);
  if (!transport) {
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: Session not found",
        },
        id: null,
      },
      400
    );
  }

  return transport.handleRequest(c.req.raw);
}

export async function handleMcpDelete(c: Context): Promise<Response> {
  const sessionId = getSessionId(c);

  if (!sessionId) {
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: No session ID provided",
        },
        id: null,
      },
      400
    );
  }

  const transport = transports.get(sessionId);
  if (!transport) {
    return c.json(
      {
        jsonrpc: "2.0",
        error: {
          code: -32000,
          message: "Bad Request: Session not found",
        },
        id: null,
      },
      400
    );
  }

  return transport.handleRequest(c.req.raw);
}

export function cleanupMcpTransports(): void {
  for (const [sessionId, transport] of transports) {
    console.log(`Closing MCP transport for session ${sessionId}`);
    transport.close().catch(console.error);
  }
  transports.clear();
}

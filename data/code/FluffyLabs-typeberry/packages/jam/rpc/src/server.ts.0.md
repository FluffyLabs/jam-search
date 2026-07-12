---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc/src/server.ts#L1-L140
title: packages/jam/rpc/src/server.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 03eaec80ac6d11bc1f94cba04a4f7b0d83ec0e2b0e0399a529e7aec812df9a45
language: typescript
---
`packages/jam/rpc/src/server.ts` (lines 1–140)

```typescript
import type { ChainSpec, PvmBackend } from "@typeberry/config";
import type { BlocksDb, RootDb, SerializedStatesDb } from "@typeberry/database";
import type { Blake2b } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import {
  type DatabaseContext,
  type GenericHandler,
  type Handler,
  type HandlerContext,
  type HandlerMap,
  type InputOf,
  JSON_RPC_VERSION,
  type JsonRpcErrorResponse,
  type JsonRpcId,
  type JsonRpcNotification,
  type JsonRpcRequest,
  type JsonRpcResponse,
  type JsonRpcResult,
  type MethodName,
  RpcError,
  type SchemaMap,
  validation,
} from "@typeberry/rpc-validation";
import type { WebSocket } from "ws";
import { WebSocketServer } from "ws";
import type z from "zod";
import { SubscriptionManager } from "./subscription-manager.js";

const PING_INTERVAL_MS = 30000;

function createErrorResponse(error: RpcError, id: JsonRpcId): JsonRpcErrorResponse {
  return {
    jsonrpc: JSON_RPC_VERSION,
    error: {
      code: error.code,
      message: error.message,
      data: error.data,
    },
    id,
  };
}

function createParamsParseErrorMessage(error: z.ZodError): string {
  return `Invalid params:\n${error.issues.map((issue) => `[${issue.path.join(".")}] ${issue.message}`).join(",\n")}`;
}

export class RpcServer {
  private readonly wss: WebSocketServer;
  private readonly blocks: BlocksDb;
  private readonly states: SerializedStatesDb;
  private readonly subscriptionManager: SubscriptionManager;
  private readonly logger: Logger;

  static new(
    port: number,
    rootDb: RootDb<BlocksDb, SerializedStatesDb>,
    chainSpec: ChainSpec,
    blake2b: Blake2b,
    pvmBackend: PvmBackend,
    handlers: HandlerMap,
    schemas: SchemaMap,
  ) {
    return new RpcServer(port, rootDb, chainSpec, blake2b, pvmBackend, handlers, schemas);
  }

  private constructor(
    port: number,
    private readonly rootDb: RootDb<BlocksDb, SerializedStatesDb>,
    private readonly chainSpec: ChainSpec,
    private readonly blake2b: Blake2b,
    private readonly pvmBackend: PvmBackend,
    private readonly handlers: HandlerMap,
    private readonly schemas: SchemaMap,
  ) {
    this.logger = Logger.new(import.meta.filename, "rpc");

    this.blocks = this.rootDb.getBlocksDb();
    this.states = this.rootDb.getStatesDb();

    this.wss = new WebSocketServer({ port });
    this.setupWebSocket();

    this.subscriptionManager = SubscriptionManager.new(this.callHandler.bind(this));
  }

  private setupWebSocket(): void {
    this.wss.on("error", (error) => {
      this.logger.error`Server error: ${error}`;
    });

    this.wss.on("listening", () => {
      this.logger.info`Server listening on port ${this.wss.options.port}`;
    });

    this.wss.on("connection", (ws: WebSocket) => {
      let isAlive = true;

      ws.on("pong", () => {
        isAlive = true;
      });

      const pingInterval = setInterval(() => {
        if (!isAlive) {
          ws.terminate();
        }
        isAlive = false;
        ws.ping();
        this.logger.info`Pinging client`;
      }, PING_INTERVAL_MS);

      ws.on("close", () => {
        clearInterval(pingInterval);
      });

      ws.on("message", async (data: string) => {
        let rawRequest: unknown;
        try {
          rawRequest = JSON.parse(data);
        } catch {
          ws.send(JSON.stringify(createErrorResponse(new RpcError(-32700, "Parse error"), null)));
          return;
        }

        if (Array.isArray(rawRequest)) {
          if (rawRequest.length === 0) {
            ws.send(JSON.stringify(createErrorResponse(new RpcError(-32600, "Array must contain requests."), null)));
            return;
          }

          const responses = (
            await Promise.all(rawRequest.map((request: unknown) => this.handleRequest(request, ws)))
          ).filter((response) => response !== null);

          if (responses.length > 0) {
            ws.send(JSON.stringify(responses));
          }

          return;
        }

```

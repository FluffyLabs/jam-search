---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-validation/types.ts#L1-L118
title: packages/jam/rpc-validation/types.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 1f5e3e7ead425363d04e1f4e51be9d5c525cdfab2a8225125f78f190f3695fe2
language: typescript
---
`packages/jam/rpc-validation/types.ts` (lines 1–118)

```typescript
import type { ChainSpec, PvmBackend } from "@typeberry/config";
import type { BlocksDb, StatesDb } from "@typeberry/database";
import type { Blake2b } from "@typeberry/hash";
import type { EnumerableState, State } from "@typeberry/state";
import type WebSocket from "ws";
import type { z } from "zod";
import type { JSON_RPC_VERSION, SUBSCRIBABLE_METHODS, validation } from "./validation.js";

export type JsonRpcResult = unknown;

export type JsonRpcRequest = z.infer<typeof validation.jsonRpcRequest>;

export type JsonRpcNotification = z.infer<typeof validation.jsonRpcNotification>;

export type JsonRpcId = JsonRpcRequest["id"];

export interface JsonRpcSuccessResponse {
  jsonrpc: typeof JSON_RPC_VERSION;
  result: unknown;
  id: JsonRpcId;
}

export interface JsonRpcErrorResponse {
  jsonrpc: typeof JSON_RPC_VERSION;
  error: {
    code: number;
    message: string;
    data?: unknown;
  };
  id: JsonRpcId;
}

interface JsonRpcSubscriptionResultNotification extends JsonRpcNotification {
  params: {
    subscriptionId: SubscriptionId;
    result: JsonRpcResult;
  };
}

interface JsonRpcSubscriptionErrorNotification extends JsonRpcNotification {
  params: {
    subscriptionId: SubscriptionId;
    error: unknown;
  };
}

export type JsonRpcSubscriptionNotification =
  | JsonRpcSubscriptionResultNotification
  | JsonRpcSubscriptionErrorNotification;

export type JsonRpcResponse = JsonRpcSuccessResponse | JsonRpcErrorResponse;

export class RpcError extends Error {
  constructor(
    public code: number,
    message: string,
    public data?: unknown,
  ) {
    super(message);
  }
}

export enum RpcErrorCode {
  BlockUnavailable = 1,
  WorkReportUnavailable = 2,
  DASegmentUnavailable = 3,
  Other = 0,
}

export interface DatabaseContext {
  blocks: BlocksDb;
  states: StatesDb<State & EnumerableState>;
}

export type SchemaMap = typeof validation.schemas;
export type MethodName = keyof SchemaMap;
export type MethodWithNoArgsName = keyof {
  [K in keyof SchemaMap as SchemaMap[K]["input"] extends z.ZodTuple<[]> ? K : never]: SchemaMap[K];
};
export type SchemaMapUnknown = Record<MethodName, { input: z.ZodTypeAny; output: z.ZodTypeAny }>;
export type InputOf<M extends MethodName> = z.infer<SchemaMap[M]["input"]>;
export type OutputOf<M extends MethodName> = z.infer<SchemaMap[M]["output"]>;

export interface HandlerContext {
  db: DatabaseContext;
  chainSpec: ChainSpec;
  pvmBackend: PvmBackend;
  blake2b: Blake2b;
  subscription: SubscriptionHandlerApi;
}

export type GenericHandler<I, O> = (input: I, context: HandlerContext) => Promise<O>;
export type Handler<M extends MethodName> = GenericHandler<InputOf<M>, OutputOf<M>>;
export type HandlerMap = {
  [N in MethodName]: Handler<N>;
};

export type Subscription<I, O> = {
  ws: WebSocket;
  method: SubscribableMethodName;
  handler: GenericHandler<I, O>;
  outputSchema: z.ZodType<O>;
  params: I;
};

export type SubscriptionId = string;

export type SubscriptionHandlerApi = {
  subscribe: <I, O>(
    method: SubscribableMethodName,
    handler: GenericHandler<I, O>,
    outputSchema: z.ZodType<O>,
    params: I,
  ) => SubscriptionId;
  unsubscribe: (id: SubscriptionId) => boolean;
};

export type SubscribableMethodName = keyof typeof SUBSCRIBABLE_METHODS;
```

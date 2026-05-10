---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-client/index.ts#L1-L134
title: packages/jam/rpc-client/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 2
content_sha: 8c29cc6c7ac54896476482c11a76b7e8b88387e2c281d00139dae97341136044
language: typescript
---
`packages/jam/rpc-client/index.ts` (lines 1–134)

```typescript
import { Logger } from "@typeberry/logger";
import {
  type InputOf,
  JSON_RPC_VERSION,
  type JsonRpcRequest,
  type JsonRpcResponse,
  type JsonRpcSubscriptionNotification,
  type MethodName,
  type MethodWithNoArgsName,
  type OutputOf,
  type SchemaMapUnknown,
  SUBSCRIBABLE_METHODS,
  type SubscribableMethodName,
  validation,
} from "@typeberry/rpc-validation";
import { EventEmitter } from "eventemitter3";
import WebSocket from "ws";

export interface Subscription<M extends SubscribableMethodName> {
  id: string;
  method: M;
  eventEmitter: SubscriptionEventEmitter;
}

type SubscriptionEventMap = {
  data: [unknown];
  error: [unknown];
  end: [];
};

class SubscriptionEventEmitter extends EventEmitter<SubscriptionEventMap> {
  static new(unsubscribe: () => Promise<void>) {
    return new SubscriptionEventEmitter(unsubscribe);
  }

  private constructor(readonly unsubscribe: () => Promise<void>) {
    super();
  }
}

const logger = Logger.new("rpc");

export class RpcClient {
  private ws: WebSocket;
  private messageQueue: Map<number, (response: JsonRpcResponse) => void> = new Map();
  private subscriptions: Map<string, Subscription<SubscribableMethodName>> = new Map();
  private nextId = 1;
  private connectionPromise: Promise<void>;

  static new(url: string) {
    return new RpcClient(url);
  }

  private constructor(url: string) {
    this.ws = new WebSocket(url);
    this.connectionPromise = new Promise((resolve) => {
      this.ws.once("open", () => {
        logger.info`Connected to server`;
        resolve();
      });
    });
    this.setupWebSocket();
  }

  private setupWebSocket(): void {
    this.ws.on("message", (data: string) => {
      const response: JsonRpcResponse | JsonRpcSubscriptionNotification = JSON.parse(data);

      // todo [seko] this block of ifs shall be made cleaner once there's zod validation in place for the client
      if (
        !("id" in response) &&
        "params" in response &&
        "subscriptionId" in response.params &&
        "result" in response.params
      ) {
        const { subscriptionId, result } = response.params;
        const subscription = this.subscriptions.get(subscriptionId);

        if (subscription !== undefined) {
          subscription.eventEmitter.emit("data", result);
        }
      } else if (
        !("id" in response) &&
        "params" in response &&
        "subscriptionId" in response.params &&
        "error" in response.params
      ) {
        const { subscriptionId, error } = response.params;
        const subscription = this.subscriptions.get(subscriptionId);

        if (subscription !== undefined) {
          subscription.eventEmitter.emit("error", error);
        }
      } else if ("id" in response && typeof response.id === "number") {
        const callback = this.messageQueue.get(response.id);

        if (callback !== undefined) {
          callback(response);
          this.messageQueue.delete(response.id);
        }
      }
    });

    this.ws.on("error", (error) => {
      logger.error`WebSocket error: ${error}`;
    });

    this.ws.on("close", () => {
      logger.info`Disconnected from server`;
    });
  }

  async waitForConnection(): Promise<void> {
    return this.connectionPromise;
  }

  async call<M extends MethodWithNoArgsName>(method: M, params?: InputOf<M>): Promise<OutputOf<M>>;
  async call<M extends MethodName>(method: M, params: InputOf<M>): Promise<OutputOf<M>>;
  async call<M extends MethodName>(method: M, params?: InputOf<M>): Promise<OutputOf<M>> {
    if (!(method in validation.schemas)) {
      throw new Error(`Method "${method}" not found. Request was not sent.`);
    }

    const { input } = validation.schemas[method] as SchemaMapUnknown[M];

    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const request: JsonRpcRequest = {
        jsonrpc: JSON_RPC_VERSION,
        method,
        params: input.encode(params ?? []),
        id,
      };

```

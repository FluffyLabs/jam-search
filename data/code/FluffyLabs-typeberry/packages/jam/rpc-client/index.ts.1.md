---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-client/index.ts#L126-L190
title: packages/jam/rpc-client/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: b2cf0ec4ea653b3303da8008113252ab97801c46441e9917d809f4145ad64b61
language: typescript
---
`packages/jam/rpc-client/index.ts` (lines 126–190)

```typescript
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const request: JsonRpcRequest = {
        jsonrpc: JSON_RPC_VERSION,
        method,
        params: input.encode(params ?? []),
        id,
      };

      this.messageQueue.set(id, (response: JsonRpcResponse) => {
        if ("error" in response) {
          reject(response.error);
        } else {
          const { output } = validation.schemas[method];
          const parseResult = output.safeParse(response.result);
          if (parseResult.success === false) {
            reject(
              new Error(`Received an invalid response for method "${method}": ${JSON.stringify(response.result)}`),
            );
            return;
          }
          resolve(parseResult.data);
        }
      });

      this.ws.send(JSON.stringify(request));
    });
  }

  async subscribe<M extends SubscribableMethodName>(method: M, params: InputOf<M>): Promise<SubscriptionEventEmitter> {
    const subscriptionId = await this.call(method, params);
    const eventEmitter = SubscriptionEventEmitter.new(() => this.unsubscribe(subscriptionId));
    this.subscriptions.set(subscriptionId, { id: subscriptionId, method, eventEmitter });
    return eventEmitter;
  }

  private async unsubscribe(subscriptionId: string): Promise<void> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (subscription === undefined) {
      throw new Error("Subscription not found. Unsubscribe request was not sent.");
    }

    const unsubscribeMethod = SUBSCRIBABLE_METHODS[subscription.method];
    if (unsubscribeMethod === undefined) {
      throw new Error(
        `Missing unsubscribe method mapping for "${subscription.method}". Unsubscribe request was not sent.`,
      );
    }
    const result = await this.call(unsubscribeMethod, [subscriptionId]);

    if (result === true) {
      this.subscriptions.delete(subscriptionId);
    } else {
      throw new Error("Server failed to terminate subscription.");
    }
  }

  close(): void {
    this.ws.close();
  }

  getSocket(): WebSocket {
    return this.ws;
  }
}
```

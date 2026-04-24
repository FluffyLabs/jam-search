---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/src/server.ts#L131-L245
title: bin/rpc/src/server.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 78e9cf876f92ea2d56e77f9e99d752d0d583ce1967461ee1b57b620678488a8c
language: typescript
---
`bin/rpc/src/server.ts` (lines 131–245)

```typescript
            await Promise.all(rawRequest.map((request: unknown) => this.handleRequest(request, ws)))
          ).filter((response) => response !== null);

          if (responses.length > 0) {
            ws.send(JSON.stringify(responses));
          }

          return;
        }

        const response = await this.handleRequest(rawRequest, ws);
        if (response !== null) {
          ws.send(JSON.stringify(response));
        }
      });
    });
  }

  private async handleRequest(request: unknown, ws: WebSocket): Promise<JsonRpcResponse | null> {
    const requestParseResult = validation.jsonRpcRequest.safeParse(request);
    if (requestParseResult.success === true) {
      try {
        return {
          jsonrpc: JSON_RPC_VERSION,
          result: await this.fulfillRequest(requestParseResult.data, ws),
          id: requestParseResult.data.id,
        };
      } catch (error) {
        const rpcError =
          error instanceof RpcError
            ? error
            : new RpcError(-32603, error instanceof Error ? error.message : "Internal error");
        return createErrorResponse(rpcError, requestParseResult.data.id);
      }
    }

    const notificationParseResult = validation.jsonRpcNotification.safeParse(request);
    if (notificationParseResult.success === true) {
      try {
        await this.fulfillRequest(notificationParseResult.data, ws);
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Unknown error";
        this.logger.error`Notification ${JSON.stringify(notificationParseResult.data)} caused an error: ${msg}`;
      }

      return null;
    }

    return createErrorResponse(new RpcError(-32600, `Invalid request: ${JSON.stringify(request)}`), null);
  }

  private async fulfillRequest(request: JsonRpcRequest | JsonRpcNotification, ws: WebSocket): Promise<JsonRpcResult> {
    const { method, params } = request;

    if (!(method in this.schemas)) {
      throw new RpcError(-32601, `Method not found: ${method}`);
    }
    const methodName = method as MethodName;
    const handler = this.handlers[methodName] as Handler<MethodName>;
    const validatedParams = this.validateCall(methodName, params ?? []);
    return this.callHandler(handler, validatedParams, this.schemas[methodName].output, ws);
  }

  private validateCall<M extends MethodName>(method: M, params: unknown): InputOf<M> {
    const { input } = this.schemas[method];
    const parseResult = input.safeParse(params);
    if (parseResult.error !== undefined) {
      throw new RpcError(-32602, createParamsParseErrorMessage(parseResult.error));
    }
    return parseResult.data as InputOf<M>;
  }

  async callHandler<I, O>(
    handler: GenericHandler<I, O>,
    validatedParams: I,
    outputSchema: z.ZodType<O>,
    ws: WebSocket,
  ): Promise<unknown> {
    const db: DatabaseContext = {
      blocks: this.blocks,
      states: this.states,
    };

    const context: HandlerContext = {
      db,
      chainSpec: this.chainSpec,
      pvmBackend: this.pvmBackend,
      blake2b: this.blake2b,
      subscription: this.subscriptionManager.getHandlerApi(ws),
    };

    return outputSchema.encode(await handler(validatedParams, context));
  }

  getLogger(): Logger {
    return this.logger;
  }

  // for testing only
  getHandlers(): HandlerMap {
    return this.handlers;
  }

  async close(): Promise<void> {
    this.logger.info`Cleaning up...`;
    await new Promise<void>((resolve) => {
      for (const ws of this.wss.clients) {
        ws.terminate();
      }
      this.wss.close(() => resolve());
    });
    this.subscriptionManager.destroy();
    await this.rootDb.db.close();
  }
}
```

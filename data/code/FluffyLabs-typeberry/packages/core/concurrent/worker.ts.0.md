---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/concurrent/worker.ts#L1-L60
title: packages/core/concurrent/worker.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 7e9cfc6ccb70c24ff0d02f6decc870e90e666b6ce4bb3141f95fa3474281bbd3
language: typescript
---
`packages/core/concurrent/worker.ts` (lines 1–60)

```typescript
import { type MessagePort, parentPort } from "node:worker_threads";
import { Result } from "@typeberry/utils";
import type { IExecutor, MessageIn, MessageOut, WithTransferList } from "./messages.js";

/** A in-worker abstraction. */
export class ConcurrentWorker<TParams, TResult extends WithTransferList, TInternalState>
  implements IExecutor<TParams, TResult>
{
  static new<XParams, XResult extends WithTransferList, XInternalState>(
    run: (params: XParams, state: XInternalState) => Promise<XResult>,
    state: XInternalState,
  ) {
    return new ConcurrentWorker(run, state);
  }

  private constructor(
    private readonly runInternal: (params: TParams, state: TInternalState) => Promise<TResult>,
    public readonly state: TInternalState,
  ) {}

  listenToParentPort() {
    if (parentPort === null) {
      throw new Error("This method is meant to be run inside a worker thread!");
    }
    parentPort.once("close", () => {
      process.exit(0);
    });
    parentPort.once("message", (port: MessagePort) => {
      this.listenTo(port);
      // send back readiness signal.
      parentPort?.postMessage("ready");
    });
  }

  private listenTo(port: MessagePort) {
    port.once("close", () => {
      port.removeAllListeners();
      process.exit(0);
    });

    port.on("message", (ev: MessageIn<TParams>) => {
      const { params } = ev;
      this.run(params)
        .then((result) => {
          const response: MessageOut<TResult> = Result.ok(result);
          port.postMessage(response, result.getTransferList());
        })
        .catch((e) => {
          const response: MessageOut<TResult> = Result.error(`${e}`, () => `Worker execution failed: ${e}`);
          port.postMessage(response, []);
        });
    });
  }

  async run(params: TParams): Promise<TResult> {
    return await this.runInternal(params, this.state);
  }

  async destroy() {}
}
```

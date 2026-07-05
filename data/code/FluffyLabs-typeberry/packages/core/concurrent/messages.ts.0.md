---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/concurrent/messages.ts#L1-L19
title: packages/core/concurrent/messages.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d914a26bc6bc476f2a6d82b883845ea3e4c17f151a6b1b18da698ca984ae240c
language: typescript
---
`packages/core/concurrent/messages.ts` (lines 1–19)

```typescript
import type { Transferable } from "node:worker_threads";
import type { Result } from "@typeberry/utils";

export interface IExecutor<TParams, TResult> {
  run(params: TParams): Promise<TResult>;
  destroy(): Promise<void>;
}

export type WithTransferList = {
  getTransferList(): Transferable[];
};

/** Message going from parent thread to worker thread. */
export type MessageIn<TParams> = {
  params: TParams;
};

/** Response from worker to the parent. */
export type MessageOut<TResult> = Result<TResult, string>;
```

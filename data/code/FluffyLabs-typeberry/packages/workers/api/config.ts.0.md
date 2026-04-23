---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/config.ts#L1-L54
title: packages/workers/api/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e63adf9f14c8f3ee34e4cdb09a54258eefd87d940eeea7b5cdcebb055f5667e3
language: typescript
---
`packages/workers/api/config.ts` (lines 1–54)

```typescript
import type { ChainSpec } from "@typeberry/config";
import type { BlocksDb, RootDb, StatesDb } from "@typeberry/database";

/** Standardized worker config. */
export interface WorkerConfig<TParams = void, TBlocks = BlocksDb, TStates = StatesDb> {
  /** Node name. */
  readonly nodeName: string;
  /** Chain spec. */
  readonly chainSpec: ChainSpec;
  /** Worker parameters. */
  readonly workerParams: TParams;

  /** Open database. */
  openDatabase(options?: { readonly: boolean }): RootDb<TBlocks, TStates>;
}

/**
 * Worker config with in-thread database.
 */
export class DirectWorkerConfig<TParams = void, TBlocks = BlocksDb, TStates = StatesDb>
  implements WorkerConfig<TParams, TBlocks, TStates>
{
  static new<T, B, S>({
    nodeName,
    chainSpec,
    blocksDb,
    statesDb,
    workerParams: params,
  }: {
    nodeName: string;
    chainSpec: ChainSpec;
    blocksDb: B;
    statesDb: S;
    workerParams: T;
  }): DirectWorkerConfig<T, B, S> {
    return new DirectWorkerConfig(nodeName, chainSpec, params, blocksDb, statesDb);
  }

  private constructor(
    public readonly nodeName: string,
    public readonly chainSpec: ChainSpec,
    public readonly workerParams: TParams,
    private readonly blocksDb: TBlocks,
    private readonly statesDb: TStates,
  ) {}

  openDatabase(_options?: { readonly: boolean }): RootDb<TBlocks, TStates> {
    return {
      getBlocksDb: () => this.blocksDb,
      getStatesDb: () => this.statesDb,
      close: () => Promise.resolve(),
    };
  }
}
```

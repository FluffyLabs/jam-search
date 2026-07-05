---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/config.ts#L1-L54
title: packages/workers/api/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 70e6a0d038db3c87bb1106dc0e71d828a07471f55d3dd9d9910da03ff89e0972
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
  openDatabase(options?: { readonly: boolean }): Promise<RootDb<TBlocks, TStates>>;
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

  async openDatabase(_options?: { readonly: boolean }): Promise<RootDb<TBlocks, TStates>> {
    return {
      getBlocksDb: () => this.blocksDb,
      getStatesDb: () => this.statesDb,
      close: () => Promise.resolve(),
    };
  }
}
```

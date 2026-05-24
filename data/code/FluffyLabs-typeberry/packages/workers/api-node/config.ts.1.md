---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L108-L153
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 0b4e8b38040890d769f178705a0eebdb165bf3a0e17f973fcf350b0aa81b3dad
language: typescript
---
`packages/workers/api-node/config.ts` (lines 108–153)

```typescript
export function configTransferList(config: TransferableConfig): MessagePort[] {
  return config.workerPorts.map(([, transferable]) => transferable.port);
}

/**
 * In-memory (direct) worker using serialized state database.
 *
 * Note the database is always empty, and needs to be initialized.
 */
export class InMemWorkerConfig<T = undefined> implements WorkerConfig<T, BlocksDb, SerializedStatesDb> {
  static new<T>({
    nodeName,
    chainSpec,
    workerParams,
    blake2b,
  }: {
    nodeName: string;
    chainSpec: ChainSpec;
    workerParams: T;
    blake2b: Blake2b;
  }) {
    return new InMemWorkerConfig(nodeName, chainSpec, workerParams, blake2b);
  }

  private readonly blocks: InMemoryBlocks;
  private readonly states: InMemorySerializedStates;

  private constructor(
    public readonly nodeName: string,
    public readonly chainSpec: ChainSpec,
    public readonly workerParams: T,
    public readonly blake2b: Blake2b,
  ) {
    this.blocks = InMemoryBlocks.new();
    this.states = InMemorySerializedStates.withHasher({ chainSpec, blake2b });
  }

  openDatabase(_options: { readonly: boolean } = { readonly: true }): RootDb<BlocksDb, SerializedStatesDb> {
    // opening/closing db doesn't do anything, we persist the state.
    return {
      getBlocksDb: () => this.blocks,
      getStatesDb: () => this.states,
      close: async () => {},
    };
  }
}
```

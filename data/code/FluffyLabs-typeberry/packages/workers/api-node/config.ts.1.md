---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L108-L221
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 3
content_sha: 0c3dab1340e0580819243a35227fa0ad392933aff50ef25091aac6997dbe356c
language: typescript
---
`packages/workers/api-node/config.ts` (lines 108–221)

```typescript
  chainSpec: ChainSpec;
  workerParams: Uint8Array;
  dbPath: string;
  workerPorts: [string, TransferablePort][];
};

/**
 * Collect the transferable objects (communication ports) embedded in a config.
 *
 * `MessagePort`s can only be transferred, not structurally cloned, so they have to
 * be listed in the `postMessage` transfer list. Omitting them results in a
 * `DataCloneError`.
 */
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

/** Persistent values store backing the hybrid config. */
export type HybridBackend = "lmdb" | "fjall";

/**
 * Hybrid worker config for the fuzz target: in-memory blocks and leaf sets,
 * but large values persisted to disk. The `backend` picks where the values go
 * (lmdb or fjall).
 *
 * fjall opens its keyspace asynchronously, that is why `new` here is async.
 *
 * Like `InMemWorkerConfig`, the blocks and leaf sets are shared across the
 * open/close/reopen dance that genesis init performs, so `openDatabase`
 * returns the same instances and a no-op close. The values store is opened once
 * here and closed by `HybridSerializedStates.close()` at importer teardown.
 *
 * In-process only: it holds shared mutable state (the in-memory leaf
 * dictionary) and so is not thread-transferable. The fuzz target runs the
 * importer in-process via `createImporter`, not in a spawned worker.
 */
export class HybridWorkerConfig<T = undefined> implements WorkerConfig<T, BlocksDb, SerializedStatesDb> {
  static async new<T>({
    nodeName,
    chainSpec,
    workerParams,
    blake2b,
    dbPath,
    ephemeral = false,
    compression = true,
    backend = "lmdb",
    sharedFjallSession,
  }: {
    nodeName: string;
    chainSpec: ChainSpec;
    workerParams: T;
    blake2b: Blake2b;
    dbPath: string;
    ephemeral?: boolean;
    compression?: boolean;
    backend?: HybridBackend;
    /**
     * Reuse an already-open fjall values session instead of opening a fresh
     * keyspace. The fuzz target opens one per run and passes it on every reset,
     * so only the in-memory blocks/leaf sets are rebuilt per vector. Ignored
     * unless `backend === "fjall"`.
     */
    sharedFjallSession?: FjallValuesSession;
  }): Promise<HybridWorkerConfig<T>> {
    // The values store is created once here and shared across reopen. When a
    // session is given (fuzz reset reuse) we wrap it instead of opening a new one.
    const states =
      backend === "fjall"
        ? sharedFjallSession !== undefined
          ? FjallHybridSerializedStates.fromSession(chainSpec, blake2b, sharedFjallSession)
          : await FjallHybridSerializedStates.new({ spec: chainSpec, blake2b, dbPath, ephemeral })
```

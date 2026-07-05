---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L236-L357
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 3b22c9e06b13cfd26034d2fe1210967e40d004c18e7559cfa9b30e75536109c6
language: typescript
---
`packages/workers/api-node/config.ts` (lines 236–357)

```typescript
  workerParams: Uint8Array;
  dbPath: string;
  workerPorts: [string, TransferablePort][];
  cacheSizeBytes?: number;
};

async function decodeTransferableConfig<T>(decodeParams: Decode<T>, config: TransferableConfig) {
  const blake2b = await Blake2b.createHasher();
  const chainSpec = ChainSpec.new(config.chainSpec);
  const workerParams = Decoder.decodeObject(decodeParams, config.workerParams, chainSpec);
  const ports = new Map(config.workerPorts.map(([name, port]) => [name, ThreadPort.fromTransferable(chainSpec, port)]));

  return {
    blake2b,
    chainSpec,
    workerParams,
    ports,
  };
}

/** Restore a persistent worker config from its transferable form. */
export async function persistentConfigFromTransferable<T>(
  decodeParams: Decode<T>,
  config: TransferableConfig,
): Promise<PersistentWorkerConfig<T>> {
  switch (config.databaseBackend) {
    case "lmdb":
      return LmdbWorkerConfig.fromTransferable(decodeParams, config);
    case "fjall":
      return FjallWorkerConfig.fromTransferable(decodeParams, config);
  }
}

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

  async openDatabase(
    _options: { readonly: boolean } = { readonly: true },
  ): Promise<RootDb<BlocksDb, SerializedStatesDb>> {
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
```

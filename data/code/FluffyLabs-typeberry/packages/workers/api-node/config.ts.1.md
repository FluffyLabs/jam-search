---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L115-L242
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 4
content_sha: c0d92e607cbf94dc8a396246b99077af4e6b872d56fc6ed41804e37b640c93a7
language: typescript
---
`packages/workers/api-node/config.ts` (lines 115–242)

```typescript
      workerParams: Encoder.encodeObject(paramsCodec, this.workerParams, this.chainSpec).raw,
      dbPath: this.dbPath,
      workerPorts: Array.from(this.ports.entries()).map(([name, port]) => [name, port.intoTransferable()]),
    };
  }
}

/** Worker config for node.js, backed by a shared fjall engine. */
export class FjallWorkerConfig<T = void> implements WorkerConfig<T, BlocksDb, SerializedStatesDb> {
  static new<T>({
    nodeName,
    chainSpec,
    workerParams,
    dbPath,
    blake2b,
    ports = new Map(),
    ephemeral = false,
    cacheSizeBytes,
  }: {
    nodeName: string;
    chainSpec: ChainSpec;
    workerParams: T;
    dbPath: string;
    blake2b: Blake2b;
    ports?: Map<string, ThreadPort>;
    ephemeral?: boolean;
    cacheSizeBytes?: number;
  }) {
    return new FjallWorkerConfig(nodeName, chainSpec, workerParams, dbPath, blake2b, ports, ephemeral, cacheSizeBytes);
  }

  /** Restore node config from a transferable config object. */
  static async fromTransferable<T>(decodeParams: Decode<T>, config: TransferableConfig) {
    if (config.databaseBackend !== "fjall") {
      throw new Error(`Expected fjall worker config, got ${config.databaseBackend}.`);
    }
    const { blake2b, chainSpec, workerParams, ports } = await decodeTransferableConfig(decodeParams, config);

    return FjallWorkerConfig.new({
      nodeName: config.nodeName,
      chainSpec,
      workerParams,
      dbPath: config.dbPath,
      blake2b,
      ports,
      cacheSizeBytes: config.cacheSizeBytes,
    });
  }

  private constructor(
    public readonly nodeName: string,
    public readonly chainSpec: ChainSpec,
    public readonly workerParams: T,
    public readonly dbPath: string,
    public readonly blake2b: Blake2b,
    public readonly ports: Map<string, ThreadPort>,
    // Kept for the fuzz/importer path. When set, persist() is skipped.
    public readonly ephemeral: boolean = false,
    public readonly cacheSizeBytes: number | undefined = undefined,
  ) {}

  async openDatabase(
    options: { readonly: boolean } = { readonly: true },
  ): Promise<RootDb<BlocksDb, SerializedStatesDb>> {
    const fjall = await FjallRoot.open(this.dbPath, {
      readOnly: options.readonly,
      ephemeral: this.ephemeral,
      cacheSizeBytes: this.cacheSizeBytes,
    });
    let blocks: FjallBlocks | null = null;
    let states: FjallStates | null = null;
    try {
      [blocks, states] = await Promise.all([
        FjallBlocks.open(this.chainSpec, fjall),
        FjallStates.open(this.chainSpec, this.blake2b, fjall),
      ]);
    } catch (e) {
      await fjall.close();
      throw e;
    }

    return {
      getBlocksDb: () => {
        if (blocks === null) {
          throw new Error("Fjall database is closed.");
        }
        return blocks;
      },
      getStatesDb: () => {
        if (states === null) {
          throw new Error("Fjall database is closed.");
        }
        return states;
      },
      close: async () => {
        blocks = null;
        states = null;
        await fjall.close();
      },
    };
  }

  /** Convert this config into a thread-transferable object. */
  intoTransferable(paramsCodec: Encode<T>): TransferableConfig {
    return {
      databaseBackend: "fjall",
      nodeName: this.nodeName,
      chainSpec: this.chainSpec,
      workerParams: Encoder.encodeObject(paramsCodec, this.workerParams, this.chainSpec).raw,
      dbPath: this.dbPath,
      workerPorts: Array.from(this.ports.entries()).map(([name, port]) => [name, port.intoTransferable()]),
      cacheSizeBytes: this.cacheSizeBytes,
    };
  }
}

/** Config that's safe to transfer between worker threads. */
export type TransferableConfig = {
  databaseBackend: PersistentBackend;
  nodeName: string;
  chainSpec: ChainSpec;
  workerParams: Uint8Array;
  dbPath: string;
  workerPorts: [string, TransferablePort][];
  cacheSizeBytes?: number;
};

async function decodeTransferableConfig<T>(decodeParams: Decode<T>, config: TransferableConfig) {
```

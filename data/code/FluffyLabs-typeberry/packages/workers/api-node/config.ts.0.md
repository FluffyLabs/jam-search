---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L1-L121
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 4
content_sha: da835cd321569740c629cc2e490f7f60c0a9adaecd387399f0848f2fc5371fd0
language: typescript
---
`packages/workers/api-node/config.ts` (lines 1–121)

```typescript
import type { MessagePort } from "node:worker_threads";
import { type Decode, Decoder, type Encode, Encoder } from "@typeberry/codec";
import { ChainSpec } from "@typeberry/config";
import {
  type BlocksDb,
  InMemoryBlocks,
  InMemorySerializedStates,
  type RootDb,
  type SerializedStatesDb,
} from "@typeberry/database";
import {
  FjallBlocks,
  HybridSerializedStates as FjallHybridSerializedStates,
  FjallRoot,
  FjallStates,
  FjallValuesSession,
} from "@typeberry/database-fjall";
import {
  LmdbBlocks,
  HybridSerializedStates as LmdbHybridSerializedStates,
  LmdbRoot,
  LmdbStates,
} from "@typeberry/database-lmdb";
import { Blake2b } from "@typeberry/hash";
import type { WorkerConfig } from "@typeberry/workers-api";
import { ThreadPort, type TransferablePort } from "./port.js";

// Re-exported so the fuzz target can open one values session per run and reuse
// it across resets (see `HybridWorkerConfig` / `mainFuzz`).
export { FjallValuesSession };

/** Persistent regular-node backend. */
export type PersistentBackend = "lmdb" | "fjall";

/** Transferable worker config for persistent regular-node workers. */
export type PersistentWorkerConfig<T> = LmdbWorkerConfig<T> | FjallWorkerConfig<T>;

/**
 * Worker config for node.js, backed by the LMDB database.
 *
 * @deprecated lmdb is retained as an explicit fallback. Use `FjallWorkerConfig` for regular nodes.
 */
export class LmdbWorkerConfig<T = void> implements WorkerConfig<T, BlocksDb, SerializedStatesDb> {
  static new<T>({
    nodeName,
    chainSpec,
    workerParams,
    dbPath,
    blake2b,
    ports = new Map(),
    ephemeral = false,
  }: {
    nodeName: string;
    chainSpec: ChainSpec;
    workerParams: T;
    dbPath: string;
    blake2b: Blake2b;
    ports?: Map<string, ThreadPort>;
    ephemeral?: boolean;
  }) {
    return new LmdbWorkerConfig(nodeName, chainSpec, workerParams, dbPath, blake2b, ports, ephemeral);
  }

  /** Restore node config from a transferable config object. */
  static async fromTransferable<T>(decodeParams: Decode<T>, config: TransferableConfig) {
    if (config.databaseBackend !== "lmdb") {
      throw new Error(`Expected lmdb worker config, got ${config.databaseBackend}.`);
    }
    const { blake2b, chainSpec, workerParams, ports } = await decodeTransferableConfig(decodeParams, config);

    return LmdbWorkerConfig.new({
      nodeName: config.nodeName,
      chainSpec,
      workerParams,
      dbPath: config.dbPath,
      blake2b,
      ports,
    });
  }

  private constructor(
    public readonly nodeName: string,
    public readonly chainSpec: ChainSpec,
    public readonly workerParams: T,
    public readonly dbPath: string,
    public readonly blake2b: Blake2b,
    public readonly ports: Map<string, ThreadPort>,
    // When set, the underlying database skips fsync. Only safe for throwaway
    // databases (the fuzz target wipes on reset). Not transferred to worker
    // threads, so the durable main node path always gets the default.
    public readonly ephemeral: boolean = false,
  ) {}

  async openDatabase(
    options: { readonly: boolean } = { readonly: true },
  ): Promise<RootDb<BlocksDb, SerializedStatesDb>> {
    const lmdb = LmdbRoot.new(this.dbPath, {
      readOnly: options.readonly,
      ephemeral: this.ephemeral,
    });

    return {
      getBlocksDb: () => LmdbBlocks.new(this.chainSpec, lmdb),
      getStatesDb: () => LmdbStates.new(this.chainSpec, this.blake2b, lmdb),
      close: async () => await lmdb.close(),
    };
  }

  /** Convert this config into a thread-transferable object. */
  intoTransferable(paramsCodec: Encode<T>): TransferableConfig {
    return {
      databaseBackend: "lmdb",
      nodeName: this.nodeName,
      chainSpec: this.chainSpec,
      workerParams: Encoder.encodeObject(paramsCodec, this.workerParams, this.chainSpec).raw,
      dbPath: this.dbPath,
      workerPorts: Array.from(this.ports.entries()).map(([name, port]) => [name, port.intoTransferable()]),
    };
  }
}

```

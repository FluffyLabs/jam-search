---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L1-L114
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 2
content_sha: b0a3dabc82a08d7821a6291869304d08ceb581389686f75cd8f0c11dde15987b
language: typescript
---
`packages/workers/api-node/config.ts` (lines 1–114)

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
import { LmdbBlocks, LmdbRoot, LmdbStates } from "@typeberry/database-lmdb";
import { Blake2b } from "@typeberry/hash";
import type { WorkerConfig } from "@typeberry/workers-api";
import { ThreadPort, type TransferablePort } from "./port.js";

/** A worker config that's usable in node.js and uses LMDB database backend. */
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
    const blake2b = await Blake2b.createHasher();
    const chainSpec = ChainSpec.new(config.chainSpec);
    const workerParams = Decoder.decodeObject(decodeParams, config.workerParams, chainSpec);
    const ports = new Map(
      config.workerPorts.map(([name, port]) => [name, ThreadPort.fromTransferable(chainSpec, port)]),
    );

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
    // When set, the underlying LMDB skips fsync and compression. Only safe for
    // throwaway databases (the fuzz target wipes on reset). Not transferred to
    // worker threads, so the durable main node path always gets the default.
    public readonly ephemeral: boolean = false,
  ) {}

  openDatabase(options: { readonly: boolean } = { readonly: true }): RootDb<BlocksDb, SerializedStatesDb> {
    const lmdb = LmdbRoot.new(this.dbPath, options.readonly, this.ephemeral);

    return {
      getBlocksDb: () => LmdbBlocks.new(this.chainSpec, lmdb),
      getStatesDb: () => LmdbStates.new(this.chainSpec, this.blake2b, lmdb),
      close: async () => await lmdb.close(),
    };
  }

  /** Convert this config into a thread-transferable object. */
  intoTransferable(paramsCodec: Encode<T>): TransferableConfig {
    return {
      nodeName: this.nodeName,
      chainSpec: this.chainSpec,
      workerParams: Encoder.encodeObject(paramsCodec, this.workerParams, this.chainSpec).raw,
      dbPath: this.dbPath,
      workerPorts: Array.from(this.ports.entries()).map(([name, port]) => [name, port.intoTransferable()]),
    };
  }
}

/** Config that's safe to transfer between worker threads. */
export type TransferableConfig = {
  nodeName: string;
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
```

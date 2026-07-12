---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/config.ts#L1-L128
title: packages/workers/api-node/config.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 3
content_sha: dbe308f961f16fea793616ad9059082e4a07b3dcdc0f8e1e66d9fa46510f5d84
language: typescript
---
`packages/workers/api-node/config.ts` (lines 1–128)

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
import { Blake2b } from "@typeberry/hash";
import type { WorkerConfig } from "@typeberry/workers-api";
import { ThreadPort, type TransferablePort } from "./port.js";

// Re-exported so the fuzz target can open one keyspace per run and reuse it
// across resets.
export { FjallRoot, FjallValuesSession };

/** Persistent regular-node backend. */
export type PersistentBackend = "fjall";

/** Transferable worker config for persistent regular-node workers. */
export type PersistentWorkerConfig<T> = FjallWorkerConfig<T>;

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
    sharedFjallKeyspace,
  }: {
    nodeName: string;
    chainSpec: ChainSpec;
    workerParams: T;
    dbPath: string;
    blake2b: Blake2b;
    ports?: Map<string, ThreadPort>;
    ephemeral?: boolean;
    cacheSizeBytes?: number;
    sharedFjallKeyspace?: FjallRoot;
  }) {
    return new FjallWorkerConfig(
      nodeName,
      chainSpec,
      workerParams,
      dbPath,
      blake2b,
      ports,
      ephemeral,
      cacheSizeBytes,
      sharedFjallKeyspace,
    );
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
    private readonly sharedFjallKeyspace: FjallRoot | undefined = undefined,
  ) {}

  async openDatabase(
    options: { readonly: boolean } = { readonly: true },
  ): Promise<RootDb<BlocksDb, SerializedStatesDb>> {
    if (this.sharedFjallKeyspace !== undefined && options.readonly) {
      throw new Error("Cannot open a read-only fjall database from a shared writable keyspace.");
    }
    const fjall =
      this.sharedFjallKeyspace ??
      (await FjallRoot.open(this.dbPath, {
        readOnly: options.readonly,
        ephemeral: this.ephemeral,
        cacheSizeBytes: this.cacheSizeBytes,
      }));
    const ownsFjall = this.sharedFjallKeyspace === undefined;
    let blocks: FjallBlocks | null = null;
    let states: FjallStates | null = null;
    try {
      [blocks, states] = await Promise.all([
        FjallBlocks.open(this.chainSpec, fjall),
        FjallStates.open(this.chainSpec, this.blake2b, fjall),
      ]);
    } catch (e) {
      if (ownsFjall) {
        await fjall.close();
      }
      throw e;
    }

    return {
      getBlocksDb: () => {
```

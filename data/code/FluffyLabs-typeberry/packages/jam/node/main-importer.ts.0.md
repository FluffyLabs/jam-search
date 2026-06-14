---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-importer.ts#L1-L100
title: packages/jam/node/main-importer.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 2
content_sha: 373ea90486c4a6317803811e8a20a821cbe208282bdcd5b0a69e0d4c54b1ca13
language: typescript
---
`packages/jam/node/main-importer.ts` (lines 1–100)

```typescript
import type { BlockView, HeaderHash, StateRootHash } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { PvmBackend } from "@typeberry/config";
import { KnownChainSpec } from "@typeberry/config-node";
import { bandersnatch, initWasm } from "@typeberry/crypto";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import { createImporter, ImporterConfig } from "@typeberry/importer";
import { tryAsU16 } from "@typeberry/numbers";
import { CURRENT_SUITE, CURRENT_VERSION, Result, resultToString, version } from "@typeberry/utils";
import { HybridWorkerConfig, InMemWorkerConfig, LmdbWorkerConfig } from "@typeberry/workers-api-node";
import { getChainSpec, getDatabasePath, initializeDatabase, logger } from "./common.js";
import type { JamConfig } from "./jam-config.js";
import type { NodeApi } from "./main.js";

const zeroHash = Bytes.zero(HASH_SIZE).asOpaque<StateRootHash>();

export type StateBackend = "lmdb" | "lmdb-hybrid" | "fjall-hybrid";

export type ImporterOptions = {
  initGenesisFromAncestry?: boolean;
  dummyFinalityDepth?: number;
  pruneBlocks?: boolean;
  /** Open the database without fsync/compression. Only safe for throwaway dbs (e.g. fuzzing). */
  ephemeral?: boolean;
  /**
   * Persistent backend to use when `databaseBasePath` is set. Defaults to full LMDB.
   */
  stateBackend?: StateBackend;
};

export async function mainImporter(
  config: JamConfig,
  withRelPath: (v: string) => string,
  options: ImporterOptions = {},
): Promise<NodeApi> {
  await initWasm();
  const bandesnatchNative = bandersnatch.checkNativeBindings();

  logger.info`🫐 Typeberry ${version}. GP: ${CURRENT_VERSION} (${CURRENT_SUITE})`;
  logger.info`🎸 Starting importer: ${config.nodeName}.`;
  logger.info`🖥️ PVM Backend: ${PvmBackend[config.pvmBackend]}.`;
  logger.info`🐇 Bandersnatch ${bandesnatchNative.isOk ? "native 🚀" : `using wasm: ${bandesnatchNative.error}`}`;

  // Single source of truth for the states db backend: drives both the log line
  // below and the worker config picked further down.
  const dbBackend = config.node.databaseBasePath === undefined ? "in-memory" : (options.stateBackend ?? "lmdb");
  logger.info`🗄️ States DB: ${dbBackend}.`;

  const chainSpec = getChainSpec(config.node.flavor);
  const blake2b = await Blake2b.createHasher();
  const nodeName = config.nodeName;

  const { dbPath, genesisHeaderHash } = getDatabasePath(
    blake2b,
    config.nodeName,
    config.node.chainSpec.genesisHeader,
    withRelPath(config.node.databaseBasePath ?? "<in-memory>"),
  );

  const workerParams = ImporterConfig.create({
    pvm: config.pvmBackend,
    dummyFinalityDepth: tryAsU16(options.dummyFinalityDepth ?? 0),
    pruneBlocks: options.pruneBlocks ?? false,
  });

  const ephemeral = options.ephemeral ?? false;
  // enable compression when running full test suite
  const compression = ephemeral && config.node.flavor === KnownChainSpec.Full;
  const workerConfig =
    dbBackend === "in-memory"
      ? InMemWorkerConfig.new({
          nodeName,
          chainSpec,
          blake2b,
          workerParams,
        })
      : dbBackend === "lmdb-hybrid" || dbBackend === "fjall-hybrid"
        ? await HybridWorkerConfig.new({
            nodeName,
            chainSpec,
            blake2b,
            dbPath,
            workerParams,
            ephemeral,
            compression,
            backend: dbBackend === "lmdb-hybrid" ? "lmdb" : "fjall",
          })
        : LmdbWorkerConfig.new({
            nodeName,
            chainSpec,
            blake2b,
            dbPath,
            workerParams,
            ephemeral,
          });

  // Initialize the database with genesis state and block if there isn't one.
  logger.info`🛢️ Opening database at ${dbPath}`;
  const rootDb = workerConfig.openDatabase({ readonly: false });
  await initializeDatabase(chainSpec, blake2b, genesisHeaderHash, rootDb, config.node.chainSpec, config.ancestry, {
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main.ts#L1-L95
title: packages/jam/node/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 4
content_sha: b47af046a125662ca01a398b25943c78048760d223a690b2614701df0f24cee9
language: typescript
---
`packages/jam/node/main.ts` (lines 1–95)

```typescript
import { isMainThread } from "node:worker_threads";
import type { BlockView, HeaderHash, HeaderView, StateRootHash } from "@typeberry/block";
import { AUTHORSHIP_NETWORK_PORT } from "@typeberry/comms-authorship-network";
import { type ChainSpec, PvmBackend } from "@typeberry/config";
import { initWasm } from "@typeberry/crypto";
import {
  type BandersnatchSecretSeed,
  deriveBandersnatchSecretKey,
  deriveEd25519SecretKey,
  type Ed25519SecretSeed,
  trivialSeed,
} from "@typeberry/crypto/key-derivation.js";
import type { BlocksDb, RootDb, SerializedStatesDb } from "@typeberry/database";
import { Blake2b, type WithHash } from "@typeberry/hash";
import { type ImporterApi, ImporterConfig } from "@typeberry/importer";
import { NetworkingConfig } from "@typeberry/jam-network";
import { Listener } from "@typeberry/listener";
import { tryAsU16, tryAsU32 } from "@typeberry/numbers";
import type { StateEntries } from "@typeberry/state-merkleization";
import type { Telemetry } from "@typeberry/telemetry";
import { CURRENT_SUITE, CURRENT_VERSION, Result, version } from "@typeberry/utils";
import { DirectPort, DirectWorkerConfig } from "@typeberry/workers-api";
import { InMemWorkerConfig, LmdbWorkerConfig, logHostEnvironment, ThreadPort } from "@typeberry/workers-api-node";
import { getChainSpec, getDatabasePath, initializeDatabase, logger } from "./common.js";
import { initializeExtensions } from "./extensions.js";
import type { JamConfig, NetworkConfig } from "./jam-config.js";
import * as metrics from "./metrics.js";
import {
  spawnBlockGeneratorWorker,
  spawnImporterWorker,
  spawnNetworkWorker,
  startBlockGenerator,
  startImporterDirect,
  startNetwork,
} from "./workers.js";

export type NodeApi = {
  chainSpec: ChainSpec;
  getStateEntries(hash: HeaderHash): Promise<StateEntries | null>;
  importBlock(block: BlockView): Promise<Result<StateRootHash, string>>;
  getBestStateRootHash(): Promise<StateRootHash>;
  close(): Promise<void>;
};

export async function main(
  config: JamConfig,
  withRelPath: (v: string) => string,
  telemetry: Telemetry | null,
): Promise<NodeApi> {
  if (!isMainThread) {
    throw new Error("The main binary cannot be running as a Worker!");
  }

  await initWasm();

  const nodeMetrics = metrics.createMetrics();

  logger.info`🫐 Typeberry ${version}. GP: ${CURRENT_VERSION} (${CURRENT_SUITE})`;
  logger.info`🎸 Starting node: ${config.nodeName}.`;
  logger.info`🖥️ PVM Backend: ${PvmBackend[config.pvmBackend]}.`;
  logHostEnvironment(logger);
  const chainSpec = getChainSpec(config.node.flavor);
  const blake2b = await Blake2b.createHasher();
  const nodeName = config.nodeName;
  const isInMemory = config.node.databaseBasePath === undefined;
  logger.info`🗄️ States DB: ${isInMemory ? "in-memory" : "lmdb"}.`;

  const { dbPath, genesisHeaderHash } = getDatabasePath(
    blake2b,
    nodeName,
    config.node.chainSpec.genesisHeader,
    withRelPath(config.node.databaseBasePath ?? "<in-memory>"),
  );

  const baseConfig = { nodeName, chainSpec, blake2b, dbPath };
  const importerParams = {
    ...baseConfig,
    workerParams: ImporterConfig.create({
      pvm: config.pvmBackend,
      dummyFinalityDepth: tryAsU16(config.devValidatorIndex !== null ? 100 : 0),
      pruneBlocks: false,
    }),
  };

  const importerConfig = isInMemory
    ? { isInMemory, config: InMemWorkerConfig.new(importerParams) }
    : { isInMemory, config: LmdbWorkerConfig.new(importerParams) };

  // Initialize the database with genesis state and block if there isn't one.
  logger.info`🛢️ Opening database at ${dbPath}`;
  const rootDb = importerConfig.config.openDatabase({ readonly: false });
  await initializeDatabase(chainSpec, blake2b, genesisHeaderHash, rootDb, config.node.chainSpec, config.ancestry);
  // NOTE [ToDr] even though, we should be closing the database here,
  // it seems that opening it in the main thread for writing, and later
  // in the importer thread, causes issues. Everything works fine though,
```

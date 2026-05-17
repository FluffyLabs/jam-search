---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/main.ts#L1-L107
title: packages/workers/importer/main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: ee17874b07d3046f2a5a5f76d52031e31504c07ceee708a0b807d507dad9ce5d
language: typescript
---
`packages/workers/importer/main.ts` (lines 1–107)

```typescript
import { initWasm } from "@typeberry/crypto";
import type { BlocksDb, LeafDb, StatesDb } from "@typeberry/database";
import { Blake2b, keccak, ZERO_HASH } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import type { SerializedState } from "@typeberry/state-merkleization";
import { TransitionHasher } from "@typeberry/transition";
import { Result, resultToString } from "@typeberry/utils";
import type { WorkerConfig } from "@typeberry/workers-api";
import { DummyFinalizer } from "./finality.js";
import { Importer } from "./importer.js";
import type { ImporterConfig, ImporterInternal } from "./protocol.js";

const logger = Logger.new(import.meta.filename, "importer");
const keccakHasher = keccak.KeccakHasher.create();
const blake2b = Blake2b.createHasher();

export type Config = WorkerConfig<ImporterConfig, BlocksDb, StatesDb<SerializedState<LeafDb>>>;

export type CreateImporterOptions = {
  initGenesisFromAncestry?: boolean;
};

export async function createImporter(
  config: Config,
  options: CreateImporterOptions = {},
): Promise<{
  importer: Importer;
  db: ReturnType<Config["openDatabase"]>;
}> {
  const chainSpec = config.chainSpec;
  const db = config.openDatabase({ readonly: false });
  const pvm = config.workerParams.pvm;
  const blocks = db.getBlocksDb();
  const states = db.getStatesDb();

  const dummyFinalityDepth = config.workerParams.dummyFinalityDepth ?? 0;
  const finalizer = dummyFinalityDepth > 0 ? DummyFinalizer.create(blocks, dummyFinalityDepth) : undefined;
  const pruneBlocks = config.workerParams.pruneBlocks ?? false;

  const hasher = TransitionHasher.new(await keccakHasher, await blake2b);
  const importer = Importer.open({
    spec: chainSpec,
    pvm,
    hasher,
    logger,
    blocks,
    states,
    options: {
      ...options,
      finalizer,
      pruneBlocks,
    },
  });

  return {
    importer,
    db,
  };
}

/**
 * The `BlockImporter` listens to `block` signals, where it expects
 * RAW undecoded block objects (typically coming from the network).
 *
 * These blocks should be decoded, verified and later imported.
 */
export async function main(config: Config, comms: ImporterInternal) {
  const wasmPromise = initWasm();
  logger.info`📥 Importer starting`;

  const { importer, db } = await createImporter(config);

  const finishPromise = new Promise<void>((resolve) => {
    comms.setOnFinish(async () => resolve());
  });

  comms.setOnImportBlock(async (block) => {
    const res = await importer.importBlock(block);
    if (res.isError) {
      const errMsg = resultToString(res);
      return Result.error(errMsg, () => errMsg);
    }

    await comms.sendBestHeaderAnnouncement(res.ok);

    return Result.ok(res.ok.hash);
  });

  comms.setOnGetStateEntries(async (headerHash) => {
    return importer.getStateEntries(headerHash);
  });

  comms.setOnGetBestStateRootHash(async () => {
    return importer.getBestStateRootHash() ?? ZERO_HASH.asOpaque();
  });

  await wasmPromise;
  logger.info`📥 Importer waiting for blocks.`;

  // await finish signal
  await finishPromise;
  await importer.close();
  logger.info`📥 Importer finished. Closing channel.`;
  await db.close();
  comms.destroy();
  logger.info`📥 Importer 🪦`;
}
```

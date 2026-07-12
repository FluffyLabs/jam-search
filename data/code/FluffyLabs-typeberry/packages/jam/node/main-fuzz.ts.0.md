---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/node/main-fuzz.ts#L1-L94
title: packages/jam/node/main-fuzz.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 4
content_sha: aa0e5db64a3ba059a2c5fce1a86778d6a2c9821c7e35f33ce7b8860a57b63404
language: typescript
---
`packages/jam/node/main-fuzz.ts` (lines 1–94)

```typescript
import { rm } from "node:fs/promises";
import { type BlockView, Header, type HeaderHash, type StateRootHash, type TimeSlot } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { Encoder } from "@typeberry/codec";
import { PvmBackend } from "@typeberry/config";
import { type FuzzVersion, startFuzzTarget } from "@typeberry/ext-ipc";
import { v1 as fuzzV1 } from "@typeberry/fuzz-proto";
import { HASH_SIZE } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import type { StateEntries } from "@typeberry/state-merkleization";
import { type Closer, CURRENT_VERSION, Result, version } from "@typeberry/utils";
import { FjallRoot, logHostEnvironment } from "@typeberry/workers-api-node";
import { getChainSpec } from "./common.js";
import type { JamConfig } from "./jam-config.js";
import type { NodeApi } from "./main.js";
import { mainImporter, type StateBackend } from "./main-importer.js";

export type FuzzConfig = {
  version: FuzzVersion;
  jamNodeConfig: JamConfig;
  socket: string | null;
  initGenesisFromAncestry: boolean;
};

const logger = Logger.new(import.meta.filename, "fuzztarget");

/** Dedicated subdirectory under the configured base path that the fuzzer owns and wipes. */
const FUZZ_DB_SUBDIR = "typeberry-fuzz-db";

const FUZZ_DB_FJALL: StateBackend = "fjall-hybrid";
const FUZZ_DB_OPTIONS: string[] = [FUZZ_DB_FJALL, "fjall"];

/** The partitions used by FjallBlocks and FjallStates in the full-fjall backend. */
const FUZZ_FJALL_PARTITIONS = ["headers", "extrinsics", "postStateRoots", "states", "values"] as const;
/**
 * Size of the fjall block-cache for the fuzz session. The keyspace stays open
 * across resets, so this cache is what keeps the resident memory bounded.
 */
const FUZZ_FJALL_CACHE_BYTES = 128 * 1024 * 1024;
/** Rebuild reused fjall keyspaces every N resets to limit LSM write/read amplification. */
const REBUILD_FJALL_KEYSPACE_EVERY = 50;

/**
 * Resolve the directory the fuzzer should use for its on-disk database, or
 * `undefined` for an in-memory database. The dedicated `FUZZ_DB_SUBDIR` is
 * appended so we only ever wipe a directory the fuzzer owns, never the base
 * path the harness handed us.
 *
 * The empty / "undefined" guards are defensive: the env flow already normalizes via fuzzDatabaseBasePath,
 * but the CLI fuzz-target path can set databaseBasePath directly without going through fuzz-env's normalization.
 */
export function resolveFuzzDbBase(configured: string | undefined): string | undefined {
  if (configured === undefined) {
    return undefined;
  }
  const trimmed = configured.trim();
  if (trimmed === "" || trimmed.toLowerCase() === "undefined") {
    return undefined;
  }
  return `${trimmed}/${FUZZ_DB_SUBDIR}`;
}

/** Recursively remove the fuzzer's database directory. No-op if it is absent. */
export async function wipeFuzzDb(base: string): Promise<void> {
  await rm(base, { recursive: true, force: true });
}

export function getFuzzDetails() {
  return {
    nodeName: "@typeberry/jam",
    nodeVersion: fuzzV1.Version.tryFromString(version),
    gpVersion: fuzzV1.Version.tryFromString(CURRENT_VERSION),
  };
}

export async function mainFuzz(fuzzConfig: FuzzConfig, withRelPath: (v: string) => string): Promise<{ close: Closer }> {
  logger.info`💨 Fuzzer V${fuzzConfig.version} starting up.`;
  logger.info`🖥️ PVM Backend: ${PvmBackend[fuzzConfig.jamNodeConfig.pvmBackend]}.`;
  logHostEnvironment(logger);

  const { jamNodeConfig: config } = fuzzConfig;

  const fuzzDbBase = resolveFuzzDbBase(config.node.databaseBasePath);

  const rawFuzzDb = process.env.JAM_FUZZ_DB?.trim() ?? "";
  const hybridStateBackend = rawFuzzDb === "" ? FUZZ_DB_FJALL : rawFuzzDb;
  if (!isValidStateBackend(hybridStateBackend)) {
    throw new Error(`JAM_FUZZ_DB must be one of: ${FUZZ_DB_OPTIONS} (got: "${rawFuzzDb}").`);
  }
  if (fuzzDbBase !== undefined) {
    logger.info`🗄️ Fuzz persistent backend: ${hybridStateBackend}.`;
  }

  let runningNode: NodeApi | null = null;
```

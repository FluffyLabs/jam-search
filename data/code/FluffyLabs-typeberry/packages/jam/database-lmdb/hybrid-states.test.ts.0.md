---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/hybrid-states.test.ts#L1-L115
title: packages/jam/database-lmdb/hybrid-states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 2
content_sha: cf4cf896d19b9b3885745af392cffe6d0200490694a7cd761cd405d7d8b1765f
language: typescript
---
`packages/jam/database-lmdb/hybrid-states.test.ts` (lines 1–115)

```typescript
// packages/jam/database-lmdb/hybrid-states.test.ts
import assert from "node:assert";
import * as fs from "node:fs";
import { afterEach, before, beforeEach, describe, it } from "node:test";
import { type HeaderHash, tryAsServiceId } from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { tinyChainSpec } from "@typeberry/config";
import type { LeafDb } from "@typeberry/database";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
import {
  InMemoryState,
  type ServicesUpdate,
  type State,
  StorageItem,
  type StorageKey,
  UpdateStorage,
} from "@typeberry/state";
import { testState } from "@typeberry/state/test.utils.js";
import { type SerializedState, StateEntries, type StateKey } from "@typeberry/state-merkleization";
import { asOpaqueType, deepEqual, OK, Result } from "@typeberry/utils";
import { HybridSerializedStates } from "./hybrid-states.js";

let blake2b: Blake2b;
before(async () => {
  blake2b = await Blake2b.createHasher();
});

function createTempDir(suffix = "hybrid"): string {
  return fs.mkdtempSync(`typeberry-${suffix}`);
}

describe("Hybrid serialized states", () => {
  const spec = tinyChainSpec;
  const headerHash: HeaderHash = Bytes.zero(HASH_SIZE).asOpaque();
  let dbPath = "";

  beforeEach(() => {
    dbPath = createTempDir();
  });
  afterEach(() => {
    fs.rmSync(dbPath, { recursive: true });
  });

  it("round-trips an initial state through the on-disk values store", async () => {
    const states = HybridSerializedStates.new({
      spec,
      blake2b,
      dbPath,
    });
    try {
      const empty = InMemoryState.empty(spec);
      const serialized = StateEntries.serializeInMemory(spec, blake2b, empty);
      const expectedRoot = serialized.getRootHash(blake2b);

      const res = await states.insertInitialState(headerHash, serialized);
      deepEqual(res, Result.ok(OK));

      const state = states.getState(headerHash);
      assert.ok(state !== null);
      const stateRoot = await states.getStateRoot(state);
      assert.strictEqual(`${stateRoot}`, `${expectedRoot}`);
      deepEqual(InMemoryState.copyFrom(spec, state, new Map()), empty);
    } finally {
      await states.close();
    }
  });

  it("reads large values back from disk", async () => {
    const states = HybridSerializedStates.new({ spec, blake2b, dbPath });
    try {
      // > 32 bytes => stored in the values db (not embedded in the leaf).
      const big1 = BytesBlob.blobFromString("x".repeat(100));
      const big2 = BytesBlob.blobFromString("y".repeat(100));
      const key1: StateKey = Bytes.fill(HASH_SIZE, 1).asOpaque();
      const key2: StateKey = Bytes.fill(HASH_SIZE, 2).asOpaque();
      const entries = StateEntries.fromEntriesUnsafe([
        [key1, big1],
        [key2, big2],
      ]);

      const res = await states.insertInitialState(headerHash, entries);
      deepEqual(res, Result.ok(OK));

      const state = states.getState(headerHash);
      assert.ok(state !== null);
      assert.strictEqual(`${state.backend.get(key2)}`, `${big2}`);
      assert.strictEqual(`${state.backend.get(key1)}`, `${big1}`);
    } finally {
      await states.close();
    }
  });

  it("drops the leaf set on markUnused while values stay on disk", async () => {
    const states = HybridSerializedStates.new({ spec, blake2b, dbPath });
    try {
      const empty = InMemoryState.empty(spec);
      const serialized = StateEntries.serializeInMemory(spec, blake2b, empty);
      await states.insertInitialState(headerHash, serialized);
      assert.ok(states.getState(headerHash) !== null);

      states.markUnused(headerHash);
      assert.strictEqual(states.getState(headerHash), null);
    } finally {
      await states.close();
    }
  });
});

function hh(n: number): HeaderHash {
  return Bytes.fill(HASH_SIZE, n).asOpaque();
}

const storageKey: StorageKey = asOpaqueType(BytesBlob.blobFromString("test-key"));

/** A state update writing a single large (non-embedded) value under `storageKey`. */
```

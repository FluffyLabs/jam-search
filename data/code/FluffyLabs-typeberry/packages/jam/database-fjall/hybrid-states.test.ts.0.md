---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.test.ts#L1-L101
title: packages/jam/database-fjall/hybrid-states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 3
content_sha: ac05101ca271f8cabfbbf2f719732ed561d55feee6bc16060baf0045a251d0cf
language: typescript
---
`packages/jam/database-fjall/hybrid-states.test.ts` (lines 1–101)

```typescript
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
import { FjallValuesSession, HybridSerializedStates } from "./hybrid-states.js";

let blake2b: Blake2b;
before(async () => {
  blake2b = await Blake2b.createHasher();
});

function createTempDir(suffix = "fjall-hybrid"): string {
  return fs.mkdtempSync(`typeberry-${suffix}`);
}

describe("Fjall hybrid serialized states", () => {
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
    const states = await HybridSerializedStates.new({ spec, blake2b, dbPath });
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
    const states = await HybridSerializedStates.new({ spec, blake2b, dbPath });
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

  it("shares an open values session across resets without closing it", async () => {
    // The fuzz reset path opens the values keyspace once per session and reuses
    // it: each "reset" builds a fresh states instance sharing that session, and
    // closing a session-backed states must NOT close the shared keyspace.
    const session = await FjallValuesSession.open(dbPath);
    try {
      const big = BytesBlob.blobFromString("z".repeat(100));
      const key: StateKey = Bytes.fill(HASH_SIZE, 7).asOpaque();
      const entries = StateEntries.fromEntriesUnsafe([[key, big]]);

      // First "reset": write values through a states instance, then close it.
      const first = HybridSerializedStates.fromSession(spec, blake2b, session);
      const res = await first.insertInitialState(headerHash, entries);
      deepEqual(res, Result.ok(OK));
```

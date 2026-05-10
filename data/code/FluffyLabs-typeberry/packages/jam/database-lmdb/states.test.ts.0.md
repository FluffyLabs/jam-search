---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/states.test.ts#L1-L112
title: packages/jam/database-lmdb/states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 3
content_sha: e41d4b914310380b2486e80a2db07c6caca686c2b9d78c31f412a2bb417d3a64
language: typescript
---
`packages/jam/database-lmdb/states.test.ts` (lines 1–112)

```typescript
import assert from "node:assert";
import * as fs from "node:fs";
import { afterEach, before, beforeEach, describe, it } from "node:test";
import { type HeaderHash, tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { SortedSet } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE, type OpaqueHash } from "@typeberry/hash";
import { tryAsU32, tryAsU64 } from "@typeberry/numbers";
import {
  InMemoryState,
  LookupHistoryItem,
  PrivilegedServices,
  ServiceAccountInfo,
  tryAsLookupHistorySlots,
  tryAsPerCore,
  UpdateService,
} from "@typeberry/state";
import { testState } from "@typeberry/state/test.utils.js";
import { StateEntries } from "@typeberry/state-merkleization";
import { InMemoryTrie, leafComparator } from "@typeberry/trie";
import { getBlake2bTrieHasher } from "@typeberry/trie/hasher.js";
import type { TrieHasher } from "@typeberry/trie/nodesDb.js";
import { deepEqual, OK, Result } from "@typeberry/utils";
import { LmdbRoot } from "./root.js";
import { LmdbStates } from "./states.js";

let blake2bTrieHasher: TrieHasher;
let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
  blake2bTrieHasher = getBlake2bTrieHasher(blake2b);
});

function createTempDir(suffix = "lmdb"): string {
  return fs.mkdtempSync(`typeberry-${suffix}`);
}

describe("LMDB States database", () => {
  let tmpDir = "";
  beforeEach(() => {
    tmpDir = createTempDir();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, {
      recursive: true,
    });
  });

  const headerHash: HeaderHash = Bytes.zero(HASH_SIZE).asOpaque();
  const spec = tinyChainSpec;

  it("should import state and read state", async () => {
    const root = LmdbRoot.new(tmpDir);
    const states = LmdbStates.new(spec, blake2b, root);

    try {
      const emptyState = InMemoryState.empty(spec);
      const serialized = StateEntries.serializeInMemory(spec, blake2b, emptyState);
      const emptyRoot = serialized.getRootHash(blake2b);

      // when
      const res = await states.insertInitialState(headerHash, serialized);
      deepEqual(res, Result.ok(OK));
      const newState = states.getState(headerHash);
      assert.ok(newState !== null);
      const newRoot = await states.getStateRoot(newState);

      assert.deepStrictEqual(`${newRoot}`, `${emptyRoot}`);
      deepEqual(InMemoryState.copyFrom(spec, newState, new Map()), emptyState);
    } finally {
      await states.close();
      await root.close();
    }
  });

  it("should update the state", async () => {
    const root = LmdbRoot.new(tmpDir);
    const states = LmdbStates.new(spec, blake2b, root);

    try {
      const state = InMemoryState.empty(spec);
      await states.insertInitialState(headerHash, StateEntries.serializeInMemory(spec, blake2b, state));
      const newState = states.getState(headerHash);
      assert.ok(newState !== null);
      const headerHash2: HeaderHash = Bytes.fill(HASH_SIZE, 2).asOpaque();

      const lookupHistory = LookupHistoryItem.new(
        Bytes.fill(HASH_SIZE, 0xff).asOpaque(),
        tryAsU32(5),
        tryAsLookupHistorySlots([]),
      );
      const stateUpdate = {
        timeslot: tryAsTimeSlot(15),
        privilegedServices: PrivilegedServices.create({
          manager: tryAsServiceId(1),
          assigners: tryAsPerCore(new Array(spec.coresCount).fill(tryAsServiceId(2)), spec),
          delegator: tryAsServiceId(3),
          registrar: tryAsServiceId(4),
          autoAccumulateServices: new Map(),
        }),
        updated: new Map([
          [
            tryAsServiceId(1),
            UpdateService.create({
              serviceInfo: ServiceAccountInfo.create({
                codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
                balance: tryAsU64(1_000_000),
                accumulateMinGas: tryAsServiceGas(10_000),
                onTransferMinGas: tryAsServiceGas(5_000),
```

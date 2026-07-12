---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/states.test.ts#L1-L105
title: packages/jam/database-fjall/states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 2
content_sha: e869afcbd5d5ac7f0c5bd78182ad0e0081b16e9934904faa2202b499c34fc954
language: typescript
---
`packages/jam/database-fjall/states.test.ts` (lines 1–105)

```typescript
import assert from "node:assert";
import * as fs from "node:fs";
import { afterEach, before, beforeEach, describe, it } from "node:test";
import { type HeaderHash, tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE } from "@typeberry/hash";
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
import { StateEntries, type StateKey } from "@typeberry/state-merkleization";
import { deepEqual, OK, Result } from "@typeberry/utils";
import { FjallRoot } from "./root.js";
import { FjallStates } from "./states.js";

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

describe("Fjall states database", () => {
  const headerHash: HeaderHash = Bytes.zero(HASH_SIZE).asOpaque();
  const spec = tinyChainSpec;
  let tmpDir = "";

  beforeEach(() => {
    tmpDir = fs.mkdtempSync("typeberry-fjall-states-");
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("imports and reads an empty state", async () => {
    const root = await FjallRoot.open(tmpDir, { ephemeral: true });
    const states = await FjallStates.open(spec, blake2b, root);
    try {
      const emptyState = InMemoryState.empty(spec);
      const serialized = StateEntries.serializeInMemory(spec, blake2b, emptyState);
      const emptyRoot = serialized.getRootHash(blake2b);

      deepEqual(await states.insertInitialState(headerHash, serialized), Result.ok(OK));
      const newState = states.getState(headerHash);
      assert.ok(newState !== null);

      assert.strictEqual(`${await states.getStateRoot(newState)}`, `${emptyRoot}`);
      deepEqual(InMemoryState.copyFrom(spec, newState, new Map()), emptyState);
    } finally {
      await states.close();
      await root.close();
    }
  });

  it("reads large values back from disk", async () => {
    const root = await FjallRoot.open(tmpDir, { ephemeral: true });
    const states = await FjallStates.open(spec, blake2b, root);
    try {
      const big1 = BytesBlob.blobFromString("x".repeat(100));
      const big2 = BytesBlob.blobFromString("y".repeat(100));
      const key1: StateKey = Bytes.fill(HASH_SIZE, 1).asOpaque();
      const key2: StateKey = Bytes.fill(HASH_SIZE, 2).asOpaque();
      const entries = StateEntries.fromEntriesUnsafe([
        [key1, big1],
        [key2, big2],
      ]);

      deepEqual(await states.insertInitialState(headerHash, entries), Result.ok(OK));
      const state = states.getState(headerHash);
      assert.ok(state !== null);
      assert.strictEqual(`${state.backend.get(key2)}`, `${big2}`);
      assert.strictEqual(`${state.backend.get(key1)}`, `${big1}`);
    } finally {
      await states.close();
      await root.close();
    }
  });

  it("updates state", async () => {
    const root = await FjallRoot.open(tmpDir, { ephemeral: true });
    const states = await FjallStates.open(spec, blake2b, root);
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
```

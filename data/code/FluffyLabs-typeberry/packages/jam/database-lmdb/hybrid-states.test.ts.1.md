---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-lmdb/hybrid-states.test.ts#L110-L208
title: packages/jam/database-lmdb/hybrid-states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 48a25b9da7974ebedcc219dcc777023a7279c267b2a5ec6984c299102aeb6810
language: typescript
---
`packages/jam/database-lmdb/hybrid-states.test.ts` (lines 110–208)

```typescript
  return Bytes.fill(HASH_SIZE, n).asOpaque();
}

const storageKey: StorageKey = asOpaqueType(BytesBlob.blobFromString("test-key"));

/** A state update writing a single large (non-embedded) value under `storageKey`. */
function storageUpdate(value: string): Partial<State & ServicesUpdate> {
  const item = StorageItem.create({ key: storageKey, value: BytesBlob.blobFromString(value) });
  return {
    storage: new Map([[tryAsServiceId(0), [UpdateStorage.set({ storage: item })]]]),
  };
}

// > 32 bytes => stored in the values db (not embedded in the leaf).
const BIG_1 = "a".repeat(100);
const BIG_2 = "b".repeat(100);

/** `true` if every value referenced by the state can still be resolved. */
function canReadFully(state: SerializedState<LeafDb> | null): boolean {
  if (state === null) {
    return false;
  }
  try {
    state.backend.intoStateEntries();
    return true;
  } catch {
    return false;
  }
}

/** Value removals are queued, so poll for the expected outcome. */
async function eventually(check: () => boolean, what: string, timeoutMs = 5_000): Promise<void> {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) {
      assert.fail(`Timed out waiting for: ${what}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 10));
  }
}

describe("Hybrid serialized states value refcounting", () => {
  const spec = tinyChainSpec;
  let dbPath = "";

  beforeEach(() => {
    dbPath = createTempDir();
  });
  afterEach(() => {
    fs.rmSync(dbPath, { recursive: true });
  });

  it("removes a replaced value from disk once the replacement finalizes", async () => {
    const states = HybridSerializedStates.new({ spec, blake2b, dbPath });
    try {
      await states.insertInitialState(hh(0), StateEntries.serializeInMemory(spec, blake2b, testState()));
      const s0 = states.getState(hh(0));
      assert.ok(s0 !== null);
      await states.updateAndSetState(hh(1), s0, storageUpdate(BIG_1));
      // a handle to the post-1 state, surviving the pruning below
      const stale1 = states.getState(hh(1));
      const s1 = states.getState(hh(1));
      assert.ok(s1 !== null);
      await states.updateAndSetState(hh(2), s1, storageUpdate(BIG_2));

      states.commitFinalized([hh(1)]);
      assert.ok(canReadFully(stale1), "still referenced by the finalized tip");

      states.commitFinalized([hh(2)]);
      await eventually(() => !canReadFully(stale1), "replaced value removed from lmdb");
      assert.ok(canReadFully(states.getState(hh(2))), "the new finalized tip stays fully readable");
    } finally {
      await states.close();
    }
  });

  it("collects values of a pruned dead fork and keeps the surviving chain intact", async () => {
    const states = HybridSerializedStates.new({ spec, blake2b, dbPath });
    try {
      await states.insertInitialState(hh(0), StateEntries.serializeInMemory(spec, blake2b, testState()));
      const s0 = states.getState(hh(0));
      assert.ok(s0 !== null);
      await states.updateAndSetState(hh(1), s0, storageUpdate(BIG_1));
      // a dead fork on top of genesis, inserting a different value
      const fork = states.getState(hh(0));
      assert.ok(fork !== null);
      await states.updateAndSetState(hh(0xaa), fork, storageUpdate(BIG_2));
      const staleFork = states.getState(hh(0xaa));

      states.markUnused(hh(0xaa));

      assert.strictEqual(states.getState(hh(0xaa)), null);
      await eventually(() => !canReadFully(staleFork), "fork-only value removed from lmdb");
      assert.ok(canReadFully(states.getState(hh(1))), "surviving chain is unaffected");
    } finally {
      await states.close();
    }
  });
});
```

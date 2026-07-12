---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.test.ts#L98-L206
title: packages/jam/database-fjall/hybrid-states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 5a214911086b1aadce22a43aa63621b9051b6e1bbbeea822e5a5208b0fb5e935
language: typescript
---
`packages/jam/database-fjall/hybrid-states.test.ts` (lines 98–206)

```typescript
      // First "reset": write values through a states instance, then close it.
      const first = HybridSerializedStates.fromSession(spec, blake2b, session);
      const res = await first.insertInitialState(headerHash, entries);
      deepEqual(res, Result.ok(OK));
      await first.close();

      // Second "reset": a fresh states sharing the same session. Its in-memory
      // leaf set is independent (empty until it inserts)...
      const second = HybridSerializedStates.fromSession(spec, blake2b, session);
      assert.strictEqual(second.getState(headerHash), null);

      // ...but the on-disk values store is the same one, still open and usable
      // (a closed keyspace would throw here).
      await second.insertInitialState(headerHash, entries);
      const state = second.getState(headerHash);
      assert.ok(state !== null);
      assert.strictEqual(`${state.backend.get(key)}`, `${big}`);
      await second.close();
    } finally {
      await session.close();
    }
  });

  it("drops the leaf set on markUnused while values stay on disk", async () => {
    const states = await HybridSerializedStates.new({ spec, blake2b, dbPath });
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

describe("Fjall hybrid serialized states value refcounting", () => {
  const spec = tinyChainSpec;
  let dbPath = "";

  beforeEach(() => {
    dbPath = createTempDir();
  });
  afterEach(() => {
    fs.rmSync(dbPath, { recursive: true });
  });

  it("removes a replaced value from disk once the replacement finalizes", async () => {
    const states = await HybridSerializedStates.new({ spec, blake2b, dbPath });
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
```

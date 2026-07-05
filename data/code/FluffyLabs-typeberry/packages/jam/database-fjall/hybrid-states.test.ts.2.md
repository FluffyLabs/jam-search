---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/hybrid-states.test.ts#L201-L236
title: packages/jam/database-fjall/hybrid-states.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: be322a6a4232e5ac680b1dabf88803c9a33e6f8cffa6535d77ee47c685ff7145
language: typescript
---
`packages/jam/database-fjall/hybrid-states.test.ts` (lines 201–236)

```typescript
      await states.updateAndSetState(hh(2), s1, storageUpdate(BIG_2));

      states.commitFinalized([hh(1)]);
      assert.ok(canReadFully(stale1), "still referenced by the finalized tip");

      states.commitFinalized([hh(2)]);
      await eventually(() => !canReadFully(stale1), "replaced value removed from fjall");
      assert.ok(canReadFully(states.getState(hh(2))), "the new finalized tip stays fully readable");
    } finally {
      await states.close();
    }
  });

  it("collects values of a pruned dead fork and keeps the surviving chain intact", async () => {
    const states = await HybridSerializedStates.new({ spec, blake2b, dbPath });
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
      await eventually(() => !canReadFully(staleFork), "fork-only value removed from fjall");
      assert.ok(canReadFully(states.getState(hh(1))), "surviving chain is unaffected");
    } finally {
      await states.close();
    }
  });
});
```

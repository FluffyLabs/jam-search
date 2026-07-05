---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L463-L511
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 5
chunk_total: 6
content_sha: 8c7a56843b066eeb4cb7f7690704ec2bfe0cac71715eb1f63696342aedeafc1d
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 463–511)

```typescript
      const result = finalizer.onBlockImported(orphan);
      assert.strictEqual(result, null);
    });

    it("should always advance finality forward, never re-finalizing earlier blocks", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // genesis -> 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> 7
      const chain = await buildLinearChain(db, genesis, 7);

      // First 4: no finality.
      for (let i = 0; i < 4; i++) {
        finalizer.onBlockImported(chain[i]);
      }

      // Block 5: chain length 5 > 4, finalize chain[2].
      const r1 = finalizer.onBlockImported(chain[4]);
      assertExists(r1);
      assert.strictEqual(r1.finalizedHash.isEqualTo(chain[2]), true);

      // Block 6: remaining chain length 2, not > 4. No finality.
      assert.strictEqual(finalizer.onBlockImported(chain[5]), null);

      // Block 7: chain length 3, not > 4. No finality.
      assert.strictEqual(finalizer.onBlockImported(chain[6]), null);
    });

    it("should work with depth=0", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      // depth=0 means finalize as soon as any block exists (2*0=0, length > 0).
      const finalizer = DummyFinalizer.create(db, 0);

      const b1 = await createBlock(db, genesis, 1);

      // Chain length = 1 > 0 → finalize block at index 1-1-0 = 0 → b1.
      // Genesis (prev finalized) is pruned.
      const result = finalizer.onBlockImported(b1);
      assertExists(result);
      assert.strictEqual(result.finalizedHash.isEqualTo(b1), true);
      assert.strictEqual(result.prunableStateHashes.length, 1);
      assert.ok(result.prunableStateHashes[0].isEqualTo(genesis));
    });
  });
});
```

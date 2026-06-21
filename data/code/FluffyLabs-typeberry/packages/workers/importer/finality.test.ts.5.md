---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L466-L493
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 5
chunk_total: 6
content_sha: fdd31dff3bebf726bacb5d5075f6e5065491a49d1da0317543e5100136c45ca9
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 466–493)

```typescript
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

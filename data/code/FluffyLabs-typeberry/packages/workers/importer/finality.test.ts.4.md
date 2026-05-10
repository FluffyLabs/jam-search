---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L380-L471
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 4
chunk_total: 5
content_sha: c07df66260ed9b1bb1a110306a715b9f79132523b8535c4512b9e8c410c91393
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 380–471)

```typescript
      // After finality of b1: unfinalized = [[b2, b3]].
      // Now F1's parent is b1 = lastFinalized, so it starts a new chain: [f1].
      // F2 extends it: [f1, f2]. F3 extends: [f1, f2, f3]. Length=3 > 2.
      // Finalize f1. Main chain [b2, b3] doesn't contain f1 → dead fork.
      const r = finalizer.onBlockImported(f3);
      assertExists(r);
      assert.strictEqual(r.finalizedHash.isEqualTo(f1), true);

      const pruned = r.prunableStateHashes.map((h) => h.toString());
      // Previous finalized (b1) is pruned, plus main chain [b2, b3] is dead.
      assert.ok(pruned.includes(b1.toString()), "B1 (prev finalized) should be pruned");
      assert.ok(pruned.includes(b2.toString()), "B2 should be pruned (dead fork)");
      assert.ok(pruned.includes(b3.toString()), "B3 should be pruned (dead fork)");
    });
  });

  describe("edge cases", () => {
    it("should return null for unknown block hash", async () => {
      const db = InMemoryBlocks.new();

      const finalizer = DummyFinalizer.create(db, 3);
      // Create a block hash that was never inserted into the db.
      const unknownHash = await createBlock(InMemoryBlocks.new(), db.getBestHeaderHash());
      const result = finalizer.onBlockImported(unknownHash);
      assert.strictEqual(result, null);
    });

    it("should return null for orphan block (parent not in any chain)", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Block whose parent is some unknown hash not in any chain.
      // We create a separate db to get a "foreign" hash, then insert the orphan
      // into our db with that foreign hash as parent.
      const foreignDb = InMemoryBlocks.new();
      const foreignParent = await createBlock(foreignDb, genesis, 99);

      const orphan = await createBlock(db, foreignParent, 50);

      const result = finalizer.onBlockImported(orphan);
      assert.strictEqual(result, null);
    });

    it("should always advance finality forward, never re-finalizing earlier blocks", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // genesis -> 1 -> 2 -> 3 -> 4
      const chain = await buildLinearChain(db, genesis, 4);

      finalizer.onBlockImported(chain[0]);
      finalizer.onBlockImported(chain[1]);

      // Block 3 finalizes block 1.
      const r1 = finalizer.onBlockImported(chain[2]);
      assertExists(r1);
      assert.strictEqual(r1.finalizedHash.isEqualTo(chain[0]), true);

      // Block 4 finalizes block 2. Block 1 (prev finalized) is pruned.
      const r2 = finalizer.onBlockImported(chain[3]);
      assertExists(r2);
      assert.strictEqual(r2.finalizedHash.isEqualTo(chain[1]), true);
      // Block 1 appears exactly once (as previous finalized, not re-finalized).
      const pruned = r2.prunableStateHashes.map((h) => h.toString());
      assert.strictEqual(pruned.filter((h) => h === chain[0].toString()).length, 1);
      // The newly finalized block (chain[1]) should NOT be pruned.
      assert.ok(!pruned.includes(chain[1].toString()), "Newly finalized block should not be pruned");
    });

    it("should work with depth=0", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      // depth=0 means finalize as soon as any block exists.
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

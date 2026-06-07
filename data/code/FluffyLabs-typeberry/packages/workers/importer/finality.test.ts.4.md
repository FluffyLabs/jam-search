---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L372-L470
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 4
chunk_total: 6
content_sha: 78271fba218e2467bd8d949a04681b954344d065cd5a59837d42fc658633157e
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 372–470)

```typescript
      assert.ok(pruned1.includes(genesis.toString()), "Genesis should be pruned");
      assert.ok(pruned1.includes(f1.toString()), "F1 should be pruned");
      assert.ok(pruned1.includes(f2.toString()), "F2 should be pruned");
    });

    it("should handle fork from the middle of a chain", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Main: genesis -> 1 -> 2 -> 3 -> 4
      const b1 = await createBlock(db, genesis, 1);
      const b2 = await createBlock(db, b1, 2);
      const b3 = await createBlock(db, b2, 3);
      const b4 = await createBlock(db, b3, 4);

      // Fork from block 2: 2 -> F1 -> F2 -> F3
      const f1 = await createBlock(db, b2, 10);
      const f2 = await createBlock(db, f1, 11);
      const f3 = await createBlock(db, f2, 12);

      // Import main chain first.
      finalizer.onBlockImported(b1);
      finalizer.onBlockImported(b2);
      finalizer.onBlockImported(b3);
      // Import b4: chain [b1,b2,b3,b4] length 4, not > 4.
      finalizer.onBlockImported(b4);

      // Import fork — F1's parent is b2 which is mid-chain.
      finalizer.onBlockImported(f1);
      finalizer.onBlockImported(f2);

      // Import F3: fork chain = [b1, b2, f1, f2, f3], length 5 > 4.
      // Finalize block at index 5-1-2 = 2 → f1.
      // Main chain [b1,b2,b3,b4] doesn't contain f1 → dead.
      const r = finalizer.onBlockImported(f3);
      assertExists(r);
      assert.strictEqual(r.finalizedHash.isEqualTo(f1), true);

      const pruned = r.prunableStateHashes.map((h) => h.toString());
      assert.ok(pruned.includes(b1.toString()), "B1 should be pruned");
      assert.ok(pruned.includes(b2.toString()), "B2 should be pruned");
      assert.ok(pruned.includes(b3.toString()), "B3 should be pruned (dead fork)");
      assert.ok(pruned.includes(b4.toString()), "B4 should be pruned (dead fork)");
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

```

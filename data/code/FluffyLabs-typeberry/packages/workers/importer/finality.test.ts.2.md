---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L210-L301
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 5
content_sha: e310dc50e228fb2136d08aded8fb6b714d4b8371e42b4d141b9ede1d8d1c3402
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 210–301)

```typescript
      // Import 3: finalize block 2.
      const r2 = finalizer.onBlockImported(chain[2]);
      assertExists(r2);
      assert.strictEqual(r2.finalizedHash.isEqualTo(chain[1]), true);
    });
  });

  describe("forks", () => {
    it("should track two forks from the finalized block", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Fork A: genesis -> A1 -> A2 -> A3
      const a1 = await createBlock(db, genesis, 1);
      const a2 = await createBlock(db, a1, 2);
      const a3 = await createBlock(db, a2, 3);

      // Fork B: genesis -> B1 -> B2
      const b1 = await createBlock(db, genesis, 10);
      const b2 = await createBlock(db, b1, 11);

      // Import A1, A2, B1, B2 — no finality yet.
      assert.strictEqual(finalizer.onBlockImported(a1), null);
      assert.strictEqual(finalizer.onBlockImported(a2), null);
      assert.strictEqual(finalizer.onBlockImported(b1), null);
      assert.strictEqual(finalizer.onBlockImported(b2), null);

      // Import A3: fork A has length 3 > depth 2. Finalize A1.
      const result = finalizer.onBlockImported(a3);
      assertExists(result);
      assert.strictEqual(result.finalizedHash.isEqualTo(a1), true);

      // Fork B is dead (doesn't contain A1). B1 and B2 should be pruned.
      // Also, the previous finalized (genesis) is pruned.
      const prunedStrings = result.prunableStateHashes.map((h) => h.toString());
      assert.ok(prunedStrings.includes(genesis.toString()), "Genesis (prev finalized) should be pruned");
      assert.ok(prunedStrings.includes(b1.toString()), "B1 should be pruned");
      assert.ok(prunedStrings.includes(b2.toString()), "B2 should be pruned");
      // A1 is the finalized block — should NOT be pruned.
      assert.ok(!prunedStrings.includes(a1.toString()), "A1 (finalized) should not be pruned");
    });

    it("should keep alive forks that diverge after the finalized block", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Main chain: genesis -> 1 -> 2 -> 3
      const b1 = await createBlock(db, genesis, 1);
      const b2 = await createBlock(db, b1, 2);
      const b3 = await createBlock(db, b2, 3);

      // Fork from block 2: 2 -> F1
      const f1 = await createBlock(db, b2, 20);

      // Import 1, 2 — no finality yet (chain length 2 = depth 2).
      finalizer.onBlockImported(b1);
      finalizer.onBlockImported(b2);

      // Import F1: fork chain [b1, b2, f1] has length 3 > depth 2.
      // This triggers finality for b1.
      const r1 = finalizer.onBlockImported(f1);
      assertExists(r1);
      assert.strictEqual(r1.finalizedHash.isEqualTo(b1), true);

      // Both chains contain b1: main [b1, b2] → alive, trimmed to [b2].
      // Fork [b1, b2, f1] → alive, trimmed to [b2, f1].
      // Only the previous finalized (genesis) is pruned.
      assert.strictEqual(r1.prunableStateHashes.length, 1);
      assert.ok(r1.prunableStateHashes[0].isEqualTo(genesis));

      // Now import b3: it extends the main chain [b2] → [b2, b3].
      // Length 2, not > depth 2. No finality.
      const r2 = finalizer.onBlockImported(b3);
      assert.strictEqual(r2, null);

      // Extend the fork: F1 -> F2 -> F3
      const f2 = await createBlock(db, f1, 21);
      const f3 = await createBlock(db, f2, 22);

      // Import F2: fork chain becomes [b2, f1, f2], length=3 > depth=2.
      // Finalize b2 (index 0). Both chains contain b2, so both are alive.
      // unfinalized becomes [[b3], [f1, f2]]. Only prev finalized (b1) pruned.
      const r3 = finalizer.onBlockImported(f2);
      assertExists(r3);
      assert.strictEqual(r3.finalizedHash.isEqualTo(b2), true);
      assert.strictEqual(r3.prunableStateHashes.length, 1);
      assert.ok(r3.prunableStateHashes[0].isEqualTo(b1));

```

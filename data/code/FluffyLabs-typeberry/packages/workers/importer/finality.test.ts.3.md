---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L297-L382
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 3
chunk_total: 5
content_sha: a5f9a5367678dc64bc923fdc9e2824713acf424e129c5d971618a613b4da241f
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 297–382)

```typescript
      assertExists(r3);
      assert.strictEqual(r3.finalizedHash.isEqualTo(b2), true);
      assert.strictEqual(r3.prunableStateHashes.length, 1);
      assert.ok(r3.prunableStateHashes[0].isEqualTo(b1));

      // Import F3: fork chain becomes [f1, f2, f3], length=3 > depth=2.
      // Finalize f1 (index 0). Main chain [b3] doesn't contain f1 → dead.
      const r4 = finalizer.onBlockImported(f3);
      assertExists(r4);
      assert.strictEqual(r4.finalizedHash.isEqualTo(f1), true);

      const pruned = r4.prunableStateHashes.map((h) => h.toString());
      assert.ok(pruned.includes(b2.toString()), "B2 (prev finalized) should be pruned");
      assert.ok(pruned.includes(b3.toString()), "B3 should be pruned (dead fork)");
      assert.ok(!pruned.includes(f1.toString()), "F1 should not be pruned (finalized)");
      assert.ok(!pruned.includes(f2.toString()), "F2 should not be pruned (after finalized)");
      assert.ok(!pruned.includes(f3.toString()), "F3 should not be pruned (after finalized)");
    });

    it("should prune a dead fork that diverged before the finalized block", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Main: genesis -> 1 -> 2 -> 3 -> 4
      const chain = await buildLinearChain(db, genesis, 4);

      // Fork from genesis: genesis -> F1 -> F2
      const f1 = await createBlock(db, genesis, 100);
      const f2 = await createBlock(db, f1, 101);

      // Import: 1, 2, F1, F2, 3 (finalize block 1), 4 (finalize block 2)
      finalizer.onBlockImported(chain[0]);
      finalizer.onBlockImported(chain[1]);
      finalizer.onBlockImported(f1);
      finalizer.onBlockImported(f2);

      // Import 3: main chain length=3 > depth=2, finalize block 1.
      const r1 = finalizer.onBlockImported(chain[2]);
      assertExists(r1);
      assert.strictEqual(r1.finalizedHash.isEqualTo(chain[0]), true);

      // Fork [F1, F2] doesn't contain block 1, so it's dead.
      // Also, the previous finalized (genesis) is pruned.
      const pruned1 = r1.prunableStateHashes.map((h) => h.toString());
      assert.ok(pruned1.includes(genesis.toString()), "Genesis (prev finalized) should be pruned");
      assert.ok(pruned1.includes(f1.toString()), "F1 should be pruned");
      assert.ok(pruned1.includes(f2.toString()), "F2 should be pruned");
    });

    it("should handle fork from the middle of a chain", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Main: genesis -> 1 -> 2 -> 3
      const b1 = await createBlock(db, genesis, 1);
      const b2 = await createBlock(db, b1, 2);
      const b3 = await createBlock(db, b2, 3);

      // Fork from block 1: 1 -> F1 -> F2 -> F3
      const f1 = await createBlock(db, b1, 10);
      const f2 = await createBlock(db, f1, 11);
      const f3 = await createBlock(db, f2, 12);

      // Import main chain first.
      finalizer.onBlockImported(b1);
      finalizer.onBlockImported(b2);
      finalizer.onBlockImported(b3);

      // Import fork — F1's parent is b1 which is mid-chain, not a tip.
      finalizer.onBlockImported(f1);
      finalizer.onBlockImported(f2);

      // Import F3: fork chain = [b1, f1, f2, f3], length=4 > depth=2.
      // Finalize block at index 4-1-2 = 1 → f1.
      // But wait — the main chain [b1, b2, b3] also has length 3 > 2.
      // Block 3 import already triggered finality for b1.
      // After that, main chain trimmed to [b2, b3].
      // Fork was created from mid-chain of [b1, b2, b3] at b1.
      // But b1 was already part of the chain before finality.
      // After finality of b1: unfinalized = [[b2, b3]].
      // Now F1's parent is b1 = lastFinalized, so it starts a new chain: [f1].
      // F2 extends it: [f1, f2]. F3 extends: [f1, f2, f3]. Length=3 > 2.
```

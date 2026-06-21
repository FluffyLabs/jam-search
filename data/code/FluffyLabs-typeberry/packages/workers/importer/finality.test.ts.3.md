---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L293-L376
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 3
chunk_total: 6
content_sha: a11d10a1a3c53513a05c671e427aff8db62ff03ae92ec5a263fae615f5cee364
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 293–376)

```typescript
      // Import M1..M4. F1 creates a fork from the middle of the chain.
      // After importing M1..M4: chain [M1,M2,M3,M4], length 4 not > 4.
      for (const h of [m1, m2, m3, m4]) {
        finalizer.onBlockImported(h);
      }

      // Import F1: parent M3 is at index 2 (not tip M4). Fork: [M1,M2,M3,F1].
      finalizer.onBlockImported(f1);

      // Extend main chain to trigger finality.
      const m5 = await createBlock(db, m4, 5);

      // Import M5: main chain [M1,M2,M3,M4,M5] length 5 > 4. Finalize M3.
      const r1 = finalizer.onBlockImported(m5);
      assertExists(r1);
      assert.strictEqual(r1.finalizedHash.isEqualTo(m3), true);

      // Both chains contain M3:
      // Main [M1,M2,M3,M4,M5]: M3 at index 2. Prune M1,M2. Remaining: [M4,M5].
      // Fork [M1,M2,M3,F1]: M3 at index 2. Prune M1,M2. Remaining: [F1].
      const pruned1 = r1.prunableStateHashes.map((h) => h.toString());
      assert.ok(pruned1.includes(genesis.toString()), "Genesis should be pruned");
      assert.ok(!pruned1.includes(m3.toString()), "M3 (finalized) should not be pruned");
      assert.ok(!pruned1.includes(m4.toString()), "M4 should not be pruned (alive)");
      assert.ok(!pruned1.includes(f1.toString()), "F1 should not be pruned (alive)");

      // Extend fork to trigger next finality round.
      const f2 = await createBlock(db, f1, 21);
      const f3 = await createBlock(db, f2, 22);
      const f4 = await createBlock(db, f3, 23);
      const f5 = await createBlock(db, f4, 24);

      // [F1] length 1, [M4,M5] length 2. No finality yet.
      assert.strictEqual(finalizer.onBlockImported(f2), null);
      assert.strictEqual(finalizer.onBlockImported(f3), null);
      assert.strictEqual(finalizer.onBlockImported(f4), null);

      // Import F5: fork chain [F1,F2,F3,F4,F5] length 5 > 4. Finalize F3 (index 2).
      // Main chain [M4,M5] doesn't contain F3 → dead fork, prune M4,M5.
      const r2 = finalizer.onBlockImported(f5);
      assertExists(r2);
      assert.strictEqual(r2.finalizedHash.isEqualTo(f3), true);

      const pruned2 = r2.prunableStateHashes.map((h) => h.toString());
      assert.ok(pruned2.includes(m3.toString()), "M3 (prev finalized) should be pruned");
      assert.ok(pruned2.includes(m4.toString()), "M4 should be pruned (dead fork)");
      assert.ok(pruned2.includes(m5.toString()), "M5 should be pruned (dead fork)");
      assert.ok(pruned2.includes(f1.toString()), "F1 should be pruned (before finalized)");
      assert.ok(pruned2.includes(f2.toString()), "F2 should be pruned (before finalized)");
      assert.ok(!pruned2.includes(f3.toString()), "F3 (finalized) should not be pruned");
    });

    it("should prune a dead fork that diverged before the finalized block", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Main: genesis -> 1 -> 2 -> 3 -> 4 -> 5
      const chain = await buildLinearChain(db, genesis, 5);

      // Fork from genesis: genesis -> F1 -> F2
      const f1 = await createBlock(db, genesis, 100);
      const f2 = await createBlock(db, f1, 101);

      // Import main chain and fork — no finality yet.
      for (const h of chain.slice(0, 4)) {
        finalizer.onBlockImported(h);
      }
      finalizer.onBlockImported(f1);
      finalizer.onBlockImported(f2);

      // Import 5th block: main chain length 5 > 4, finalize chain[2].
      const r1 = finalizer.onBlockImported(chain[4]);
      assertExists(r1);
      assert.strictEqual(r1.finalizedHash.isEqualTo(chain[2]), true);

      // Fork [F1,F2] doesn't contain chain[2], so it's dead.
      const pruned1 = r1.prunableStateHashes.map((h) => h.toString());
      assert.ok(pruned1.includes(genesis.toString()), "Genesis should be pruned");
      assert.ok(pruned1.includes(f1.toString()), "F1 should be pruned");
      assert.ok(pruned1.includes(f2.toString()), "F2 should be pruned");
    });

```

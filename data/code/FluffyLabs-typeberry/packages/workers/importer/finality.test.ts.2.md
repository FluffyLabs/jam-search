---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L211-L298
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 6
content_sha: 912cd8f5dd83e0c67c1d91a5ac84e562f7eca4fcbdbe298188e943ad8bef9dc0
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 211–298)

```typescript
      // Import 1: length=1, not > 2. No finality.
      assert.strictEqual(finalizer.onBlockImported(chain[0]), null);

      // Import 2: length=2, not > 2. No finality.
      assert.strictEqual(finalizer.onBlockImported(chain[1]), null);

      // Import 3: length=3 > 2. Finalize chain[1].
      const r1 = finalizer.onBlockImported(chain[2]);
      assertExists(r1);
      assert.strictEqual(r1.finalizedHash.isEqualTo(chain[1]), true);
      // Prunable: genesis + chain[0] = 2 items.
      assert.strictEqual(r1.prunableStateHashes.length, 2);
      assert.ok(r1.prunableStateHashes[0].isEqualTo(genesis));
      assert.ok(r1.prunableStateHashes[1].isEqualTo(chain[0]));

      // Remaining = [chain[2]]. Need > 2, so 1 more block.
      assert.strictEqual(finalizer.onBlockImported(chain[3]), null);

      // Import 5: chain [chain[2], chain[3], chain[4]] length=3 > 2. Finalize chain[3].
      const r2 = finalizer.onBlockImported(chain[4]);
      assertExists(r2);
      assert.strictEqual(r2.finalizedHash.isEqualTo(chain[3]), true);
      assert.strictEqual(r2.prunableStateHashes.length, 2);
      assert.ok(r2.prunableStateHashes[0].isEqualTo(chain[1]));
      assert.ok(r2.prunableStateHashes[1].isEqualTo(chain[2]));
    });
  });

  describe("forks", () => {
    it("should track two forks and prune dead fork on finality", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Fork A: genesis -> A1 -> A2 -> A3 -> A4 -> A5 (length 5 > 2*2 = triggers)
      const a1 = await createBlock(db, genesis, 1);
      const a2 = await createBlock(db, a1, 2);
      const a3 = await createBlock(db, a2, 3);
      const a4 = await createBlock(db, a3, 4);
      const a5 = await createBlock(db, a4, 5);

      // Fork B: genesis -> B1 -> B2
      const b1 = await createBlock(db, genesis, 10);
      const b2 = await createBlock(db, b1, 11);

      // Import A1..A4, B1, B2 — no finality.
      for (const h of [a1, a2, a3, a4, b1, b2]) {
        assert.strictEqual(finalizer.onBlockImported(h), null);
      }

      // Import A5: fork A length 5 > 4. Finalize A3 (index 2).
      const result = finalizer.onBlockImported(a5);
      assertExists(result);
      assert.strictEqual(result.finalizedHash.isEqualTo(a3), true);

      // Fork B [B1, B2] is dead (doesn't contain A3). B1 and B2 should be pruned.
      // Also: genesis (prev finalized) and A1, A2 pruned (before A3 in chain A).
      const prunedStrings = result.prunableStateHashes.map((h) => h.toString());
      assert.ok(prunedStrings.includes(genesis.toString()), "Genesis should be pruned");
      assert.ok(prunedStrings.includes(a1.toString()), "A1 should be pruned");
      assert.ok(prunedStrings.includes(a2.toString()), "A2 should be pruned");
      assert.ok(prunedStrings.includes(b1.toString()), "B1 should be pruned");
      assert.ok(prunedStrings.includes(b2.toString()), "B2 should be pruned");
      assert.ok(!prunedStrings.includes(a3.toString()), "A3 (finalized) should not be pruned");
    });

    it("should keep alive forks that diverge at or after the finalized block", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Main chain: genesis -> M1 -> M2 -> M3 -> M4
      const m1 = await createBlock(db, genesis, 1);
      const m2 = await createBlock(db, m1, 2);
      const m3 = await createBlock(db, m2, 3);
      const m4 = await createBlock(db, m3, 4);

      // Fork from M3 (the block that will be finalized): M3 -> F1
      const f1 = await createBlock(db, m3, 20);

      // Import M1..M4. F1 creates a fork from the middle of the chain.
      // After importing M1..M4: chain [M1,M2,M3,M4], length 4 not > 4.
      for (const h of [m1, m2, m3, m4]) {
        finalizer.onBlockImported(h);
      }

```

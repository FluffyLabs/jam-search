---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L121-L217
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 5
content_sha: 182be3b5183a45274818e358c3bb479dd1d19299204657087480405813485e00
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 121–217)

```typescript
      const result = finalizer.onBlockImported(chain[3]);
      assertExists(result);
      // Block 1 is finalized. The previously finalized block (genesis) is pruned.
      assert.strictEqual(result.prunableStateHashes.length, 1);
      assert.ok(result.prunableStateHashes[0].isEqualTo(genesis));
    });

    it("should advance finality one block at a time, pruning previous finalized each time", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Build: genesis -> 1 -> 2 -> 3 -> 4 -> 5
      const chain = await buildLinearChain(db, genesis, 5);

      // Import 1, 2: no finality (length <= depth)
      assert.strictEqual(finalizer.onBlockImported(chain[0]), null);
      assert.strictEqual(finalizer.onBlockImported(chain[1]), null);

      // Import 3: length=3 > depth=2, finalize block 1. Prune genesis.
      const r1 = finalizer.onBlockImported(chain[2]);
      assertExists(r1);
      assert.strictEqual(r1.finalizedHash.isEqualTo(chain[0]), true);
      assert.strictEqual(r1.prunableStateHashes.length, 1);
      assert.ok(r1.prunableStateHashes[0].isEqualTo(genesis));

      // Import 4: finalize block 2. Prune block 1 (previous finalized).
      const r2 = finalizer.onBlockImported(chain[3]);
      assertExists(r2);
      assert.strictEqual(r2.finalizedHash.isEqualTo(chain[1]), true);
      assert.strictEqual(r2.prunableStateHashes.length, 1);
      assert.ok(r2.prunableStateHashes[0].isEqualTo(chain[0]));

      // Import 5: finalize block 3. Prune block 2 (previous finalized).
      const r3 = finalizer.onBlockImported(chain[4]);
      assertExists(r3);
      assert.strictEqual(r3.finalizedHash.isEqualTo(chain[2]), true);
      assert.strictEqual(r3.prunableStateHashes.length, 1);
      assert.ok(r3.prunableStateHashes[0].isEqualTo(chain[1]));
    });

    it("should advance finality on every import even when blocks arrive in a burst", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // Build: genesis -> 1 -> 2 -> 3 -> 4 -> 5
      const chain = await buildLinearChain(db, genesis, 5);

      // Import blocks 1..4 — finality fires on block 3 and block 4.
      assert.strictEqual(finalizer.onBlockImported(chain[0]), null);
      assert.strictEqual(finalizer.onBlockImported(chain[1]), null);

      // Block 3: chain [1,2,3] length=3 > depth=2 → finalize block 1.
      const r1 = finalizer.onBlockImported(chain[2]);
      assertExists(r1);
      assert.strictEqual(r1.finalizedHash.isEqualTo(chain[0]), true);

      // Block 4: chain [2,3,4] length=3 > depth=2 → finalize block 2.
      const r2 = finalizer.onBlockImported(chain[3]);
      assertExists(r2);
      assert.strictEqual(r2.finalizedHash.isEqualTo(chain[1]), true);

      // Block 5: chain [3,4,5] length=3 > depth=2 → finalize block 3.
      const r3 = finalizer.onBlockImported(chain[4]);
      assertExists(r3);
      assert.strictEqual(r3.finalizedHash.isEqualTo(chain[2]), true);
    });
  });

  describe("with depth=1", () => {
    it("should finalize immediately after 2 blocks", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 1);

      const chain = await buildLinearChain(db, genesis, 3);

      // Import 1: length=1, not > 1. No finality.
      assert.strictEqual(finalizer.onBlockImported(chain[0]), null);

      // Import 2: length=2 > 1. Finalize block 1.
      const r = finalizer.onBlockImported(chain[1]);
      assertExists(r);
      assert.strictEqual(r.finalizedHash.isEqualTo(chain[0]), true);

      // Import 3: finalize block 2.
      const r2 = finalizer.onBlockImported(chain[2]);
      assertExists(r2);
      assert.strictEqual(r2.finalizedHash.isEqualTo(chain[1]), true);
    });
  });

  describe("forks", () => {
```

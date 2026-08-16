---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L120-L211
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 6
content_sha: 3980019403950b40cb5708dfc48df03bd6cca66187f24a7ac3af07069049cfcf
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 120–211)

```typescript
      const chain = await buildLinearChain(db, genesis, 7);
      for (let i = 0; i < 6; i++) {
        finalizer.onBlockImported(chain[i]);
      }

      const result = finalizer.onBlockImported(chain[6]);
      assertExists(result);
      // Prunable: genesis (prev finalized) + chain[0..2] = 4 items.
      assert.strictEqual(result.prunableStateHashes.length, 4);
      assert.ok(result.prunableStateHashes[0].isEqualTo(genesis));
      for (let i = 0; i < 3; i++) {
        assert.ok(result.prunableStateHashes[i + 1].isEqualTo(chain[i]));
      }
    });

    it("should advance finality in batches of depth blocks", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      // depth=2: triggers at > 4 (length >= 5).
      // After trigger: remaining = 2 blocks. Next trigger needs 3 more (length 5).
      // Build enough for 3 triggers: 5 + 3 + 3 = 11 blocks.
      const chain = await buildLinearChain(db, genesis, 11);

      // First 4 imports: no finality (chain length <= 2*depth = 4).
      for (let i = 0; i < 4; i++) {
        assert.strictEqual(finalizer.onBlockImported(chain[i]), null);
      }

      // 5th import: chain length = 5 > 4, finalize chain[2].
      const r1 = finalizer.onBlockImported(chain[4]);
      assertExists(r1);
      assert.strictEqual(r1.finalizedHash.isEqualTo(chain[2]), true);
      assert.deepStrictEqual(
        r1.finalizedChain.map((h) => h.toString()),
        chain.slice(0, 3).map((h) => h.toString()),
      );
      assert.strictEqual(r1.prunableStateHashes.length, 3);
      assert.ok(r1.prunableStateHashes[0].isEqualTo(genesis));
      assert.ok(r1.prunableStateHashes[1].isEqualTo(chain[0]));
      assert.ok(r1.prunableStateHashes[2].isEqualTo(chain[1]));

      // Next 2 imports: no finality (remaining chain = 2, need > 4).
      assert.strictEqual(finalizer.onBlockImported(chain[5]), null);
      assert.strictEqual(finalizer.onBlockImported(chain[6]), null);

      // 8th import: chain length = 5 > 4, finalize chain[5].
      const r2 = finalizer.onBlockImported(chain[7]);
      assertExists(r2);
      assert.strictEqual(r2.finalizedHash.isEqualTo(chain[5]), true);
      // Only the blocks finalized in this round, not the ones from r1.
      assert.deepStrictEqual(
        r2.finalizedChain.map((h) => h.toString()),
        chain.slice(3, 6).map((h) => h.toString()),
      );
      assert.strictEqual(r2.prunableStateHashes.length, 3);
      assert.ok(r2.prunableStateHashes[0].isEqualTo(chain[2]));
      assert.ok(r2.prunableStateHashes[1].isEqualTo(chain[3]));
      assert.ok(r2.prunableStateHashes[2].isEqualTo(chain[4]));

      // Next 2 imports: no finality.
      assert.strictEqual(finalizer.onBlockImported(chain[8]), null);
      assert.strictEqual(finalizer.onBlockImported(chain[9]), null);

      // 11th import: chain length = 5 > 4, finalize chain[8].
      const r3 = finalizer.onBlockImported(chain[10]);
      assertExists(r3);
      assert.strictEqual(r3.finalizedHash.isEqualTo(chain[8]), true);
      assert.strictEqual(r3.prunableStateHashes.length, 3);
      assert.ok(r3.prunableStateHashes[0].isEqualTo(chain[5]));
      assert.ok(r3.prunableStateHashes[1].isEqualTo(chain[6]));
      assert.ok(r3.prunableStateHashes[2].isEqualTo(chain[7]));
    });

    it("should not trigger between batch boundaries", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 2);

      const chain = await buildLinearChain(db, genesis, 5);

      // First 4: no finality (chain length <= 4).
      for (let i = 0; i < 4; i++) {
        assert.strictEqual(finalizer.onBlockImported(chain[i]), null);
      }

      // 5th: chain length = 5 > 4, finalize chain[2].
      const r1 = finalizer.onBlockImported(chain[4]);
      assertExists(r1);
```

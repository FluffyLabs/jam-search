---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L1-L124
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 5
content_sha: beba09c0fef5c225bddcfcb00458a0637276afe1979326caef172eabf0da5a13
language: typescript
---
`packages/workers/importer/finality.test.ts` (lines 1–124)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import {
  Block,
  DisputesExtrinsic,
  Extrinsic,
  Header,
  type HeaderHash,
  reencodeAsView,
  tryAsTimeSlot,
} from "@typeberry/block";

import { asKnownSize } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { InMemoryBlocks } from "@typeberry/database";
import { Blake2b, WithHash } from "@typeberry/hash";
import { DummyFinalizer } from "./finality.js";

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

function assertExists<T>(value: T): asserts value is NonNullable<T> {
  assert.notStrictEqual(value, null);
  assert.notStrictEqual(value, undefined);
}

/**
 * Create a block with the given parent hash and slot, insert it into the db,
 * and return its hash.
 */
async function createBlock(db: InMemoryBlocks, parent: HeaderHash, slot = 0): Promise<HeaderHash> {
  const header = Header.create({
    ...Header.empty(),
    parentHeaderHash: parent,
    timeSlotIndex: tryAsTimeSlot(slot),
  });

  const block = Block.create({
    header,
    extrinsic: Extrinsic.create({
      tickets: asKnownSize([]),
      preimages: [],
      assurances: asKnownSize([]),
      guarantees: asKnownSize([]),
      disputes: DisputesExtrinsic.create({ verdicts: [], culprits: [], faults: [] }),
    }),
  });

  const blockView = reencodeAsView(Block.Codec, block, tinyChainSpec);
  const headerHash = blake2b.hashBytes(blockView.header.view().encoded()).asOpaque<HeaderHash>();

  await db.insertBlock(WithHash.new(headerHash, blockView));

  return headerHash;
}

/** Build a linear chain of `length` blocks starting from `parentHash`. */
async function buildLinearChain(db: InMemoryBlocks, parentHash: HeaderHash, length: number): Promise<HeaderHash[]> {
  const hashes: HeaderHash[] = [];
  let parent = parentHash;
  for (let i = 0; i < length; i++) {
    const h = await createBlock(db, parent, i);
    hashes.push(h);
    parent = h;
  }
  return hashes;
}

describe("DummyFinalizer", () => {
  describe("linear chain", () => {
    it("should return null when chain is shorter than depth", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 3);

      // Build a chain of 3 blocks: genesis -> 1 -> 2 -> 3
      const chain = await buildLinearChain(db, genesis, 3);

      // Import all 3 — chain length = depth, not > depth, so no finality.
      for (const h of chain) {
        const result = finalizer.onBlockImported(h);
        assert.strictEqual(result, null);
      }
    });

    it("should finalize when chain exceeds depth", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 3);

      // Build: genesis -> 1 -> 2 -> 3 -> 4
      const chain = await buildLinearChain(db, genesis, 4);

      // First 3 imports: no finality.
      for (let i = 0; i < 3; i++) {
        assert.strictEqual(finalizer.onBlockImported(chain[i]), null);
      }

      // 4th import: chain length = 4 > depth(3), finalize block at index 0.
      const result = finalizer.onBlockImported(chain[3]);
      assertExists(result);
      assert.strictEqual(result.finalizedHash.isEqualTo(chain[0]), true);
    });

    it("should prune the previously finalized block on first finality", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 3);

      const chain = await buildLinearChain(db, genesis, 4);
      for (let i = 0; i < 3; i++) {
        finalizer.onBlockImported(chain[i]);
      }

      const result = finalizer.onBlockImported(chain[3]);
      assertExists(result);
      // Block 1 is finalized. The previously finalized block (genesis) is pruned.
      assert.strictEqual(result.prunableStateHashes.length, 1);
```

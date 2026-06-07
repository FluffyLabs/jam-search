---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/finality.test.ts#L1-L124
title: packages/workers/importer/finality.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 6
content_sha: 2d629506013d586053136361bdd393c8477ab1e83b60a597ede65a4ec946e8c7
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
    it("should return null when chain length is at most 2*depth", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 3);

      // 2*3 = 6 blocks: chain length = 6, not > 6, so no finality.
      const chain = await buildLinearChain(db, genesis, 6);

      for (const h of chain) {
        const result = finalizer.onBlockImported(h);
        assert.strictEqual(result, null);
      }
    });

    it("should finalize when chain length exceeds 2*depth", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 3);

      // Need > 2*3=6, so build 7 blocks.
      const chain = await buildLinearChain(db, genesis, 7);

      // First 6 imports: no finality (chain length <= 2*depth).
      for (let i = 0; i < 6; i++) {
        assert.strictEqual(finalizer.onBlockImported(chain[i]), null);
      }

      // 7th import: chain length = 7 > 6, finalize chain[3].
      const result = finalizer.onBlockImported(chain[6]);
      assertExists(result);
      assert.strictEqual(result.finalizedHash.isEqualTo(chain[3]), true);
    });

    it("should prune prev finalized and depth predecessors on first finality", async () => {
      const db = InMemoryBlocks.new();
      const genesis = db.getBestHeaderHash();

      const finalizer = DummyFinalizer.create(db, 3);

      const chain = await buildLinearChain(db, genesis, 7);
      for (let i = 0; i < 6; i++) {
        finalizer.onBlockImported(chain[i]);
      }

      const result = finalizer.onBlockImported(chain[6]);
      assertExists(result);
      // Prunable: genesis (prev finalized) + chain[0..2] = 4 items.
      assert.strictEqual(result.prunableStateHashes.length, 4);
      assert.ok(result.prunableStateHashes[0].isEqualTo(genesis));
```

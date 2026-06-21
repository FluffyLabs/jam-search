---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/blocks.test.ts#L1-L47
title: packages/jam/database/blocks.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: f385e2a3c0e3008dcb173f976c1b3ee56816acdd087f718e9f33da7a59705da6
language: typescript
---
`packages/jam/database/blocks.test.ts` (lines 1–47)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { testBlockView } from "@typeberry/block/test-helpers.js";
import { Bytes } from "@typeberry/bytes";
import { Blake2b, HASH_SIZE, WithHash } from "@typeberry/hash";
import { InMemoryBlocks } from "./index.js";

describe("InMemoryDatabase", () => {
  let blake2b: Blake2b;

  before(async () => {
    blake2b = await Blake2b.createHasher();
  });

  it("should set and retrieve best header hash", () => {
    const db = InMemoryBlocks.new();

    db.setBestHeaderHash(Bytes.fill(HASH_SIZE, 5).asOpaque());

    assert.strictEqual(
      db.getBestHeaderHash().toString(),
      "0x0505050505050505050505050505050505050505050505050505050505050505",
    );
  });

  it("should set and retrieve post state root", () => {
    const db = InMemoryBlocks.new();

    db.setPostStateRoot(Bytes.fill(HASH_SIZE, 5).asOpaque(), Bytes.fill(HASH_SIZE, 10).asOpaque());

    assert.strictEqual(db.getPostStateRoot(Bytes.fill(HASH_SIZE, 1).asOpaque())?.toString(), undefined);
    assert.strictEqual(
      db.getPostStateRoot(Bytes.fill(HASH_SIZE, 5).asOpaque())?.toString(),
      "0x0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a",
    );
  });

  it("should store and retrieve a block", () => {
    const db = InMemoryBlocks.new();
    const block = testBlockView();
    const headerHash = blake2b.hashBytes(block.header.view().encoded()).asOpaque();
    db.insertBlock(WithHash.new(headerHash, block));

    assert.deepStrictEqual(db.getHeader(headerHash)?.materialize(), block.header.materialize());
    assert.deepStrictEqual(db.getExtrinsic(headerHash)?.materialize(), block.extrinsic.materialize());
  });
});
```

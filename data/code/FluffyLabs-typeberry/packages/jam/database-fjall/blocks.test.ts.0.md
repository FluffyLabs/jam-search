---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database-fjall/blocks.test.ts#L1-L76
title: packages/jam/database-fjall/blocks.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 37078c4c1c702cf0cab4f6c7bd95551e827d7e7c5ff20b4a286f9c1e83b50f55
language: typescript
---
`packages/jam/database-fjall/blocks.test.ts` (lines 1–76)

```typescript
import assert from "node:assert";
import * as fs from "node:fs";
import { afterEach, before, beforeEach, describe, it } from "node:test";
import { testBlockView } from "@typeberry/block/test-helpers.js";
import { Bytes } from "@typeberry/bytes";
import { tinyChainSpec } from "@typeberry/config";
import { Blake2b, HASH_SIZE, WithHash } from "@typeberry/hash";
import { FjallBlocks } from "./blocks.js";
import { FjallRoot } from "./root.js";

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

describe("Fjall blocks database", () => {
  let tmpDir = "";

  beforeEach(() => {
    tmpDir = fs.mkdtempSync("typeberry-fjall-blocks-");
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  it("sets and retrieves the best header hash", async () => {
    const root = await FjallRoot.open(tmpDir, { ephemeral: true });
    const blocks = await FjallBlocks.open(tinyChainSpec, root);
    try {
      await blocks.setBestHeaderHash(Bytes.fill(HASH_SIZE, 5).asOpaque());

      assert.strictEqual(
        blocks.getBestHeaderHash().toString(),
        "0x0505050505050505050505050505050505050505050505050505050505050505",
      );
    } finally {
      await blocks.close();
      await root.close();
    }
  });

  it("sets and retrieves post state roots", async () => {
    const root = await FjallRoot.open(tmpDir, { ephemeral: true });
    const blocks = await FjallBlocks.open(tinyChainSpec, root);
    try {
      await blocks.setPostStateRoot(Bytes.fill(HASH_SIZE, 5).asOpaque(), Bytes.fill(HASH_SIZE, 10).asOpaque());

      assert.strictEqual(blocks.getPostStateRoot(Bytes.fill(HASH_SIZE, 1).asOpaque())?.toString(), undefined);
      assert.strictEqual(
        blocks.getPostStateRoot(Bytes.fill(HASH_SIZE, 5).asOpaque())?.toString(),
        "0x0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a",
      );
    } finally {
      await blocks.close();
      await root.close();
    }
  });

  it("stores and retrieves a block", async () => {
    const root = await FjallRoot.open(tmpDir, { ephemeral: true });
    const blocks = await FjallBlocks.open(tinyChainSpec, root);
    try {
      const block = testBlockView();
      const headerHash = blake2b.hashBytes(block.header.view().encoded()).asOpaque();
      await blocks.insertBlock(WithHash.new(headerHash, block));

      assert.deepStrictEqual(blocks.getHeader(headerHash)?.materialize(), block.header.materialize());
      assert.deepStrictEqual(blocks.getExtrinsic(headerHash)?.materialize(), block.extrinsic.materialize());
    } finally {
      await blocks.close();
      await root.close();
    }
  });
});
```

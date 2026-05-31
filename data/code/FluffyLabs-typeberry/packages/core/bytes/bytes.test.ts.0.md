---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/bytes.test.ts#L1-L112
title: packages/core/bytes/bytes.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 2
content_sha: aed20e6c5df9454757b1e036ae47f847a82ec314ff9ecb77f1902b02acb98b9f
language: typescript
---
`packages/core/bytes/bytes.test.ts` (lines 1–112)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { Bytes, BytesBlob, bytesBlobComparator } from "./bytes.js";

describe("BytesBlob", () => {
  it("should fail if 0x is missing", () => {
    try {
      BytesBlob.parseBlob("ff2f");
      assert.fail("Should throw an exception");
    } catch (e) {
      assert.strictEqual(`${e}`, "Error: Missing 0x prefix: ff2f.");
    }
  });

  it("should fail in case invalid characters are given", () => {
    try {
      BytesBlob.parseBlob("0xff2g");
      assert.fail("Should throw an exception");
    } catch (e) {
      assert.strictEqual(`${e}`, "Error: Invalid characters in hex byte string: g");
    }
  });

  it("parse 0x-prefixed hex string into blob of bytes", () => {
    const input = "0x2fa3f686df876995167e7c2e5d74c4c7b6e48f8068fe0e44208344d480f7904c";
    const result = BytesBlob.parseBlob(input);

    assert.deepStrictEqual(
      result.raw,
      new Uint8Array([
        47, 163, 246, 134, 223, 135, 105, 149, 22, 126, 124, 46, 93, 116, 196, 199, 182, 228, 143, 128, 104, 254, 14,
        68, 32, 131, 68, 212, 128, 247, 144, 76,
      ]),
    );
  });

  it("parse non 0x-prefixed hex string into blob of bytes", () => {
    const input = "2fa3f686df876995167e7c2e5d74c4c7b6e48f8068fe0e44208344d480f7904c";
    const result = BytesBlob.parseBlobNoPrefix(input);

    assert.deepStrictEqual(
      result.raw,
      new Uint8Array([
        47, 163, 246, 134, 223, 135, 105, 149, 22, 126, 124, 46, 93, 116, 196, 199, 182, 228, 143, 128, 104, 254, 14,
        68, 32, 131, 68, 212, 128, 247, 144, 76,
      ]),
    );
  });

  it("from bytes", () => {
    const result = BytesBlob.blobFromNumbers([47, 163, 246, 134]);

    assert.deepStrictEqual(result.raw, new Uint8Array([47, 163, 246, 134]));
  });

  describe("chunks", () => {
    it("should split array into chunks of given size", () => {
      const blob = BytesBlob.blobFromNumbers([48, 163, 246, 134]);
      const chunkSize = 2;
      const expectedChunk1 = BytesBlob.blobFromNumbers([48, 163]);
      const expectedChunk2 = BytesBlob.blobFromNumbers([246, 134]);
      const expectedChunks = [expectedChunk1, expectedChunk2];

      const result = Array.from(blob.chunks(chunkSize));

      assert.deepStrictEqual(result, expectedChunks);
    });

    it("should split array of length that is not divisible by chunk size ", () => {
      const blob = BytesBlob.blobFromNumbers([48, 163, 246, 134, 93]);
      const chunkSize = 2;
      const expectedChunk1 = BytesBlob.blobFromNumbers([48, 163]);
      const expectedChunk2 = BytesBlob.blobFromNumbers([246, 134]);
      const expectedChunk3 = BytesBlob.blobFromNumbers([93]);
      const expectedChunks = [expectedChunk1, expectedChunk2, expectedChunk3];

      const result = Array.from(blob.chunks(chunkSize));

      assert.deepStrictEqual(result, expectedChunks);
    });
  });

  describe("compare", () => {
    it("should compare two equal blobs and return 'equal'", () => {
      const blob1 = BytesBlob.blobFromNumbers([47, 163, 246, 134]);
      const blob2 = BytesBlob.blobFromNumbers([47, 163, 246, 134]);

      const result = blob1.compare(blob2);

      assert.strictEqual(result.isEqual(), true);
    });

    it("should compare two blobs and return 'greater'", () => {
      const blob1 = BytesBlob.blobFromNumbers([48, 163, 246, 134]);
      const blob2 = BytesBlob.blobFromNumbers([47, 163, 246, 134]);

      const result = blob1.compare(blob2);

      assert.strictEqual(result.isGreater(), true);
    });

    it("should compare two blobs and return 'less'", () => {
      const blob1 = BytesBlob.blobFromNumbers([47, 163, 246, 134]);
      const blob2 = BytesBlob.blobFromNumbers([48, 163, 246, 134]);

      const result = blob1.compare(blob2);

      assert.strictEqual(result.isLess(), true);
    });

    it("should return 'less' when blob1 is shorter but blobs have the same prefix", () => {
      const blob1 = BytesBlob.blobFromNumbers([163, 246, 134]);
```

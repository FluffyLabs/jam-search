---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/blob-dictionary.test.ts#L1-L114
title: packages/core/collections/blob-dictionary.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 2
content_sha: a2212ef5cb00b2bf49a71be22e0219c840a1a3a05e97f8e390e39818c8fc692e
language: typescript
---
`packages/core/collections/blob-dictionary.test.ts` (lines 1–114)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { HASH_SIZE } from "@typeberry/hash";
import { BlobDictionary, bytesAsU48 } from "./blob-dictionary.js";

const TRESHOLDS = [0, 5, 10];

describe("Blob dictionary", () => {
  describe("bytesAsU48", () => {
    it("should convert bytes to u48", () => {
      const bytes = BytesBlob.parseBlob("0x112233445566").raw;
      const expectedResult = 0x112233445566 * 8 + 6;

      const result = bytesAsU48(bytes);

      assert.strictEqual(result, expectedResult);
    });

    it("should convert empty bytes to 0", () => {
      const bytes = BytesBlob.parseBlob("0x").raw;
      const expectedResult = 0;

      const result = bytesAsU48(bytes);

      assert.strictEqual(result, expectedResult);
    });

    it("should distuingigh shorted chunk and padded with 0s", () => {
      const bytes1 = BytesBlob.parseBlob("0x1122").raw;
      const bytes2 = BytesBlob.parseBlob("0x112200").raw;

      const result1 = bytesAsU48(bytes1);
      const result2 = bytesAsU48(bytes2);

      assert.notStrictEqual(result1, result2);
    });
  });

  describe("public API", () => {
    for (const threshold of TRESHOLDS) {
      describe(`BlobDictionary(${threshold})`, () => {
        it("should add item to BlobDictionary and then return it", () => {
          const key = BytesBlob.parseBlob("0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef");
          const val = { a: 1 };
          const dict = BlobDictionary.new(threshold);

          assert.strictEqual(dict.has(key), false);

          dict.set(key, val);

          assert.strictEqual(dict.has(key), true);

          const result = dict.get(key);

          assert.deepStrictEqual(result, val);
        });

        it("should override existing item", () => {
          const key = BytesBlob.parseBlob("0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef");
          const val1 = { a: 1 };
          const val2 = { a: 2 };
          const dict = BlobDictionary.new(threshold);

          assert.strictEqual(dict.has(key), false);

          dict.set(key, val1);
          dict.set(key, val2);

          const result = dict.get(key);

          assert.deepStrictEqual(result, val2);
        });

        it("should add item to BlobDictionary and then remove it", () => {
          const key = BytesBlob.parseBlob("0x123456789abcdef123456789abcdef123456789abcdef123456789abcdef");
          const val = { a: 1 };
          const dict = BlobDictionary.new(threshold);

          assert.strictEqual(dict.has(key), false);

          dict.set(key, val);

          assert.strictEqual(dict.has(key), true);

          dict.delete(key);

          assert.strictEqual(dict.has(key), false);
        });

        it("should add empty blob as key", () => {
          const key = BytesBlob.empty();
          const val = { a: 1 };
          const dict = BlobDictionary.new(threshold);

          assert.strictEqual(dict.has(key), false);

          dict.set(key, val);

          assert.strictEqual(dict.has(key), true);

          const result = dict.get(key);

          assert.deepStrictEqual(result, val);
        });

        it("should store a few items with the same prefix and then remove all of them", () => {
          const entries = [
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef1"), { index: 1 }] as const,
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef2"), { index: 2 }] as const,
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef3"), { index: 3 }] as const,
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef4"), { index: 4 }] as const,
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef5"), { index: 5 }] as const,
            [BytesBlob.parseBlob("0x112233445566778899aabbccddeef6"), { index: 6 }] as const,
```

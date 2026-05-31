---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/sort-utils.test.ts#L1-L100
title: packages/jam/transition/disputes/sort-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: cd3f23605a15e093d4a2085d97f1e580167dd3e9c8adfd31000ec5c5ec4baa0b
language: typescript
---
`packages/jam/transition/disputes/sort-utils.test.ts` (lines 1–100)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsValidatorIndex } from "@typeberry/block";
import { Judgement } from "@typeberry/block/disputes.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { ED25519_SIGNATURE_BYTES } from "@typeberry/crypto";
import { isUniqueSortedBy, isUniqueSortedByIndex } from "./sort-utils.js";

describe("sort-utils", () => {
  describe("isUniqueSortedBy", () => {
    const buildTestData = (key: string, arrays: number[][]) => ({
      data: arrays.map((arr) => ({ [key]: BytesBlob.blobFromNumbers(arr) })),
      key,
    });

    it("should return true for an empty array", () => {
      const { key, data } = buildTestData("a", []);

      const result = isUniqueSortedBy(data, key);

      assert.strictEqual(result, true);
    });

    it("should return false in case of the same blobs in array", () => {
      const { key, data } = buildTestData("a", [
        [1, 2],
        [1, 2],
      ]);

      const result = isUniqueSortedBy(data, key);

      assert.strictEqual(result, false);
    });

    it("should return false in case of descending order in array", () => {
      const { key, data } = buildTestData("a", [
        [2, 1],
        [1, 2],
      ]);

      const result = isUniqueSortedBy(data, key);

      assert.strictEqual(result, false);
    });

    it("should return true in case of ascending order in array", () => {
      const { key, data } = buildTestData("a", [
        [1, 2],
        [2, 1],
      ]);

      const result = isUniqueSortedBy(data, key);

      assert.strictEqual(result, true);
    });
  });

  describe("isUniqueSortedByIndex", () => {
    const buildTestData = (indices: number[]) =>
      indices.map((index) =>
        Judgement.create({
          isWorkReportValid: true,
          index: tryAsValidatorIndex(index),
          signature: Bytes.zero(ED25519_SIGNATURE_BYTES).asOpaque(),
        }),
      );

    it("should return true for an empty array", () => {
      const judgements = buildTestData([]);

      const result = isUniqueSortedByIndex(judgements);

      assert.strictEqual(result, true);
    });

    it("should return false in case of duplicates in array", () => {
      const judgements = buildTestData([1, 1]);

      const result = isUniqueSortedByIndex(judgements);

      assert.strictEqual(result, false);
    });

    it("should return false in case of descending order in array", () => {
      const judgements = buildTestData([2, 1]);

      const result = isUniqueSortedByIndex(judgements);

      assert.strictEqual(result, false);
    });

    it("should return true in case of ascending order in array", () => {
      const judgements = buildTestData([1, 2]);

      const result = isUniqueSortedByIndex(judgements);

      assert.strictEqual(result, true);
    });
  });
});
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/shuffling/shuffling.test.ts#L1-L72
title: packages/core/shuffling/shuffling.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 891b817e5e1f685f5568607d61ad7d4594ce4dfa95b3d064147d52f81eb09ae1
language: typescript
---
`packages/core/shuffling/shuffling.test.ts` (lines 1–72)

```typescript
import assert from "node:assert";
import { before, describe, it } from "node:test";
import { Bytes } from "@typeberry/bytes";
import { Blake2b } from "@typeberry/hash";
import { fisherYatesShuffle } from "./shuffling.js";

let blake2b: Blake2b;

before(async () => {
  blake2b = await Blake2b.createHasher();
});

function prepareArrayToShuffle(length: number) {
  return Array.from({ length }, (_, i) => i);
}

describe("fisherYatesShuffle", () => {
  it("should do nothing with array of length 0", () => {
    const data = prepareArrayToShuffle(0);
    const entropy = Bytes.zero(32);
    const expectedData: number[] = [];

    const result = fisherYatesShuffle(blake2b, data, entropy);

    assert.deepStrictEqual(result, expectedData);
  });

  it("should do nothing with array of length 1", () => {
    const data = prepareArrayToShuffle(1);
    const entropy = Bytes.zero(32);
    const expectedData = [0];

    const result = fisherYatesShuffle(blake2b, data, entropy);

    assert.deepStrictEqual(result, expectedData);
  });

  it("should correcty shuffle an array of length 7", () => {
    const data = prepareArrayToShuffle(7);
    const entropy = Bytes.zero(32);
    const expectedData = [0, 1, 4, 5, 3, 6, 2];
    const result = fisherYatesShuffle(blake2b, data, entropy);

    assert.deepStrictEqual(result, expectedData);
  });

  it("should correcty shuffle an array of length 37", () => {
    const data = prepareArrayToShuffle(37);
    const entropy = Bytes.zero(32);
    const expectedData = [
      9, 13, 14, 29, 28, 22, 25, 32, 16, 36, 31, 7, 34, 20, 33, 12, 8, 27, 11, 3, 0, 17, 21, 24, 5, 2, 15, 18, 6, 26,
      23, 4, 19, 30, 35, 1, 10,
    ];

    const result = fisherYatesShuffle(blake2b, data, entropy);

    assert.deepStrictEqual(result, expectedData);
  });

  it("should correcty shuffle an array of length 37 (different entropy)", () => {
    const data = prepareArrayToShuffle(37);
    const entropy = Bytes.fill(32, 0xff);
    const expectedData = [
      5, 1, 21, 30, 24, 15, 35, 23, 34, 27, 22, 3, 33, 28, 19, 17, 13, 20, 36, 26, 25, 4, 11, 16, 14, 9, 8, 29, 10, 7,
      31, 6, 18, 0, 32, 2, 12,
    ];

    const result = fisherYatesShuffle(blake2b, data, entropy);

    assert.deepStrictEqual(result, expectedData);
  });
});
```

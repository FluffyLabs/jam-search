---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/sized-array.test.ts#L1-L51
title: packages/core/collections/sized-array.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e9cbf569c826cd073b056acf77d0aa88503ffc9cd6b8c56ea1f7a9dc8d2c3de1
language: typescript
---
`packages/core/collections/sized-array.test.ts` (lines 1–51)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { FixedSizeArray } from "./sized-array.js";

describe("FixedSizeArray", () => {
  it("should verify length", () => {
    const data = ["a", "b", "c"];

    assert.throws(
      () => {
        return FixedSizeArray.new(data, 4);
      },
      {
        name: "Error",
        message: "Assertion failure: Expected an array of size: 4, got: 3",
      },
    );
  });

  it("should prevent adding/removing items", () => {
    const data = [1, 2, 3, 4, 5];
    const arr = FixedSizeArray.new(data, 5);

    assert.throws(
      () => {
        arr.push(1);
      },
      {
        name: "TypeError",
        message: "Cannot add property 5, object is not extensible",
      },
    );
  });

  it("should allow modifications of items", () => {
    const data = [1, 2, 3, 4, 5];
    const arr = FixedSizeArray.new(data, 5);
    assert.strictEqual(arr.length, 5);
    assert.strictEqual(arr[3], 4);
    arr[3] = 6;
    assert.strictEqual(arr[3], 6);
  });

  it("should not create an array of undefined items if the only item passed as data is a number", () => {
    const data = [20];
    const arr = FixedSizeArray.new(data, 1);

    assert.strictEqual(arr[0], 20);
    assert.strictEqual(arr.length, 1);
  });
});
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/array-view.test.ts#L1-L56
title: packages/core/collections/array-view.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 18646f6a2d2cc1529869aa9274c0313161c3e9e11fbce79c42dff359d253aa5e
language: typescript
---
`packages/core/collections/array-view.test.ts` (lines 1–56)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { deepEqual } from "@typeberry/utils";
import { ArrayView } from "./array-view.js";

describe("ArrayView", () => {
  const arr = [10, 20, 30, 40, 50];

  it("creates a view from array", () => {
    const view = ArrayView.from(arr, 1, 4);
    assert.deepEqual(view.length, 3);
    deepEqual([...view], [20, 30, 40]);
  });

  it("throws on invalid range", () => {
    assert.throws(() => ArrayView.from(arr, -1, 3), /Invalid start \(-1\)\/end \(3\) for ArrayView/);
    assert.throws(() => ArrayView.from(arr, 2, 10), /Invalid start \(2\)\/end \(10\) for ArrayView/);
    assert.throws(() => ArrayView.from(arr, 4, 1), /Invalid start \(4\)\/end \(1\) for ArrayView/);
  });

  it("supports get()", () => {
    const view = ArrayView.from(arr, 0, 3);
    assert.equal(view.get(0), 10);
    assert.equal(view.get(2), 30);
    assert.throws(() => view.get(-1), /Index out of bounds./);
    assert.throws(() => view.get(3), /Index out of bounds./);
  });

  it("creates subview correctly", () => {
    const view = ArrayView.from(arr, 1, 5); // [20,30,40,50]
    const sub = view.subview(1, 3); // [30,40]
    deepEqual([...sub], [30, 40]);
    assert.strictEqual(sub.length, 2);
    const subToEnd = view.subview(2); // [40,50]
    deepEqual([...subToEnd], [40, 50]);
    assert.strictEqual(subToEnd.length, 2);
  });

  it("toArray() produces a copy", () => {
    const view = ArrayView.from(arr, 1, 4);
    const copy = view.toArray();
    assert.deepEqual(copy, [20, 30, 40]);
    copy[0] = 999;
    assert.strictEqual(arr[1], 20);
  });

  it("works with for-of and spread", () => {
    const view = ArrayView.from(arr, 2, 5); // [30,40,50]
    const collected: number[] = [];
    for (const x of view) {
      collected.push(x);
    }
    deepEqual(collected, [30, 40, 50]);
    deepEqual([...view], [30, 40, 50]);
  });
});
```

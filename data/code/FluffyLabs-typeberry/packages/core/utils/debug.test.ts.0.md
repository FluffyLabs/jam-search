---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/debug.test.ts#L1-L60
title: packages/core/utils/debug.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f8b549069b0c7ef4f71f4006691dfe400534d426b9da48d5a340ab37c6eabe08
language: typescript
---
`packages/core/utils/debug.test.ts` (lines 1–60)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { check, inspect, lazyInspect, memoryTracker, memoryUsage } from "./debug.js";

describe("utils::check", () => {
  it("should do nothing if condition is met", () => {
    check`${true} I shall not fail!`;
  });

  it("should throw exception with message if condition is not met", () => {
    const num = 10;
    assert.throws(() => {
      check`${false} Oopsie ${4}, ${"!"} ${num}`;
    }, new Error("Assertion failure: Oopsie 4, ! 10"));
  });
});

describe("utils::lazyInspect", () => {
  it("should correctly print a map", () => {
    const map = new Map([
      ["a", 1],
      ["b", 2],
    ]);

    const lazyInspectedMap = `${lazyInspect(map)}`;
    const expected = inspect(map);

    assert.strictEqual(lazyInspectedMap, expected);
  });
});

describe("utils::memoryUsage", () => {
  it("should report all memory fields", () => {
    const usage = memoryUsage(true);
    for (const field of ["rss=", "heap=", "external=", "arrayBuffers="]) {
      assert.ok(usage.includes(field), `expected "${field}" in "${usage}"`);
    }
  });
  it("should report all memory fields without details", () => {
    const usage = memoryUsage(false);
    for (const field of ["rss=", "heap="]) {
      assert.ok(usage.includes(field), `expected "${field}" in "${usage}"`);
    }
  });
});

describe("utils::memoryTracker", () => {
  it("should not include a delta on the first call", () => {
    const tracker = memoryTracker(true);
    assert.ok(!tracker.toString().includes("Δrss"));
  });

  it("should include a delta on subsequent calls", () => {
    const tracker = memoryTracker(true);
    tracker.toString();
    const second = tracker.toString();
    assert.ok(second.includes("Δrss="), `expected delta in "${second}"`);
    assert.ok(second.includes("ΔarrayBuffers="), `expected delta in "${second}"`);
  });
});
```

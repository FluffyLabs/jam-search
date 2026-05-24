---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/debug.test.ts#L1-L30
title: packages/core/utils/debug.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 36c8d3c1442fef3a581b7ed0296463b4eb119fa54da929950d68a9c986d952ce
language: typescript
---
`packages/core/utils/debug.test.ts` (lines 1–30)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { check, inspect, lazyInspect } from "./debug.js";

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
```

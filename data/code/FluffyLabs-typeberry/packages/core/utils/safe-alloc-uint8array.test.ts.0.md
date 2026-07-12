---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/safe-alloc-uint8array.test.ts#L1-L17
title: packages/core/utils/safe-alloc-uint8array.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 025beb860536eaa8dc1f219e319b4c9f404867bb14aed4b9f7bc9d0c411f53b5
language: typescript
---
`packages/core/utils/safe-alloc-uint8array.test.ts` (lines 1–17)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { MAX_LENGTH, safeAllocUint8Array } from "./safe-alloc-uint8array.js";

describe("safeAllocUint8Array", () => {
  it("should allocate a Uint8Array with the given length", () => {
    const length = 1000;
    const arr = safeAllocUint8Array(length);
    assert.equal(length, arr.length);
  });

  it("should clamp the length to the maximum length", () => {
    const length = MAX_LENGTH + 100;
    const arr = safeAllocUint8Array(length);
    assert.equal(MAX_LENGTH, arr.length);
  });
});
```

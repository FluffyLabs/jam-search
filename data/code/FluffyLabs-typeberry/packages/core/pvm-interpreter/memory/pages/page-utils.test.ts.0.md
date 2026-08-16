---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/pages/page-utils.test.ts#L1-L22
title: packages/core/pvm-interpreter/memory/pages/page-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2c19bae99d62c190b00d3d3bc18ba7b72773db7b04e68e2575f16f64e1adda5e
language: typescript
---
`packages/core/pvm-interpreter/memory/pages/page-utils.test.ts` (lines 1–22)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { LAST_PAGE_NUMBER } from "../memory-consts.js";
import { getNextPageNumber, tryAsPageNumber } from "./page-utils.js";

describe("page-utils / getNextPageNumber", () => {
  it("should increment the page number", () => {
    const pageNumber = tryAsPageNumber(5);

    const nextPageNumber = getNextPageNumber(pageNumber);

    assert.strictEqual(nextPageNumber, pageNumber + 1);
  });

  it("should return 0 for the last page number", () => {
    const pageNumber = tryAsPageNumber(LAST_PAGE_NUMBER);

    const nextPageNumber = getNextPageNumber(pageNumber);

    assert.strictEqual(nextPageNumber, 0);
  });
});
```

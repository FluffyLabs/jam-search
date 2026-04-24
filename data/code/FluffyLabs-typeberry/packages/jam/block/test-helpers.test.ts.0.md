---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/test-helpers.test.ts#L1-L16
title: packages/jam/block/test-helpers.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 371b37dabd358440b54cd2e1c4fadd796a06fff010b0339eeebb96db28eb91d0
language: typescript
---
`packages/jam/block/test-helpers.test.ts` (lines 1–16)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { inspect } from "@typeberry/utils";
import { testBlockView } from "./test-helpers.js";

describe("test helpers", () => {
  it("block view should proper toString", () => {
    const blockView = testBlockView();
    assert.strictEqual(`${blockView}`, "View<Block>(cache: 0)");
  });

  it("block view should not fail when inspecting", () => {
    const blockView = testBlockView();
    assert.strictEqual(`${inspect(blockView)}`, "View<Block>(cache: 0)");
  });
});
```

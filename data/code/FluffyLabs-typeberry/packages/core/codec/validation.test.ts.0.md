---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/validation.test.ts#L1-L19
title: packages/core/codec/validation.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 0c2175577c0d6d89cc6cab44479bff59375962ea2fd95befbd15da64ebd5ba79
language: typescript
---
`packages/core/codec/validation.test.ts` (lines 1–19)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { validateLength } from "./validation.js";

describe("Codec validation", () => {
  it("should throw when length is out of range", () => {
    const range = { minLength: 3, maxLength: 16 };
    assert.throws(() => {
      validateLength(range, 0, "info");
    }, new Error("info: length is below minimal. 0 < 3"));

    assert.throws(() => {
      validateLength(range, 17, "info");
    }, new Error("info: length is above maximal. 17 > 16"));

    // this should not throw
    validateLength(range, 16, "info");
  });
});
```

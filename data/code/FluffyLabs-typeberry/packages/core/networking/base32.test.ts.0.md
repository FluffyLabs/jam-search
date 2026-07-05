---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/base32.test.ts#L1-L12
title: packages/core/networking/base32.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1f61f5666a7bd31e12169d2479d23e1eef71d1ca570c51f808d3a5e6fd4912fe
language: typescript
---
`packages/core/networking/base32.test.ts` (lines 1–12)

```typescript
import { strictEqual } from "node:assert";
import { describe, it } from "node:test";
import { BytesBlob } from "@typeberry/bytes";
import { base32 } from "./base32.js";

describe("base32 encoding", () => {
  it("should encode to base32", () => {
    const bytes = BytesBlob.parseBlob("0x3b6a27bcceb6a42d62a3a8d02a6f0d73653215771de243a63ac048a18b59da29");

    strictEqual(base32(bytes.raw), "3r2oc62zwfj3crnuifuvsxvbtlzetk4o5qyhetkhagsc2fgl2oka");
  });
});
```

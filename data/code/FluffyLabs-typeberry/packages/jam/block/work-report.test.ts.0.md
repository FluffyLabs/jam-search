---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/work-report.test.ts#L1-L21
title: packages/jam/block/work-report.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 8747ff8fc97ec211b34c49a0c2e5de9127f40afe1f3a57fd81634764fde0acff
language: typescript
---
`packages/jam/block/work-report.test.ts` (lines 1–21)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { Encoder } from "@typeberry/codec";
import { tryAsU32 } from "@typeberry/numbers";
import { tryAsServiceGas } from "./common.js";
import { WorkRefineLoad } from "./work-result.js";

describe("WorkReport", () => {
  it("should encode work refine load", () => {
    const load = WorkRefineLoad.create({
      gasUsed: tryAsServiceGas(0),
      importedSegments: tryAsU32(0),
      exportedSegments: tryAsU32(0),
      extrinsicCount: tryAsU32(0),
      extrinsicSize: tryAsU32(0),
    });

    const encoded = Encoder.encodeObject(WorkRefineLoad.Codec, load);
    assert.deepStrictEqual(encoded.toString(), "0x0000000000");
  });
});
```

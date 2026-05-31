---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/test-helpers.ts#L1-L22
title: packages/jam/block/test-helpers.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 824d2238c800b87313e0b57ed7413f41a5e61db93cb29a55645a672672ea44cc
language: typescript
---
`packages/jam/block/test-helpers.ts` (lines 1–22)

```typescript
import { BytesBlob } from "@typeberry/bytes";
import { Decoder } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { Block } from "./block.js";
import testBlockData from "./test-block.js";
import testWorkReportData from "./test-work-report.js";

export function testBlockHex() {
  return testBlockData;
}

export function testBlock() {
  return Decoder.decodeObject(Block.Codec, BytesBlob.parseBlob(testBlockHex()), tinyChainSpec);
}

export function testBlockView() {
  return Decoder.decodeObject(Block.Codec.View, BytesBlob.parseBlob(testBlockHex()), tinyChainSpec);
}

export function testWorkReportHex() {
  return testWorkReportData;
}
```

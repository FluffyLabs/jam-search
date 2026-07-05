---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/block.ts#L1-L22
title: packages/jam/block-json/block.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 26ddb962c7544d11b9bc5c78d9155988213a8be06440721c1609de11038bf6e7
language: typescript
---
`packages/jam/block-json/block.ts` (lines 1–22)

```typescript
import { Block, reencodeAsView } from "@typeberry/block";
import type { ChainSpec } from "@typeberry/config";
import { json, parseFromJson } from "@typeberry/json-parser";
import { getExtrinsicFromJson } from "./extrinsic.js";
import { headerFromJson } from "./header.js";

export const blockFromJson = (spec: ChainSpec) =>
  json.object<Block>(
    {
      header: headerFromJson,
      extrinsic: getExtrinsicFromJson(spec),
    },
    ({ header, extrinsic }) => Block.create({ header, extrinsic }),
  );

export const blockViewFromJson = (spec: ChainSpec) => {
  const parseBlock = blockFromJson(spec);
  return json.fromAny((p) => {
    const block = parseFromJson(p, parseBlock);
    return reencodeAsView(Block.Codec, block, spec);
  });
};
```

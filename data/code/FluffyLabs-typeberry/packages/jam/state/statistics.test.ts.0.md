---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/statistics.test.ts#L1-L14
title: packages/jam/state/statistics.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6105ac8211d3ef8ad17f8326262edd41e2f0633b5201bcc1d6bbf054def1c2a2
language: typescript
---
`packages/jam/state/statistics.test.ts` (lines 1–14)

```typescript
import { describe, it } from "node:test";
import { BytesBlob } from "@typeberry/bytes";
import { Decoder } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { StatisticsData } from "./statistics.js";

describe("Statistics", () => {
  const STATISTICS =
    "0x010000000300000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000100000000000000030000000600000000000000000000000000000000000000010000000300000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000810e000000000000000000010000000000000100000000000000";

  it("should decode statistics data with no error", () => {
    Decoder.decodeObject(StatisticsData.Codec, BytesBlob.parseBlob(STATISTICS), tinyChainSpec);
  });
});
```

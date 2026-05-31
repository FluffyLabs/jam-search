---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/accumulation-output.ts#L1-L11
title: packages/jam/state-json/accumulation-output.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: dbe7e6309cdf782e80c0aa78702d651ea8c459fe0ed266e1e9f246b52d935ae7
language: typescript
---
`packages/jam/state-json/accumulation-output.ts` (lines 1–11)

```typescript
import { fromJson } from "@typeberry/block-json";
import { json } from "@typeberry/json-parser";
import { AccumulationOutput } from "@typeberry/state/accumulation-output.js";

export const accumulationOutput = json.object<AccumulationOutput>(
  {
    serviceId: "number",
    output: fromJson.bytes32(),
  },
  ({ serviceId, output }) => AccumulationOutput.create({ serviceId, output }),
);
```

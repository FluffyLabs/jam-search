---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/extrinsic.ts#L1-L22
title: packages/jam/block-json/extrinsic.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9e062a704697b860aa701d5525a5b561deca0b47ebce53be9c016b1b3d6dbbdb
language: typescript
---
`packages/jam/block-json/extrinsic.ts` (lines 1–22)

```typescript
import { Extrinsic } from "@typeberry/block";
import type { ChainSpec } from "@typeberry/config";
import { json } from "@typeberry/json-parser";

import { getAssurancesExtrinsicFromJson } from "./assurances-extrinsic.js";
import { disputesExtrinsicFromJson } from "./disputes-extrinsic.js";
import { guaranteesExtrinsicFromJson } from "./guarantees-extrinsic.js";
import { preimagesExtrinsicFromJson } from "./preimages-extrinsic.js";
import { ticketsExtrinsicFromJson } from "./tickets-extrinsic.js";

export const getExtrinsicFromJson = (ctx: ChainSpec) =>
  json.object<Extrinsic>(
    {
      tickets: ticketsExtrinsicFromJson,
      preimages: preimagesExtrinsicFromJson,
      guarantees: guaranteesExtrinsicFromJson,
      assurances: getAssurancesExtrinsicFromJson(ctx),
      disputes: disputesExtrinsicFromJson,
    },
    ({ tickets, preimages, guarantees, assurances, disputes }) =>
      Extrinsic.create({ tickets, preimages, guarantees, assurances, disputes }),
  );
```

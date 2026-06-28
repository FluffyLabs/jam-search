---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/assurances-extrinsic.ts#L1-L23
title: packages/jam/block-json/assurances-extrinsic.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 38ad65951763908f3272eb952ec94d27a3d0a6a25dd2a1b37e5c82c130d23784
language: typescript
---
`packages/jam/block-json/assurances-extrinsic.ts` (lines 1–23)

```typescript
import { AvailabilityAssurance } from "@typeberry/block/assurances.js";
import { BitVec, Bytes } from "@typeberry/bytes";
import type { ChainSpec } from "@typeberry/config";
import { json } from "@typeberry/json-parser";
import { fromJson } from "./common.js";
import type { JsonObject } from "./json-format.js";

const getAvailabilityAssuranceFromJson = (ctx: ChainSpec) =>
  json.object<JsonObject<AvailabilityAssurance>, AvailabilityAssurance>(
    {
      anchor: fromJson.bytes32(),
      bitfield: json.fromString((v) => {
        const bytes = Math.ceil(ctx.coresCount / 8);
        return BitVec.fromBytes(Bytes.parseBytes(v, bytes), ctx.coresCount);
      }),
      validator_index: "number",
      signature: fromJson.ed25519Signature,
    },
    ({ anchor, bitfield, validator_index, signature }) =>
      AvailabilityAssurance.create({ anchor, bitfield, validatorIndex: validator_index, signature }),
  );

export const getAssurancesExtrinsicFromJson = (ctx: ChainSpec) => json.array(getAvailabilityAssuranceFromJson(ctx));
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/preimages-extrinsic.ts#L1-L13
title: packages/jam/block-json/preimages-extrinsic.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 59518c082b7a92f35817c9eeed6f012bcf678ffc747829bbf5aa11a5b5831e95
language: typescript
---
`packages/jam/block-json/preimages-extrinsic.ts` (lines 1–13)

```typescript
import { Preimage } from "@typeberry/block/preimage.js";
import { BytesBlob } from "@typeberry/bytes";
import { json } from "@typeberry/json-parser";

const preimageFromJson = json.object<Preimage>(
  {
    requester: "number",
    blob: json.fromString(BytesBlob.parseBlob),
  },
  ({ requester, blob }) => Preimage.create({ requester, blob }),
);

export const preimagesExtrinsicFromJson = json.array(preimageFromJson);
```

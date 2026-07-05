---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/refine-context.ts#L1-L33
title: packages/jam/block-json/refine-context.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0057a82067721fbd3432f04299248250c44c4284c2981638157b8516f531e54f
language: typescript
---
`packages/jam/block-json/refine-context.ts` (lines 1–33)

```typescript
import type { HeaderHash, StateRootHash, TimeSlot } from "@typeberry/block";
import { type BeefyHash, RefineContext, type WorkPackageHash } from "@typeberry/block/refine-context.js";
import { json } from "@typeberry/json-parser";
import { fromJson } from "./common.js";

export const refineContextFromJson = json.object<JsonRefineContext, RefineContext>(
  {
    anchor: fromJson.bytes32(),
    state_root: fromJson.bytes32(),
    beefy_root: fromJson.bytes32(),
    lookup_anchor: fromJson.bytes32(),
    lookup_anchor_slot: "number",
    prerequisites: json.array(fromJson.bytes32()),
  },
  ({ anchor, state_root, beefy_root, lookup_anchor, lookup_anchor_slot, prerequisites }) =>
    RefineContext.create({
      anchor,
      stateRoot: state_root,
      beefyRoot: beefy_root,
      lookupAnchor: lookup_anchor,
      lookupAnchorSlot: lookup_anchor_slot,
      prerequisites,
    }),
);

type JsonRefineContext = {
  anchor: HeaderHash;
  state_root: StateRootHash;
  beefy_root: BeefyHash;
  lookup_anchor: HeaderHash;
  lookup_anchor_slot: TimeSlot;
  prerequisites: WorkPackageHash[];
};
```

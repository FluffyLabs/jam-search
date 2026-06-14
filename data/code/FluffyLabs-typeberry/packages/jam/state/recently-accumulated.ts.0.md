---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/recently-accumulated.ts#L1-L19
title: packages/jam/state/recently-accumulated.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 2393e3d8a34e51e158c2c66b9f37bff20b48ec4d94fd9de93ed5853b94c27921
language: typescript
---
`packages/jam/state/recently-accumulated.ts` (lines 1–19)

```typescript
import { codecPerEpochBlock, type PerEpochBlock } from "@typeberry/block";
import type { WorkPackageHash } from "@typeberry/block/refine-context.js";
import { codec, type DescribedBy, type SequenceView } from "@typeberry/codec";
import { HashSet, type ImmutableHashSet } from "@typeberry/collections";
import { HASH_SIZE } from "@typeberry/hash";

export type RecentlyAccumulated = PerEpochBlock<ImmutableHashSet<WorkPackageHash>>;

export const recentlyAccumulatedCodec = codecPerEpochBlock<
  ImmutableHashSet<WorkPackageHash>,
  SequenceView<WorkPackageHash>
>(
  codec.sequenceVarLen(codec.bytes(HASH_SIZE).asOpaque<WorkPackageHash>()).convert(
    (x) => Array.from(x),
    (x) => HashSet.from(x),
  ),
);

export type RecentlyAccumulatedView = DescribedBy<typeof recentlyAccumulatedCodec.View>;
```

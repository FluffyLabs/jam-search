---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/hash.ts#L1-L22
title: packages/jam/block/hash.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: affa7a264afbb8b7d0392427e9a9ec4953474c95b9740a45b9366ad4cf6a2a3f
language: typescript
---
`packages/jam/block/hash.ts` (lines 1–22)

```typescript
import type { OpaqueHash } from "@typeberry/hash";
import type { Opaque } from "@typeberry/utils";

/**
 * Blake2B hash of JAM-encoding of some header.
 *
 * https://graypaper.fluffylabs.dev/#/579bd12/0c7b000c7e00
 */
export type HeaderHash = Opaque<OpaqueHash, "HeaderHash">;

/** Blake2B hash of JAM-encoding of some work report. */
export type WorkReportHash = Opaque<OpaqueHash, "WorkReportHash">;

/**
 * Blake2B merkle commitment to the block's extrinsic data.
 *
 * https://graypaper.fluffylabs.dev/#/579bd12/0ca1000ca400
 */
export type ExtrinsicHash = Opaque<OpaqueHash, "ExtrinsicHash">;

/** Blake2B hash of some service / authorization code. */
export type CodeHash = Opaque<OpaqueHash, "CodeHash">;
```

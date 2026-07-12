---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/work-item-segment.ts#L1-L42
title: packages/jam/block/work-item-segment.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9529a85ffbb90b876edd6cf7ebc7a1521970b5ea86c23fdc00e97c5713f70ecd
language: typescript
---
`packages/jam/block/work-item-segment.ts` (lines 1–42)

```typescript
import type { Bytes } from "@typeberry/bytes";
import { tryAsU16, type U16 } from "@typeberry/numbers";
import { asOpaqueType, type Opaque } from "@typeberry/utils";

/**
 * `W_E`: The basic size of erasure-coded pieces in octets. See equation H.6.
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/449600449700?v=0.7.2
 */
export const W_E = 684;

/**
 * `W_P`: The size of an exported segment in erasure-coded pieces in octets.
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/44b10044b200?v=0.7.2
 */
export const W_P = 6;

/**
 * `W_M`: The maximum number of imports in a work-package manifest.
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/44ad0044ae00?v=0.7.2
 */
export const MAX_NUMBER_OF_IMPORTS_WP = 3072;

/**
 * `W_X`: The maximum number of exports in a work-package manifest.
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/44be0044bf00?v=0.7.2
 */
export const MAX_NUMBER_OF_EXPORTS_WP = 3072;

/**
 * `W_G = W_E * W_P`: Exported segment size in bytes.
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/449a00449b00?v=0.7.2
 */
export const SEGMENT_BYTES = W_E * W_P;
export type SEGMENT_BYTES = typeof SEGMENT_BYTES;

/** Exported segment data. */
export type Segment = Bytes<SEGMENT_BYTES>;

/** Index of an segment. */
export type SegmentIndex = Opaque<U16, "Segment Index [U16]">;
/** Attempt to convert a number into `SegmentIndex`. */
export const tryAsSegmentIndex = (v: number): SegmentIndex => asOpaqueType(tryAsU16(v));
```

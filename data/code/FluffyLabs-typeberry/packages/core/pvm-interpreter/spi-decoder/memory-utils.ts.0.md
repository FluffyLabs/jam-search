---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/spi-decoder/memory-utils.ts#L1-L13
title: packages/core/pvm-interpreter/spi-decoder/memory-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 8aabbcc20d1f663078ffc279539eec91b4a3117e8ebb4f148d91225520c876ce
language: typescript
---
`packages/core/pvm-interpreter/spi-decoder/memory-utils.ts` (lines 1–13)

```typescript
import { PAGE_SIZE, SEGMENT_SIZE } from "./memory-conts.js";

// GP reference: https://graypaper.fluffylabs.dev/#/579bd12/2bd2022bd202

export function alignToSegmentSize(size: number) {
  // Q(x) from GP
  return SEGMENT_SIZE * Math.ceil(size / SEGMENT_SIZE);
}

export function alignToPageSize(size: number) {
  // P(x) from GP
  return PAGE_SIZE * Math.ceil(size / PAGE_SIZE);
}
```

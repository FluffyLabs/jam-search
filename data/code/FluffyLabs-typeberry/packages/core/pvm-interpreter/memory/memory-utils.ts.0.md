---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-utils.ts#L1-L20
title: packages/core/pvm-interpreter/memory/memory-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 6bf3eca41d633dde827ff667d83b34c2edff41368f96085ed0b4dadf38d4b016
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-utils.ts` (lines 1–20)

```typescript
import { PAGE_SIZE, PAGE_SIZE_SHIFT } from "./memory-consts.js";
import { type MemoryIndex, type SbrkIndex, tryAsMemoryIndex } from "./memory-index.js";
import { type PageNumber, tryAsPageNumber } from "./pages/page-utils.js";

export function alignToPageSize(length: number) {
  return PAGE_SIZE * Math.ceil(length / PAGE_SIZE);
}

export function getPageNumber(address: MemoryIndex | SbrkIndex) {
  return tryAsPageNumber(address >>> PAGE_SIZE_SHIFT);
}

export function getStartPageIndex(address: MemoryIndex) {
  return tryAsMemoryIndex((address >>> PAGE_SIZE_SHIFT) << PAGE_SIZE_SHIFT);
}

export function getStartPageIndexFromPageNumber(pageNumber: PageNumber) {
  // >>> 0 is needed to avoid changing sign of the number
  return tryAsMemoryIndex((pageNumber << PAGE_SIZE_SHIFT) >>> 0);
}
```

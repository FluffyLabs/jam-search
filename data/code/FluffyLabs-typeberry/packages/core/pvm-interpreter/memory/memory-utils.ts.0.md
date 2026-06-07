---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-utils.ts#L1-L21
title: packages/core/pvm-interpreter/memory/memory-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 3ec2f72193e2dbd520b6a7aff83dca7685401ad1455b94fb20a4caca4a46c28c
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-utils.ts` (lines 1–21)

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
  // >>> 0 is needed to avoid changing sign of the number
  return tryAsMemoryIndex(((address >>> PAGE_SIZE_SHIFT) << PAGE_SIZE_SHIFT) >>> 0);
}

export function getStartPageIndexFromPageNumber(pageNumber: PageNumber) {
  // >>> 0 is needed to avoid changing sign of the number
  return tryAsMemoryIndex((pageNumber << PAGE_SIZE_SHIFT) >>> 0);
}
```

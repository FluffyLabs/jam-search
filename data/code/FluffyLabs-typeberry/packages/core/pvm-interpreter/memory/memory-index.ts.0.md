---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-index.ts#L1-L16
title: packages/core/pvm-interpreter/memory/memory-index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 90b1ca25f2855c3318935e3d147514e833483fdfb7970f7ea7b1bb2ba07edf78
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-index.ts` (lines 1–16)

```typescript
import { MAX_MEMORY_INDEX } from "@typeberry/pvm-interface";
import { asOpaqueType, check, type Opaque } from "@typeberry/utils";

export type MemoryIndex = Opaque<number, "memory index">;

export const tryAsMemoryIndex = (index: number): MemoryIndex => {
  check`${index >= 0 && index <= MAX_MEMORY_INDEX} Incorrect memory index: ${index}!`;
  return asOpaqueType(index);
};

export type SbrkIndex = Opaque<number, "sbrk index">;

export const tryAsSbrkIndex = (index: number): SbrkIndex => {
  check`${index >= 0 && index <= MAX_MEMORY_INDEX + 1} Incorrect sbrk index: ${index}!`;
  return asOpaqueType(index);
};
```

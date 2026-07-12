---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interface/memory.ts#L1-L24
title: packages/core/pvm-interface/memory.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b2285b5f3137158f27bfa79928f8bc66f9d0cbb82e553e558818a7378a3e3706
language: typescript
---
`packages/core/pvm-interface/memory.ts` (lines 1–24)

```typescript
import { tryAsU32, type U32 } from "@typeberry/numbers";
import type { OK, Result } from "@typeberry/utils";

export const MAX_MEMORY_INDEX = 0xffff_ffff;
export const MEMORY_SIZE = MAX_MEMORY_INDEX + 1;

const PAGE_SIZE_SHIFT = 12;

export type PageFault = {
  address: U32;
};

export function getPageStartAddress(address: U32): U32 {
  return tryAsU32(((address >>> PAGE_SIZE_SHIFT) << PAGE_SIZE_SHIFT) >>> 0);
}

/** Allows store and read segments of memory. */
export interface IMemory {
  /** Store bytes into memory at given address. */
  store(address: U32, bytes: Uint8Array): Result<OK, PageFault>;

  /** Load bytes from memory from given address into given buffer. */
  read(address: U32, result: Uint8Array): Result<OK, PageFault>;
}
```

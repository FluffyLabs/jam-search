---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-consts.ts#L1-L19
title: packages/core/pvm-interpreter/memory/memory-consts.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 969db5263f79fa700ba8e27718b30bd98c9a69a1a70e1ec53f4a631cb5f6290a
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-consts.ts` (lines 1–19)

```typescript
import { MEMORY_SIZE } from "@typeberry/pvm-interface";
import { check } from "@typeberry/utils";

export const PAGE_SIZE_SHIFT = 12;
// PAGE_SIZE has to be a power of 2
export const PAGE_SIZE = 1 << PAGE_SIZE_SHIFT;
const MIN_ALLOCATION_SHIFT = (() => {
  const MIN_ALLOCATION_SHIFT = 7;
  check`${MIN_ALLOCATION_SHIFT >= 0 && MIN_ALLOCATION_SHIFT < PAGE_SIZE_SHIFT} incorrect minimal allocation shift`;
  return MIN_ALLOCATION_SHIFT;
})();

export const MIN_ALLOCATION_LENGTH = PAGE_SIZE >> MIN_ALLOCATION_SHIFT;
export const LAST_PAGE_NUMBER = (MEMORY_SIZE - PAGE_SIZE) / PAGE_SIZE;

/** https://graypaper.fluffylabs.dev/#/68eaa1f/35a60235a602?v=0.6.4 */
export const RESERVED_NUMBER_OF_PAGES = 16;
/** https://graypaper.fluffylabs.dev/#/68eaa1f/35a60235a602?v=0.6.4 */
export const MAX_NUMBER_OF_PAGES = MEMORY_SIZE / PAGE_SIZE;
```

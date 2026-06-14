---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/sort-utils.ts#L1-L28
title: packages/jam/transition/disputes/sort-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: bbf67c289959d956198ac9dd3995bc1752bd6cd5245a9f04e7c5d239cfac3bd9
language: typescript
---
`packages/jam/transition/disputes/sort-utils.ts` (lines 1–28)

```typescript
import type { Judgement } from "@typeberry/block/disputes.js";
import type { BytesBlob } from "@typeberry/bytes";

/**
 * A function that checks if an array of object is ascending sorted by key that is BytesBlob and there is no duplicates
 */
export function isUniqueSortedBy<T extends Record<K, BytesBlob>, K extends keyof T>(arr: T[], key: K) {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i - 1][key].compare(arr[i][key]).isGreaterOrEqual()) {
      return false;
    }
  }

  return true;
}

/**
 * A function that checks if an array of Judgements is ascending sorted by index and there is no duplicates
 */
export function isUniqueSortedByIndex(judgements: readonly Judgement[]) {
  for (let i = 1; i < judgements.length; i++) {
    if (judgements[i - 1].index >= judgements[i].index) {
      return false;
    }
  }

  return true;
}
```

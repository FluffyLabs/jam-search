---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/sorted-set.ts#L114-L127
title: packages/core/collections/sorted-set.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: c13c66795b5f533bcc71c7e4d9c8b7567a2b2554f2413ca5379f07369fb2b45b
language: typescript
---
`packages/core/collections/sorted-set.ts` (lines 114–127)

```typescript
    const mergedLength = mergedArray.length;

    let j = 1;
    for (let i = 1; i < mergedLength; i++) {
      if (comparator(mergedArray[i - 1], mergedArray[i]).isNotEqual()) {
        mergedArray[j++] = mergedArray[i];
      }
    }

    mergedArray.length = j;

    return SortedSet.fromSortedArray(comparator, mergedArray);
  }
}
```

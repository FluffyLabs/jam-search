---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/sorted-set.ts#L114-L123
title: packages/core/collections/sorted-set.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: 7ee207dbaaba97aac010e0fc1615802e7e4c51a65fc6cb732d71391c9a7f342e
language: typescript
---
`packages/core/collections/sorted-set.ts` (lines 114–123)

```typescript
      if (comparator(mergedArray[i - 1], mergedArray[i]).isNotEqual()) {
        mergedArray[j++] = mergedArray[i];
      }
    }

    mergedArray.length = j;

    return SortedSet.fromSortedArray(comparator, mergedArray);
  }
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/sorted-set.test.ts#L124-L139
title: packages/core/collections/sorted-set.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: ae2aa55f9afe5b8a653ed8e21518a1f14c270b79a7da6efd0b12cf6555ba79a6
language: typescript
---
`packages/core/collections/sorted-set.test.ts` (lines 124–139)

```typescript
      const result = SortedSet.fromTwoSortedCollections(toMerge1, toMerge2);

      assert.deepStrictEqual(result.slice(), arr);
    });

    it("should merge two sets with one duplicated item", () => {
      const arr: number[] = [0];
      const toMerge1 = SortedSet.fromArrayUnique(cmp, arr);
      const toMerge2 = SortedSet.fromArrayUnique(cmp, arr);

      const result = SortedSet.fromTwoSortedCollections(toMerge1, toMerge2);

      assert.deepStrictEqual(result.slice(), arr);
    });
  });
});
```

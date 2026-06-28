---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/sorted-set.test.ts#L129-L170
title: packages/core/collections/sorted-set.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: d5e556dcda8d9e6586fd03d86d92bcbd7df94f805a50e5c5d8f8ba014d76117f
language: typescript
---
`packages/core/collections/sorted-set.test.ts` (lines 129–170)

```typescript
    it("should merge two sorted sets without duplicates", () => {
      const arr1 = [1, 2, 3];
      const arr2 = [4, 5, 6];
      const toMerge1 = SortedSet.fromArrayUnique(cmp, arr1);
      const toMerge2 = SortedSet.fromArrayUnique(cmp, arr2);

      const result = SortedSet.fromTwoSortedCollections(toMerge1, toMerge2);

      assert.deepStrictEqual(result.slice(), [...arr1, ...arr2]);
    });

    it("should merge two sorted sets with duplicates", () => {
      const arr = [1, 2, 3];
      const toMerge1 = SortedSet.fromArrayUnique(cmp, arr);
      const toMerge2 = SortedSet.fromArrayUnique(cmp, arr);

      const result = SortedSet.fromTwoSortedCollections(toMerge1, toMerge2);

      assert.deepStrictEqual(result.slice(), arr);
    });

    it("should merge two empty sets", () => {
      const arr: number[] = [];
      const toMerge1 = SortedSet.fromArrayUnique(cmp, arr);
      const toMerge2 = SortedSet.fromArrayUnique(cmp, arr);

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

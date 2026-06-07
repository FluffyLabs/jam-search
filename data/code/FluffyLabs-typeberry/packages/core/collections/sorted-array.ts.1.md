---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/sorted-array.ts#L137-L209
title: packages/core/collections/sorted-array.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 38f96ff4efdc844dfc056e73e3f8be99c5e194544d40a6bb528c0afb5ecbdf47
language: typescript
---
`packages/core/collections/sorted-array.ts` (lines 137–209)

```typescript
    const cmp = this.comparator;

    let low = 0;
    let high = arr.length;

    while (low < high) {
      const mid = (high + low) >> 1;
      const r = cmp(arr[mid], v);
      if (r.isEqual()) {
        return {
          idx: mid,
          isEqual: true,
        };
      }

      if (r.isLess()) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    return {
      idx: low,
      isEqual: false,
    };
  }

  /** Create a new SortedArray from two sorted collections. */
  static fromTwoSortedCollections<V>(first: ImmutableSortedArray<V>, second: ImmutableSortedArray<V>) {
    check`${first.comparator === second.comparator} Cannot merge arrays if they do not use the same comparator`;
    const comparator = first.comparator;
    const arr1 = first.array;
    const arr1Length = arr1.length;
    const arr2 = second.array;
    const arr2Length = arr2.length;

    const resultLength = arr1Length + arr2Length;
    const result: V[] = new Array(resultLength);

    let i = 0; // arr1 index
    let j = 0; // arr2 index
    let k = 0; // result array index

    while (i < arr1Length && j < arr2Length) {
      if (comparator(arr1[i], arr2[j]).isLess()) {
        result[k++] = arr1[i++];
      } else if (comparator(arr1[i], arr2[j]).isGreater()) {
        result[k++] = arr2[j++];
      } else {
        result[k++] = arr1[i++];
        result[k++] = arr2[j++];
      }
    }

    while (i < arr1Length) {
      result[k++] = arr1[i++];
    }

    while (j < arr2Length) {
      result[k++] = arr2[j++];
    }

    return SortedArray.fromSortedArray(comparator, result);
  }

  /** it allows to use SortedArray in for-of loop */
  *[Symbol.iterator]() {
    for (const value of this.array) {
      yield value;
    }
  }
}
```

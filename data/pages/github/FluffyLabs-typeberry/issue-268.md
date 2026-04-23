---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/268'
title: Consider using `iterators/generators` for lazy-processing of large arrays.
site: github.com/FluffyLabs/typeberry
created_at: '2025-02-21T21:13:51.000Z'
last_modified: '2025-02-21T21:13:51.000Z'
content_kind: issue
---

# Consider using `iterators/generators` for lazy-processing of large arrays.

## Issue by @tomusdrw

I recently found myself doing a lot of `for-of` loops over data (I expect this is going to be pretty common in the future).

However I started wondering about performance in some of these cases. Imagine an example below:
```ts
const validDataSet = new HashSet();

for (const data of someCollectionView) {
   if (data.isValid) {
     validData.set.insert(data.hash);  
   }
}
```

So this code consumes a lazily-decoded data from `someCollectionView` and then filters out only valid entries and inserts the hash of these entries into a `HashSet`.

We may rewrite the code as follows:
```ts
const validHashes = someCollectionView.filter(x => x.isValid).map(x => x.hash);
const validDataSet = new HashSet();
validDataSet.insertAll(validHashes);
```

The second code is obviously much shorter (good), however:
1. (bad) It will create two intermediate arrays (after `filter` and after `map`) which might be large and hard to GC.
2. (good) calling `insertAll` might be faster/better than calling `insert` in a loop, because we have less context switching and potentially can be optimized (bulk insert to a sorted collection for instance).


So ideally:
1. `insertAll` should just get an iterator/generator
2. we should have utils that allow us to `filter` and `map` one iterator/generator into another to avoid creating these intermediate collections and evaluate the data lazily.


However, we should start off from writing benchmarks to confirm that the iterator approach is indeed worth the hassle (it will most likely depend on the collection size).


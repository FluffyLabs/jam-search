---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/blob-dictionary.ts#L207-L350
title: packages/core/collections/blob-dictionary.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 5
content_sha: a9fc0570b29729c189dd0551b5823107e16f9cc3c1c20ed3d31eccfc0bb44e12
language: typescript
---
`packages/core/collections/blob-dictionary.ts` (lines 207–350)

```typescript
      if (node.children instanceof MapChildren) {
        const pathChunk: KeyChunk = asOpaqueType(maybePathChunk);
        node = node.children.getChild(pathChunk);
        depth += 1;
      }
    }

    return undefined;
  }

  /**
   * Checks whether the dictionary contains an entry for the given key.
   *
   * ⚠️ **Note:** Avoid using `has(...)` together with `get(...)` in a pattern like this:
   *
   * ```ts
   * if (dict.has(key)) {
   *   const value = dict.get(key);
   *   ...
   * }
   * ```
   *
   * This approach performs two lookups for the same key.
   *
   * Instead, prefer the following pattern, which retrieves the value once:
   *
   * ```ts
   * const value = dict.get(key);
   * if (value !== undefined) {
   *   ...
   * }
   * ```
   *
   * @param key - The key to check for.
   * @returns `true` if the dictionary contains an entry for the given key, otherwise `false`.
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Removes an entry with the specified key from the dictionary.
   *
   * Internally, this calls {@link internalSet} with `undefined` to mark the entry as deleted.
   *
   * @param key - The key of the entry to remove.
   * @returns `true` if an entry was removed (i.e. the key existed), otherwise `false`.
   */
  delete(key: K): boolean {
    const leaf = this.internalSet(key, undefined);
    if (leaf !== null) {
      this.keyvals.delete(leaf.key);
      return true;
    }
    return false;
  }

  /**
   * Returns an iterator over the keys in the dictionary.
   *
   * The iterator yields each key in insertion order.
   *
   * @returns An iterator over all keys in the dictionary.
   */
  keys(): Iterator<K> & Iterable<K> {
    return this.keyvals.keys();
  }

  /**
   * Returns an iterator over the values in the dictionary.
   *
   * The iterator yields each value in insertion order.
   *
   * @returns An iterator over all values in the dictionary.
   */
  *values(): Iterator<V> & Iterable<V> {
    for (const leaf of this.keyvals.values()) {
      yield leaf.value;
    }
  }

  /**
   * Returns an iterator over the `[key, value]` pairs in the dictionary.
   *
   * The iterator yields entries in insertion order.
   *
   * @returns An iterator over `[key, value]` tuples for each entry in the dictionary.
   */
  *entries(): Iterator<[K, V]> & Iterable<[K, V]> {
    for (const leaf of this.keyvals.values()) {
      yield [leaf.key, leaf.value];
    }
  }

  /**
   * Default iterator for the dictionary.
   *
   * Equivalent to calling {@link entries}.
   * Enables iteration with `for...of`:
   *
   * ```ts
   * for (const [key, value] of dict) {
   *   ...
   * }
   * ```
   *
   * @returns An iterator over `[key, value]` pairs.
   */
  [Symbol.iterator](): Iterator<[K, V]> & Iterable<[K, V]> {
    return this.entries();
  }

  /**
   * Creates a new sorted array of values, ordered by their corresponding keys.
   *
   * Iterates over all entries in the dictionary and sorts them according
   * to the provided comparator function applied to the keys.
   *
   * @param comparator - A comparator function that can compare two keys.
   *
   * @returns A new array containing all values from the dictionary,
   * sorted according to their keys.
   */
  toSortedArray(comparator: Comparator<K>): V[] {
    const vals: [K, V][] = Array.from(this);
    vals.sort((a, b) => comparator(a[0], b[0]).value);
    return vals.map((x) => x[1]);
  }
}

const CHUNK_SIZE = 6;
type CHUNK_SIZE = typeof CHUNK_SIZE;

/**
 * A function to transform a bytes chunk (up to 6 bytes into U48 number)
 *
 * Note that it uses 3 additional bits to store length(`value * 8 + len;`),
 * It is needed to distinguish shorter chunks that have 0s at the end, for example: [1, 2] and [1, 2, 0]
 * */
export function bytesAsU48(bytes: Uint8Array): number {
  const len = bytes.length;

  check`${len <= CHUNK_SIZE} Length has to be <= ${CHUNK_SIZE}, got: ${len}`;

```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/hash-set.ts#L1-L86
title: packages/core/collections/hash-set.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 02939a1819a4e9e6a42a9bd5b08c740230ce87e3f97e8cf3abce3aed5c1a5fbb
language: typescript
---
`packages/core/collections/hash-set.ts` (lines 1–86)

```typescript
import type { OpaqueHash } from "@typeberry/hash";
import { HashDictionary } from "./hash-dictionary.js";

/** Immutable version of the HashSet. */
export interface ImmutableHashSet<V extends OpaqueHash> extends Iterable<V> {
  /** Return number of items in the set. */
  get size(): number;

  /** Check if given hash is in the set. */
  has(value: V): boolean;

  /**
   * Return an iterator over elements that are in the intersection of both sets.
   * i.e. they exist in both.
   */
  intersection(other: ImmutableHashSet<V>): Generator<V>;
}

/** A set specialized for storing hashes. */
export class HashSet<V extends OpaqueHash> implements ImmutableHashSet<V> {
  /** Wrap given dictionary into `HashSet` api for it's keys. */
  static viewDictionaryKeys<V extends OpaqueHash>(dict: HashDictionary<V, unknown>): HashSet<V> {
    return new HashSet(dict);
  }

  /** Create new set from given array of values. */
  static from<V extends OpaqueHash>(values: readonly V[]): HashSet<V> {
    const newSet = HashSet.new<V>();
    newSet.insertAll(values);
    return newSet;
  }

  /** Create an empty set of hashes. */
  static new<V extends OpaqueHash>(): HashSet<V> {
    return new HashSet();
  }

  private constructor(private readonly map = HashDictionary.new<V, unknown>()) {}

  get size(): number {
    return this.map.size;
  }

  has(value: V): boolean {
    return this.map.has(value);
  }

  *intersection(other: ImmutableHashSet<V>): Generator<V> {
    const iterate = this.size < other.size ? this : other;
    const second = iterate === this ? other : this;

    for (const elem of iterate) {
      if (second.has(elem)) {
        yield elem;
      }
    }
  }

  /** it allows to use HashSet in for-of loop */
  *[Symbol.iterator]() {
    for (const value of this.map) {
      yield value[0];
    }
  }

  /** Insert given hash to the set. */
  insert(value: V) {
    return this.map.set(value, true);
  }

  /** Insert multiple items to the set. */
  insertAll(values: readonly V[]) {
    for (const v of values) {
      this.map.set(v, true);
    }
  }

  /**
   * Remove value from set.
   *
   * Returns `true` if element existed in the set and was removed, `false` otherwise.
   */
  delete(value: V) {
    return this.map.delete(value);
  }
}
```

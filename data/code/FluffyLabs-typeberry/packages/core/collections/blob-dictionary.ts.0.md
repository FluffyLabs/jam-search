---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/blob-dictionary.ts#L1-L98
title: packages/core/collections/blob-dictionary.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 5
content_sha: 5740f1f080378c411d17cd184fe914599ce8d0331e4322a60b725aa0f7225603
language: typescript
---
`packages/core/collections/blob-dictionary.ts` (lines 1–98)

```typescript
import { BytesBlob } from "@typeberry/bytes";
import type { Comparator } from "@typeberry/ordering";
import { asOpaqueType, assertNever, check, type Opaque, TEST_COMPARE_USING, WithDebug } from "@typeberry/utils";

/** A map which uses byte blobs as keys */
export class BlobDictionary<K extends BytesBlob, V> extends WithDebug {
  /**
   * The root node of the dictionary.
   *
   * This is the main internal data structure that organizes entries
   * in a tree-like fashion (array-based nodes up to `mapNodeThreshold`,
   * map-based nodes beyond it). All insertions, updates, and deletions
   * operate through this structure.
   */
  private root: Node<K, V> = Node.withList();

  /**
   * Auxiliary map that stores references to the original keys and their values.
   *
   * - Overriding a value in the main structure does not replace the original key reference.
   * - Used for efficient iteration over `keys()`, `values()`, `entries()`, and computing `size`.
   */
  private keyvals: Map<K, Leaf<K, V>> = new Map();

  /**
   * Protected constructor used internally by `BlobDictionary.new`
   * and `BlobDictionary.fromEntries`.
   *
   * This enforces controlled instantiation — users should create instances
   * through the provided static factory methods instead of calling the
   * constructor directly.
   *
   * @param mapNodeThreshold - The threshold that determines when the dictionary
   * switches from using an array-based (`ListChildren`) node to a map-based (`MapChildren`) node for storing entries.
   */
  protected constructor(private mapNodeThreshold: number) {
    super();
  }

  /**
   * Returns the number of entries in the dictionary.
   *
   * The count is derived from the auxiliary `keyvals` map, which stores
   * all original key references and their associated values. This ensures
   * that the `size` reflects the actual number of entries, independent of
   * internal overrides in the main `root` structure.
   *
   * @returns The total number of entries in the dictionary.
   */
  get size(): number {
    return this.keyvals.size;
  }

  [TEST_COMPARE_USING]() {
    const vals: [K, V][] = Array.from(this);
    vals.sort((a, b) => a[0].compare(b[0]).value);
    return vals;
  }

  /**
   * Creates an empty `BlobDictionary`.
   *
   * @param mapNodeThreshold - The threshold that determines when the dictionary
   * switches from using an array-based (`ListChildren`) node to a map-based (`MapChildren`) node for storing entries.
   * Defaults to `0`.
   *
   * @returns A new, empty `BlobDictionary` instance.
   */
  static new<K extends BytesBlob, V>(mapNodeThreshold = 0) {
    return new BlobDictionary<K, V>(mapNodeThreshold);
  }

  /**
   * Creates a new `BlobDictionary` initialized with the given entries.
   *
   * @param entries - An array of `[key, value]` pairs used to populate the dictionary.
   * @param mapNodeThreshold - The threshold that determines when the dictionary
   * switches from using an array-based (`ListChildren`) node to a map-based (`MapChildren`) node for storing entries.
   * Defaults to `0`.
   *
   * @returns A new `BlobDictionary` containing the provided entries.
   */
  static fromEntries<K extends BytesBlob, V>(entries: [K, V][], mapNodeThreshold?: number): BlobDictionary<K, V> {
    const dict = BlobDictionary.new<K, V>(mapNodeThreshold);
    for (const [key, value] of entries) {
      dict.set(key, value);
    }
    return dict;
  }
  /**
   * Internal helper that inserts, updates or deletes an entry in the dictionary.
   *
   * Behaviour details:
   * - Passing `undefined` as `value` indicates a deletion. (E.g. `delete` uses `internalSet(key, undefined)`.)
   * - When an add (new entry) or a delete actually changes the structure, the method returns the affected leaf node.
   * - When the call only overrides an existing value (no structural add/delete), the method returns `null`.
   *
   * This method is intended for internal use by the dictionary implementation and allows `undefined` as a
```

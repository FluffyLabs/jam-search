---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/ordering/index.ts#L1-L49
title: packages/core/ordering/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 5228470e163b13202089dfbda30747e9823be4c28592d45555ab8d520bc2985c
language: typescript
---
`packages/core/ordering/index.ts` (lines 1–49)

```typescript
/** A return value of some comparator. */
export enum OrderingValue {
  /** `self < other` */
  Less = -1,
  /** `self === other` */
  Equal = 0,
  /** `self > other` */
  Greater = 1,
}

/** A class that provides utility methods to check the type of ordering. */
export class Ordering {
  private constructor(public readonly value: OrderingValue) {}

  static Less = new Ordering(OrderingValue.Less);
  static Greater = new Ordering(OrderingValue.Greater);
  static Equal = new Ordering(OrderingValue.Equal);

  isLess() {
    return this.value === OrderingValue.Less;
  }

  isGreater() {
    return this.value === OrderingValue.Greater;
  }

  isEqual() {
    return this.value === OrderingValue.Equal;
  }

  isNotEqual() {
    return !this.isEqual();
  }

  isGreaterOrEqual() {
    return this.isEqual() || this.isGreater();
  }

  isLessOrEqual() {
    return this.isEqual() || this.isLess();
  }
}

/**
 * A type that compares the `self` value to `other` and returns an ordering in respect to `self`.
 *
 * e.g. `self < other => Ordering.Less`, `self > other => Ordering.Greater`
 */
export type Comparator<V> = (self: V, other: V) => Ordering;
```

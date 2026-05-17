---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/array-view.ts#L1-L48
title: packages/core/collections/array-view.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 178a61680df3241dca2c078138593ae04c02fbb6935e73919188f7d29295e49a
language: typescript
---
`packages/core/collections/array-view.ts` (lines 1–48)

```typescript
import { check } from "@typeberry/utils";

/**
 * A utility class providing a readonly view over a portion of an array without copying it.
 */
export class ArrayView<T> implements Iterable<T> {
  private readonly source: T[];
  public readonly length: number;

  private constructor(
    source: T[],
    private readonly start: number,
    private readonly end: number,
  ) {
    this.source = source;
    this.length = end - start;
  }

  static from<T>(source: T[], start = 0, end = source.length): ArrayView<T> {
    check`
      ${start >= 0 && end <= source.length && start <= end} 
      Invalid start (${start})/end (${end}) for ArrayView 
    `;
    return new ArrayView(source, start, end);
  }

  get(i: number): T {
    check`
      ${i >= 0 && i < this.length}
      Index out of bounds: ${i} < ${this.length}
    `;
    return this.source[this.start + i];
  }

  subview(from: number, to: number = this.length): ArrayView<T> {
    return ArrayView.from(this.source, this.start + from, this.start + to);
  }

  toArray(): T[] {
    return this.source.slice(this.start, this.end);
  }

  *[Symbol.iterator](): Iterator<T> {
    for (let i = this.start; i < this.end; i++) {
      yield this.source[i];
    }
  }
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/mmr/index.ts#L134-L148
title: packages/core/mmr/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: f6b73606dd75471691e8d067a838366dccb35a2e5613792eef7a00bd8151da95
language: typescript
---
`packages/core/mmr/index.ts` (lines 134–148)

```typescript
  static fromChildren<H extends OpaqueHash>(hasher: MmrHasher<H>, children: [Mountain<H>, Mountain<H>]) {
    const [left, right] = children;
    const peak = hasher.hashConcat(left.peak, right.peak);
    const size = left.size + right.size;
    return new Mountain(peak, size);
  }
  /** Merge with another montain of the same size. */
  mergeWith(hasher: MmrHasher<H>, other: Mountain<H>): Mountain<H> {
    return Mountain.fromChildren(hasher, [this, other]);
  }

  toString() {
    return `${this.size} @ ${this.peak}`;
  }
}
```

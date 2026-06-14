---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/math.ts#L1-L13'
title: assembly/math.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-12T09:48:57+02:00'
last_modified: '2026-06-12T09:48:57+02:00'
chunk_index: 0
chunk_total: 1
content_sha: aa58ae14a0eefaa404e1cc0c250b83be9de5f35113ef2d6479108ac651f2f9fc
language: typescript
---
`assembly/math.ts` (lines 1–13)

```typescript
export class IntMath {
  /** Integer minimum of two i32 values. */
  @inline
  static minI32(a: i32, b: i32): i32 {
    return a < b ? a : b;
  }

  /** Unsigned integer minimum of two u32 values. */
  @inline
  static minU32(a: u32, b: u32): u32 {
    return a < b ? a : b;
  }
}
```

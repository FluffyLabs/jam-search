---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/utils/debug.ts#L131-L153
title: packages/core/utils/debug.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: e5901b02828e1348f7a0522f37fa034ef3d3b8955fe191be30cb370ba9d71d18
language: typescript
---
`packages/core/utils/debug.ts` (lines 131–153)

```typescript
  return v;
}

/** Utility function to measure time taken for some operation [ms]. */
export function measure(id: string) {
  const start = now();
  return () => `${id} took ${(now() - start).toFixed(2)}ms`;
}

/** A class that adds `toString` method that prints all properties of an object. */
export abstract class WithDebug {
  toString() {
    return inspect(this);
  }
}

export function lazyInspect<T>(obj: T) {
  return {
    toString() {
      return inspect(obj);
    },
  };
}
```

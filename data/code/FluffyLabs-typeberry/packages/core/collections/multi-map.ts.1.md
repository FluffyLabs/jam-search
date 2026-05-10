---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/multi-map.ts#L113-L132
title: packages/core/collections/multi-map.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: 866890fef32fdb1db207acc75504b25e2619ca4187feb1c405e0395ed95288d6
language: typescript
---
`packages/core/collections/multi-map.ts` (lines 113–132)

```typescript
    let current = this.data as Map<unknown, unknown> | undefined;

    for (let i = 0; i < lastKeyIndex; i += 1) {
      if (current === undefined) {
        return {
          map: undefined,
          key: lastKey,
        };
      }

      const key = keys[i];
      current = current.get(key) as Map<unknown, unknown> | undefined;
    }

    return {
      map: current as Map<unknown, TValue> | undefined,
      key: lastKey,
    };
  }
}
```

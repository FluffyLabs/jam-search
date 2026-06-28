---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/codec-utils.ts#L115-L134
title: packages/jam/block/codec-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 55297ea28f288a5a0aa747387e0c1675722879d370dc1509927110f000ed62c8
language: typescript
---
`packages/jam/block/codec-utils.ts` (lines 115–134)

```typescript
      for (let i = 0; i < len; i += 1) {
        const v = value.decode(d);
        const k = extractKey(v);
        if (map.has(k)) {
          throw new Error(`Duplicate item in the dictionary encoding: "${k}"!`);
        }
        if (prevValue !== null && compare(prevValue, v).isGreaterOrEqual()) {
          throw new Error(`The keys in dictionary encoding are not sorted "${prevValue}" >= "${v}"!`);
        }
        map.set(k, v);
        prevValue = v;
      }
      return map;
    },
    (s) => {
      const len = s.decoder.varU32();
      s.sequenceFixLen(value, len);
    },
  );
};
```

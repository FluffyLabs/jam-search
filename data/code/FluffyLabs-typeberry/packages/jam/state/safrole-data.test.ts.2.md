---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/safrole-data.test.ts#L72-L78
title: packages/jam/state/safrole-data.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 15
content_sha: 7130d84ed869616e4812e7ecdf7a3bc20d855811c93b7350f9dd30120cf21893
language: typescript
---
`packages/jam/state/safrole-data.test.ts` (lines 72–78)

```typescript
    const decoded = Decoder.decodeObject(SafroleSealingKeysData.Codec, encoded, spec);

    deepEqual(decoded, original);
  });
});

const VALIDATORS =
```

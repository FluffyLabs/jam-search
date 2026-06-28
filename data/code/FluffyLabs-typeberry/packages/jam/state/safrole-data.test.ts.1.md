---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/safrole-data.test.ts#L71-L78
title: packages/jam/state/safrole-data.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 15
content_sha: 432b7c77f1ffda2164008a1c88bd75263c8d36ac29e551fda1991008833b3f64
language: typescript
---
`packages/jam/state/safrole-data.test.ts` (lines 71–78)

```typescript
    const encoded = Encoder.encodeObject(SafroleSealingKeysData.Codec, original, spec);
    const decoded = Decoder.decodeObject(SafroleSealingKeysData.Codec, encoded, spec);

    deepEqual(decoded, original);
  });
});

const VALIDATORS =
```

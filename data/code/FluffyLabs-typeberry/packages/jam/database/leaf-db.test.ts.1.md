---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/leaf-db.test.ts#L100-L115
title: packages/jam/database/leaf-db.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 872221b3bcbe91d4b57600dfccde69aff5a523867fa99e989134e7ae4181520f
language: typescript
---
`packages/jam/database/leaf-db.test.ts` (lines 100–115)

```typescript
  const db = dbFromRaw(rawDb);

  return LeafDb.fromLeavesBlob(BytesBlob.blobFromParts(leafNodes.map((x) => x.node.raw)), db);
}

function dbFromRaw(rawDb: Map<string, BytesBlob>): ValuesDb {
  return {
    get(key: ValueHash): Uint8Array {
      const v = rawDb.get(`${key}`);
      if (v === undefined) {
        throw new Error(`Missing key: ${key}`);
      }
      return v.raw;
    },
  };
}
```

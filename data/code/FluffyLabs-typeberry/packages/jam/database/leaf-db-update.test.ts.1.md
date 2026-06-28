---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/database/leaf-db-update.test.ts#L102-L109
title: packages/jam/database/leaf-db-update.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 542eabc28a6c070fd878d3fca85fc44e8f530cb9052d43c63cf69bc0de20556a
language: typescript
---
`packages/jam/database/leaf-db-update.test.ts` (lines 102–109)

```typescript
    updateLeafs(leafs, blake2b, [[StateEntryUpdateAction.Insert, key(1), smallValue(0xaa)]]);

    const res = updateLeafs(leafs, blake2b, [[StateEntryUpdateAction.Remove, key(1), BytesBlob.empty()]]);

    assert.deepStrictEqual(res.values, []);
    assert.deepStrictEqual(res.removed, []);
  });
});
```

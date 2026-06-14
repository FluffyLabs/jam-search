---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/ce-128-block-request.ts#L226-L239
title: packages/jam/jamnp-s/protocol/ce-128-block-request.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 3
content_sha: 2ef557e20471703d25873137d43fbdca4ecf5eec2f897bdf0bb1b750c4a436e4
language: typescript
---
`packages/jam/jamnp-s/protocol/ce-128-block-request.ts` (lines 226–239)

```typescript

  // now iterate a bit over ancestor blocks
  for (let i = 0; i < limit; i++) {
    const parent = getBlockView(currentBlock.header.view().parentHeaderHash.materialize());
    if (parent === null) {
      break;
    }

    response.push(parent);
    currentBlock = parent;
  }

  return Result.ok(response);
}
```

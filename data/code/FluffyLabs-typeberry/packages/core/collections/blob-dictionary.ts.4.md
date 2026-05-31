---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/blob-dictionary.ts#L488-L496
title: packages/core/collections/blob-dictionary.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 4
chunk_total: 5
content_sha: ba9bee2a6c0fc39613a27fe7d0f2afcb48b91f461f002c097a5d544c83f5ce88
language: typescript
---
`packages/core/collections/blob-dictionary.ts` (lines 488–496)

```typescript
    const chunkAsNumber = bytesAsU48(keyChunk.raw);
    return this.children.get(chunkAsNumber);
  }

  setChild(keyChunk: KeyChunk, node: Node<K, V>) {
    const chunkAsNumber = bytesAsU48(keyChunk.raw);
    this.children.set(chunkAsNumber, node);
  }
}
```

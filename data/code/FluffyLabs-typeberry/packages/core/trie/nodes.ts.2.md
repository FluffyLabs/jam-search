---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/nodes.ts#L226-L245
title: packages/core/trie/nodes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 7d2411878bf76b9df1cbae19c27fb35cf6dfb2c8b8b184f20a96db8aebdee817
language: typescript
---
`packages/core/trie/nodes.ts` (lines 226–245)

```typescript
   * Note that this is going to be empty for a regular leaf node (i.e. containing a hash).
   */
  getValue(): BytesBlob {
    const len = this.getValueLength();
    return BytesBlob.blobFrom(this.node.raw.subarray(HASH_SIZE, HASH_SIZE + len));
  }

  /**
   * Returns contained value hash.
   *
   * Note that for embedded value this is going to be full 0-padded 32 bytes.
   */
  getValueHash(): ValueHash {
    return Bytes.fromBlob(this.node.raw.subarray(HASH_SIZE), HASH_SIZE).asOpaque();
  }

  toString() {
    return `LeafNode {\n key: ${this.getKey()},\n valueHash: ${this.getValueHash()}\n}`;
  }
}
```

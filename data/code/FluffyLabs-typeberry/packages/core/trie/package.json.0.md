---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/trie/package.json#L1-L18
title: packages/core/trie/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 8b3331c0f291f079a7e62da10e45a996e3dc0aa78565a3c1300c3e3970dd64c0
language: json
---
`packages/core/trie/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/trie",
  "version": "0.6.0",
  "description": "Trie implementation for Typeberry JAM.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/hash": "*",
    "@typeberry/collections": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

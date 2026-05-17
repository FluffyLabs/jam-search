---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/hash/package.json#L1-L17
title: packages/core/hash/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: cebc2b99ea23b3189b6e2fdd829ea452833bfaaa05dc8778115b75a6040195b6
language: json
---
`packages/core/hash/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/hash",
  "version": "0.6.0",
  "description": "Hashing utilities for typeberry.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/utils": "*",
    "hash-wasm": "4.12.0"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

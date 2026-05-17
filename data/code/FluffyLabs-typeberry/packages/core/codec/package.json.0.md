---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/package.json#L1-L18
title: packages/core/codec/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: af140c1d96d7dfe523d4e4f79b252e455fb6e2a7739ba9406ffc1162e472d55a
language: json
---
`packages/core/codec/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/codec",
  "version": "0.6.0",
  "description": "Serialization and deserialization codec for JAM.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

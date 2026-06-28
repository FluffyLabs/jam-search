---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/package.json#L1-L18
title: packages/core/codec/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 8b6493a854b0e47c0938838ba2ce9b8780019360c1126824dd166c10b6825fec
language: json
---
`packages/core/codec/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/codec",
  "version": "0.9.0",
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

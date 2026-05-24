---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/package.json#L1-L18
title: packages/core/codec/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5fc851a518fa61013168bd14c6ec71e4b9b70d30b2a4d49e6a64b63e7083a35a
language: json
---
`packages/core/codec/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/codec",
  "version": "0.7.0",
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

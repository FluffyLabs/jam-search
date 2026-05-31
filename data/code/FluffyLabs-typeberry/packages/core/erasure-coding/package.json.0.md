---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/package.json#L1-L21
title: packages/core/erasure-coding/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1881308a829721c3bbfa71e43ce614b67c54842d987a1ffce0dbeb69bc86ec74
language: json
---
`packages/core/erasure-coding/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/erasure-coding",
  "version": "0.8.1",
  "description": "Erasure encoding implementation",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')",
    "start": "tsx ./index"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/native": "0.2.0-74dd7d7",
    "@typeberry/utils": "*"
  }
}
```

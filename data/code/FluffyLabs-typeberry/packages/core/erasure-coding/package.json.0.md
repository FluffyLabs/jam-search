---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/package.json#L1-L21
title: packages/core/erasure-coding/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 67bac288f52ab8135e8d1d3c14c416d047b22ef016c8460e723da0d1551b21ed
language: json
---
`packages/core/erasure-coding/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/erasure-coding",
  "version": "0.10.0",
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
    "@typeberry/native": "0.5.1",
    "@typeberry/utils": "*"
  }
}
```

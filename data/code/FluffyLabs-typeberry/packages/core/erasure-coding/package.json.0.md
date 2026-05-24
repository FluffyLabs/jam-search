---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/package.json#L1-L21
title: packages/core/erasure-coding/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bc60cbd85905263a25ba4e647e7eb88b1255ae6d8a0340ef72d162b9c22478ed
language: json
---
`packages/core/erasure-coding/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/erasure-coding",
  "version": "0.7.0",
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

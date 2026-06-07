---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/package.json#L1-L21
title: packages/core/erasure-coding/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7b9294960281c0e30029963ee4dc08e7a7ed9617a01ae65382027657a0cceaf4
language: json
---
`packages/core/erasure-coding/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/erasure-coding",
  "version": "0.8.4",
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
    "@typeberry/native": "0.3.0-5dae93e",
    "@typeberry/utils": "*"
  }
}
```

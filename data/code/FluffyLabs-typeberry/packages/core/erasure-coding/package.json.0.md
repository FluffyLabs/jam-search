---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/erasure-coding/package.json#L1-L21
title: packages/core/erasure-coding/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 975cdea07f019f6d4c9b6c7ce530a48eb3adb3b6d916dbc994a0afb76425ae75
language: json
---
`packages/core/erasure-coding/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/erasure-coding",
  "version": "0.11.0",
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

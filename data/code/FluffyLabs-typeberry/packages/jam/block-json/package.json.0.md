---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/package.json#L1-L21
title: packages/jam/block-json/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 68345a8129910d91b0281c4ced42aa77d07da6bbcc056ca524daffc42fa460fa
language: json
---
`packages/jam/block-json/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/block-json",
  "version": "0.10.0",
  "description": "JSON definition of block",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/collections": "*",
    "@typeberry/crypto": "*",
    "@typeberry/json-parser": "*",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "type": "module"
}
```

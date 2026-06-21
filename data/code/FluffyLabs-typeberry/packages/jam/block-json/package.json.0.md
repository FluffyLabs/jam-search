---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block-json/package.json#L1-L21
title: packages/jam/block-json/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 3322e7242e1aaae1b157452e14eee3b8c42bc2a556915e6c8bb62750944c6c40
language: json
---
`packages/jam/block-json/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/block-json",
  "version": "0.9.0",
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

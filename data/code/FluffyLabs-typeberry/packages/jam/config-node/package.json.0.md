---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/package.json#L1-L22
title: packages/jam/config-node/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 0f5d13a29186bb008593bbfc25f1942287377cad3e7ba62745cbdf7807ac175b
language: json
---
`packages/jam/config-node/package.json` (lines 1–22)

```json
{
  "name": "@typeberry/config-node",
  "version": "0.9.0",
  "description": "Config for typeberry node.",
  "main": "index.ts",
  "type": "module",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/config": "*",
    "@typeberry/configs": "*",
    "@typeberry/json-parser": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0"
}
```

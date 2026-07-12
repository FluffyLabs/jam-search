---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config-node/package.json#L1-L22
title: packages/jam/config-node/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bd5c21af4dbbd70904b26f3fcf0b162ef6c883541f2208d309cfd7fd50e9f48b
language: json
---
`packages/jam/config-node/package.json` (lines 1–22)

```json
{
  "name": "@typeberry/config-node",
  "version": "0.11.0",
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

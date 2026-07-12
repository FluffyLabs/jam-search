---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/package.json#L1-L32
title: packages/jam/in-core/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 8c593162aa5d0a607012597a602e8f0918716eb8e9e568cc32b6872bfa6582ad
language: json
---
`packages/jam/in-core/package.json` (lines 1–32)

```json
{
  "name": "@typeberry/in-core",
  "version": "0.11.0",
  "description": "In core execution utilities (refine phase).",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/database": "*",
    "@typeberry/executor": "*",
    "@typeberry/hash": "*",
    "@typeberry/jam-host-calls": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/ordering": "*",
    "@typeberry/pvm-host-calls": "*",
    "@typeberry/pvm-interface": "*",
    "@typeberry/pvm-interpreter": "*",
    "@typeberry/state": "*",
    "@typeberry/transition": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

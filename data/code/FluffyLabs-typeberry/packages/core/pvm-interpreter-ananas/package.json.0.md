---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter-ananas/package.json#L1-L21
title: packages/core/pvm-interpreter-ananas/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 80e5d72f1a4c2b5d0495fbf87e553fc853165459a01b7debb64a205927dd350e
language: json
---
`packages/core/pvm-interpreter-ananas/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/pvm-interpreter-ananas",
  "version": "0.8.4",
  "description": "Anan-as PVM implementation.",
  "main": "index.ts",
  "dependencies": {
    "@fluffylabs/anan-as": "^1.4.0",
    "@typeberry/codec": "*",
    "@typeberry/numbers": "*",
    "@typeberry/pvm-interface": "*",
    "@typeberry/utils": "*",
    "assemblyscript-loader": "^0.3.0"
  },
  "scripts": {
    "start": "tsx ./bin.ts",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter-ananas/package.json#L1-L21
title: packages/core/pvm-interpreter-ananas/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 17cae4c9d3aab5998c9e078c53446419fee0c75059e35ded3f8eeac6d7fd85a8
language: json
---
`packages/core/pvm-interpreter-ananas/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/pvm-interpreter-ananas",
  "version": "0.6.0",
  "description": "Anan-as PVM implementation.",
  "main": "index.ts",
  "dependencies": {
    "@fluffylabs/anan-as": "^1.3.0",
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

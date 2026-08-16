---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter-ananas/package.json#L1-L21
title: packages/core/pvm-interpreter-ananas/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2f02e20bc99563ea6b6bb3efe282ce32d05aa726f2d0f34a8fe171ce79bc108b
language: json
---
`packages/core/pvm-interpreter-ananas/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/pvm-interpreter-ananas",
  "version": "0.11.0",
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

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter-ananas/package.json#L1-L21
title: packages/core/pvm-interpreter-ananas/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 57e01f482ea531ca2c080a9ba13142df999ab71546519eb7dc204c4aa07534b0
language: json
---
`packages/core/pvm-interpreter-ananas/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/pvm-interpreter-ananas",
  "version": "0.5.11",
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

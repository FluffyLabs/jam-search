---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/package.json#L1-L21
title: packages/core/pvm-interpreter/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7a3b9b42415dea6de1b551e15089174458193ca7eef07ca77922bb2de8977744
language: json
---
`packages/core/pvm-interpreter/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/pvm-interpreter",
  "version": "0.11.0",
  "description": "A PVM implementation based on the Gray Paper.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/pvm-interface": "*",
    "@typeberry/utils": "*"
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

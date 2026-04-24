---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/package.json#L1-L21
title: packages/core/pvm-interpreter/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 8c6f9243985c0740c535ea6a1e213d7fd30f1aa679e1c61efee7328742788d1a
language: json
---
`packages/core/pvm-interpreter/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/pvm-interpreter",
  "version": "0.5.11",
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

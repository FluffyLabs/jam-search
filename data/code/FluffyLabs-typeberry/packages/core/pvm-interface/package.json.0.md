---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interface/package.json#L1-L17
title: packages/core/pvm-interface/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 9b4d42ab6ef75b53d6651045eb1895f2066ab9b4e8cd59023ccb0df1ef335430
language: json
---
`packages/core/pvm-interface/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/pvm-interface",
  "version": "0.9.0",
  "description": "A PVM interface for external implementations.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/numbers": "*",
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

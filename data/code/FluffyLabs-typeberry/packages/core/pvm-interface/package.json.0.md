---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interface/package.json#L1-L17
title: packages/core/pvm-interface/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 4994b7b9acf380ac3f57ee482469269fb39a0c1ce65197031d61c9ba6a567501
language: json
---
`packages/core/pvm-interface/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/pvm-interface",
  "version": "0.6.0",
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

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/package.json#L1-L18
title: packages/core/collections/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: c4e82e8faa059ed98f869cafe468ad1cf113044be6f5f6a27302cf7c30a0b9a6
language: json
---
`packages/core/collections/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/collections",
  "description": "Known-size collection types.",
  "version": "0.6.0",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/bytes": "*",
    "@typeberry/hash": "*",
    "@typeberry/ordering": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -o -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

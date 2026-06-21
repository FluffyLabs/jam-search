---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/package.json#L1-L18
title: packages/core/collections/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 4caf5e900e42bb525df12e5387709770b71741e6264b22788fd8ceb0c6359caf
language: json
---
`packages/core/collections/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/collections",
  "description": "Known-size collection types.",
  "version": "0.9.0",
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

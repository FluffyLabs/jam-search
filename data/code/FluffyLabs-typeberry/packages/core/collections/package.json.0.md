---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/collections/package.json#L1-L18
title: packages/core/collections/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5e8b4ea7d23340a3e5a2428e1b0064eabebd7b7acfb7305463d77f0d53eda5d8
language: json
---
`packages/core/collections/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/collections",
  "description": "Known-size collection types.",
  "version": "0.7.0",
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

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/package.json#L1-L12
title: packages/configs/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 3516439623f571f7d08a2d03efd845f7fd048dbae4a8c3ca970f2a3a02dc58e2
language: json
---
`packages/configs/package.json` (lines 1–12)

```json
{
  "name": "@typeberry/configs",
  "version": "0.9.0",
  "description": "A set of pre-defined JSON config files.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  }
}
```

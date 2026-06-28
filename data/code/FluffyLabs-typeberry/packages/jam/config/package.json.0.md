---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config/package.json#L1-L16
title: packages/jam/config/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 36563d1a375895d17fd5c599f2f863fbb7a542d69613d60bdefc9f0ef6cb043e
language: json
---
`packages/jam/config/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/config",
  "version": "0.9.0",
  "description": "Config for typeberry workers.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

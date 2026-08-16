---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-vectors/package.json#L1-L21
title: packages/jam/state-vectors/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 615e0968900e39f6e4d52ef2750a4993f187c4a2dbad5819eb4cdf132b6fc2f4
language: json
---
`packages/jam/state-vectors/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/state-vectors",
  "version": "0.11.0",
  "description": "State Transition vectors.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/config": "*",
    "@typeberry/hash": "*",
    "@typeberry/json-parser": "*"
  },
  "type": "module",
  "author": "Fluffy Labs",
  "license": "MPL-2.0"
}
```

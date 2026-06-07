---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-json/package.json#L1-L27
title: packages/jam/state-json/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5e3b8bb8dd094d71da06e3670a4176dd94e40defc1cfd3a7910b37a4c7eb87a2
language: json
---
`packages/jam/state-json/package.json` (lines 1–27)

```json
{
  "name": "@typeberry/state-json",
  "version": "0.8.4",
  "description": "Utilities to parse JSON state.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/block-json": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/hash": "*",
    "@typeberry/json-parser": "*",
    "@typeberry/numbers": "*",
    "@typeberry/state": "*",
    "@typeberry/state-merkleization": "*",
    "@typeberry/utils": "*"
  }
}
```

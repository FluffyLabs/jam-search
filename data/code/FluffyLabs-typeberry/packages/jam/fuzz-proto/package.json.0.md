---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/package.json#L1-L22
title: packages/jam/fuzz-proto/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: fe574c8cc21fcc27d2b1d1927f27dca52d64f1c11e9de2069acc145ed1b4c65d
language: json
---
`packages/jam/fuzz-proto/package.json` (lines 1–22)

```json
{
  "name": "@typeberry/fuzz-proto",
  "version": "0.5.11",
  "description": "Fuzzer protocol types.",
  "type": "module",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/config": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0"
}
```

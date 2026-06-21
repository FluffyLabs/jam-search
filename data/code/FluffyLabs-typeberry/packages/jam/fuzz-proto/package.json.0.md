---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/package.json#L1-L22
title: packages/jam/fuzz-proto/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 864cb3e3efd207ec600aafb2331462f769d6b6e56434b1d9c8997ff71235088d
language: json
---
`packages/jam/fuzz-proto/package.json` (lines 1–22)

```json
{
  "name": "@typeberry/fuzz-proto",
  "version": "0.9.0",
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

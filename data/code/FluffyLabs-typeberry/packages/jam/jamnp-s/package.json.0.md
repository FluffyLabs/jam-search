---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/package.json#L1-L27
title: packages/jam/jamnp-s/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 649dc55443654a25feef45c55af7247a77d025f23081aad102ba87555ffd7e8a
language: json
---
`packages/jam/jamnp-s/package.json` (lines 1–27)

```json
{
  "name": "@typeberry/jamnp-s",
  "version": "0.11.0",
  "description": "JAM Networking Protocol - Simple",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/crypto": "*",
    "@typeberry/database": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/networking": "*",
    "@typeberry/numbers": "*",
    "@typeberry/ticket-pool": "*",
    "@typeberry/utils": "*"
  }
}
```

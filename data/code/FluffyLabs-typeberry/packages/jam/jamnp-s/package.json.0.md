---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/package.json#L1-L26
title: packages/jam/jamnp-s/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: b03e7786711824dc2e7b9f8f6b348111c22756197a988500c7c33bab60a6dc04
language: json
---
`packages/jam/jamnp-s/package.json` (lines 1–26)

```json
{
  "name": "@typeberry/jamnp-s",
  "version": "0.6.0",
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
    "@typeberry/utils": "*"
  }
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/package.json#L1-L27
title: packages/jam/jamnp-s/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 3ac3a7013127b61d71f226e6dc85204da1e2d1c17ece0e7ba970930f1788d570
language: json
---
`packages/jam/jamnp-s/package.json` (lines 1–27)

```json
{
  "name": "@typeberry/jamnp-s",
  "version": "0.9.0",
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

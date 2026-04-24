---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/package.json#L1-L20
title: packages/core/crypto/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 521fded8a93f7392c6865beed5ed8b8ac72406239d730268beb902963552ae2d
language: json
---
`packages/core/crypto/package.json` (lines 1–20)

```json
{
  "name": "@typeberry/crypto",
  "version": "0.5.11",
  "description": "JAM crypto-related utilities.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@noble/ed25519": "2.2.3",
    "@typeberry/bytes": "*",
    "@typeberry/hash": "*",
    "@typeberry/native": "0.2.0-74dd7d7",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

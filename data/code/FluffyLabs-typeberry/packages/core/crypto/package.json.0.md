---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/package.json#L1-L20
title: packages/core/crypto/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f3a2fdafa773bb2b02e4b32e5bdad06afd35d092d66c71b00d431e402d54bfb3
language: json
---
`packages/core/crypto/package.json` (lines 1–20)

```json
{
  "name": "@typeberry/crypto",
  "version": "0.11.0",
  "description": "JAM crypto-related utilities.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@noble/ed25519": "2.2.3",
    "@typeberry/bytes": "*",
    "@typeberry/hash": "*",
    "@typeberry/native": "0.5.1",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

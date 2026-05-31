---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/package.json#L1-L20
title: packages/core/crypto/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1658061e4e8c8a3416d016d28a3881c8353795fa17b300a65baafe498551649a
language: json
---
`packages/core/crypto/package.json` (lines 1–20)

```json
{
  "name": "@typeberry/crypto",
  "version": "0.8.1",
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

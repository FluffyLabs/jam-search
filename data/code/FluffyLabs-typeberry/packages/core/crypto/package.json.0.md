---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/package.json#L1-L20
title: packages/core/crypto/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 4555bd05878094703a13fc20ed8c10f08c3f41758d4e7eff7182d9b9ade97ec3
language: json
---
`packages/core/crypto/package.json` (lines 1–20)

```json
{
  "name": "@typeberry/crypto",
  "version": "0.6.0",
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

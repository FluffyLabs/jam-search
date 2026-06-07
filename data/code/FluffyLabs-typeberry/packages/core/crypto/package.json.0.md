---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/crypto/package.json#L1-L20
title: packages/core/crypto/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4a3f6900eede9c5a4a7852e6fdb78675cbb75556d33a360b9f5c1a39e412b590
language: json
---
`packages/core/crypto/package.json` (lines 1–20)

```json
{
  "name": "@typeberry/crypto",
  "version": "0.8.4",
  "description": "JAM crypto-related utilities.",
  "main": "index.ts",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "dependencies": {
    "@noble/ed25519": "2.2.3",
    "@typeberry/bytes": "*",
    "@typeberry/hash": "*",
    "@typeberry/native": "0.3.0-5dae93e",
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

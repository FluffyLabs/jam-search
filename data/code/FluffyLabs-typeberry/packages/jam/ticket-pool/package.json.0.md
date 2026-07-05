---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/ticket-pool/package.json#L1-L21
title: packages/jam/ticket-pool/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e7a6743693050b1c9078fbc481c1ac264d5c518012b3276af2bd597b092092ae
language: json
---
`packages/jam/ticket-pool/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/ticket-pool",
  "version": "0.10.0",
  "description": "In-memory Safrole ticket pools and validation abstraction shared between block authorship and networking.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/collections": "*",
    "@typeberry/crypto": "*",
    "@typeberry/hash": "*",
    "@typeberry/logger": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

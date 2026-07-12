---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/ticket-pool/package.json#L1-L21
title: packages/jam/ticket-pool/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e47d109a38780bfcb3eee22c83692ed6d65742f3f505fb54579f6764b9553776
language: json
---
`packages/jam/ticket-pool/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/ticket-pool",
  "version": "0.11.0",
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

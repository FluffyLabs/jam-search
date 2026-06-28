---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/ticket-pool/package.json#L1-L21
title: packages/jam/ticket-pool/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: c04beb000c84875b701d2180e93c5a5a7c8edf9f901d2626729a5a0e19d43a70
language: json
---
`packages/jam/ticket-pool/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/ticket-pool",
  "version": "0.9.0",
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

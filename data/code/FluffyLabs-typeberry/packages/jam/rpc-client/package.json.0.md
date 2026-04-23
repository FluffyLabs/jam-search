---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-client/package.json#L1-L18
title: packages/jam/rpc-client/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 443366e05a1781e575724a0839187eb62c7559d0b6719fbb425ffcd40f91c2ab
language: json
---
`packages/jam/rpc-client/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/rpc-client",
  "version": "0.5.11",
  "description": "A TypeScript JAM JSON-RPC client.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/logger": "*",
    "@typeberry/rpc-validation": "*",
    "ws": "8.18.2",
    "eventemitter3": "^5.0.1"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

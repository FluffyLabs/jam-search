---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-client/package.json#L1-L18
title: packages/jam/rpc-client/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 545c9c76649c95b1d3f3c03fb89f096c6c5a079bb0dd4d4b2da54b8852365dee
language: json
---
`packages/jam/rpc-client/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/rpc-client",
  "version": "0.6.0",
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

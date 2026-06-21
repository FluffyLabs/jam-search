---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-client/package.json#L1-L20
title: packages/jam/rpc-client/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 92fedfc5288cf2eb1bcd9829d4b4048e6170456a8efd5b6ab197293145bd1178
language: json
---
`packages/jam/rpc-client/package.json` (lines 1–20)

```json
{
  "name": "@typeberry/rpc-client",
  "version": "0.9.0",
  "description": "A TypeScript JAM JSON-RPC client.",
  "main": "index.ts",
  "dependencies": {
    "@opentelemetry/auto-instrumentations-node": "0.76.0",
    "@opentelemetry/sdk-node": "0.218.0",
    "@typeberry/logger": "*",
    "@typeberry/rpc-validation": "*",
    "eventemitter3": "^5.0.1",
    "ws": "^8.20.1"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-client/package.json#L1-L21
title: packages/jam/rpc-client/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: ea34badd17652380833bd9684552e68ca5fb6ffce803bca1316db5c803d2e886
language: json
---
`packages/jam/rpc-client/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/rpc-client",
  "version": "0.11.0",
  "description": "A TypeScript JAM JSON-RPC client.",
  "main": "index.ts",
  "dependencies": {
    "@opentelemetry/auto-instrumentations-node": "^0.77.0",
    "@opentelemetry/exporter-metrics-otlp-http": "0.219.0",
    "@opentelemetry/sdk-node": "^0.219.0",
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

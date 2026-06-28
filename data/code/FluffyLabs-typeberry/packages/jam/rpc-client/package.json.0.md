---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-client/package.json#L1-L21
title: packages/jam/rpc-client/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: ebefb780b24e9c766497bb4aef3dcdfc99d2f57f47ff65a92626e39e2f901c2f
language: json
---
`packages/jam/rpc-client/package.json` (lines 1–21)

```json
{
  "name": "@typeberry/rpc-client",
  "version": "0.9.0",
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

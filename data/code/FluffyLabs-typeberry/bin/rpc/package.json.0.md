---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/package.json#L1-L47'
title: bin/rpc/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: f4989db3b916b7fe6c5b7f5fb78e0d98b1a46f74565afea6fc8ec78f16c9ad71
language: json
---
`bin/rpc/package.json` (lines 1–47)

```json
{
  "name": "@typeberry/rpc",
  "version": "0.9.0",
  "description": "A JSON RPC server for Typeberry.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.ts",
  "bin": {
    "rpc": "index.ts"
  },
  "scripts": {
    "start": "NODE_ENV=development tsx ./index.ts",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')",
    "test:e2e": "npm run test:e2e-setup && npm run test:e2e-run",
    "test:e2e-setup": "NODE_ENV=development GP_VERSION=0.7.2 tsx ./test/e2e-setup.ts",
    "test:e2e-run": "NODE_ENV=development GP_VERSION=0.7.2 tsx --test ./test/e2e.ts"
  },
  "dependencies": {
    "@opentelemetry/auto-instrumentations-node": "^0.77.0",
    "@opentelemetry/exporter-metrics-otlp-http": "0.219.0",
    "@opentelemetry/sdk-node": "^0.219.0",
    "@typeberry/block": "*",
    "@typeberry/bytes": "*",
    "@typeberry/codec": "*",
    "@typeberry/collections": "*",
    "@typeberry/config": "*",
    "@typeberry/config-node": "*",
    "@typeberry/database-lmdb": "*",
    "@typeberry/hash": "*",
    "@typeberry/in-core": "*",
    "@typeberry/jam": "*",
    "@typeberry/logger": "*",
    "@typeberry/node": "*",
    "@typeberry/numbers": "*",
    "@typeberry/rpc-validation": "*",
    "@typeberry/state": "*",
    "@typeberry/utils": "*",
    "minimist": "1.2.8",
    "ws": "^8.20.1",
    "zod": "^4.1.13"
  },
  "devDependencies": {
    "@typeberry/rpc-client": "*",
    "@types/ws": "^8.18.1"
  }
}
```

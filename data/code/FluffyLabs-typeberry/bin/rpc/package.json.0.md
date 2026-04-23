---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/rpc/package.json#L1-L44'
title: bin/rpc/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b9b6dcdf4cd59ff4f8dfde8b8a4912da2b9b0a86dffc234834cb70b45d7b3565
language: json
---
`bin/rpc/package.json` (lines 1–44)

```json
{
  "name": "@typeberry/rpc",
  "version": "0.5.11",
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
    "ws": "8.18.2",
    "zod": "^4.1.13"
  },
  "devDependencies": {
    "@typeberry/rpc-client": "*",
    "@types/ws": "^8.18.1"
  }
}
```

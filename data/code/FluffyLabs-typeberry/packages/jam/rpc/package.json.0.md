---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc/package.json#L1-L40
title: packages/jam/rpc/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 479720acd50e1108ea0bb901dee11e6f34a34df5c927d60686a0eeb1227388ef
language: json
---
`packages/jam/rpc/package.json` (lines 1–40)

```json
{
  "name": "@typeberry/rpc",
  "version": "0.11.0",
  "description": "A JSON RPC server for Typeberry.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.ts",
  "scripts": {
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
    "@typeberry/database": "*",
    "@typeberry/hash": "*",
    "@typeberry/in-core": "*",
    "@typeberry/logger": "*",
    "@typeberry/numbers": "*",
    "@typeberry/rpc-validation": "*",
    "@typeberry/state": "*",
    "@typeberry/transition": "*",
    "@typeberry/utils": "*",
    "ws": "^8.20.1",
    "zod": "^4.1.13"
  },
  "devDependencies": {
    "@typeberry/config-node": "*",
    "@typeberry/node": "*",
    "@typeberry/rpc-client": "*",
    "@typeberry/workers-api-node": "*",
    "@types/ws": "^8.18.1"
  }
}
```

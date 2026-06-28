---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-validation/package.json#L1-L16
title: packages/jam/rpc-validation/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: d521fc962428dd0bd3ccd1967cc501696948743fd555e3237ec63f93140cb366
language: json
---
`packages/jam/rpc-validation/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/rpc-validation",
  "version": "0.9.0",
  "description": "Validation schemas and type definitions for Typeberry JAM JSON-RPC client and server.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/hash": "*",
    "zod": "^4.1.13"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

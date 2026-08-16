---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-validation/package.json#L1-L16
title: packages/jam/rpc-validation/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 26be31c24a2fb846b8f64dfbbc740cc5a6b0e820b9117ba8e2189d148d15d2f0
language: json
---
`packages/jam/rpc-validation/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/rpc-validation",
  "version": "0.11.0",
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

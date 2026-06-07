---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/rpc-validation/package.json#L1-L16
title: packages/jam/rpc-validation/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2b90d742b0c045a4f9a94d9f3144bbe99493610efe73d01372e7f46ff6bbb92a
language: json
---
`packages/jam/rpc-validation/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/rpc-validation",
  "version": "0.8.4",
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

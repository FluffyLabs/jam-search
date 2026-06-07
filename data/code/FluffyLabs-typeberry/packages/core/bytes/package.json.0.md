---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/bytes/package.json#L1-L16
title: packages/core/bytes/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 0e5896f2a02b5e1fe5d1c054c9ba24e38fb767298bcd7a9ce82b638f17ac1fca
language: json
---
`packages/core/bytes/package.json` (lines 1–16)

```json
{
  "name": "@typeberry/bytes",
  "version": "0.8.4",
  "description": "Byte-related utilities and types.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/ordering": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

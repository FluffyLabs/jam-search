---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/pvm/package.json#L1-L18'
title: bin/pvm/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9fe6089c3cfef4189b772a2436defd8a59643ee3fa236e5de96dc558d8697e53
language: json
---
`bin/pvm/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/pvm",
  "version": "0.8.1",
  "description": "PVM program runner.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/pvm-interface": "*",
    "@typeberry/pvm-interpreter": "*",
    "@typeberry/pvm-interpreter-ananas": "*"
  },
  "scripts": {
    "start": "tsx ./index.ts",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

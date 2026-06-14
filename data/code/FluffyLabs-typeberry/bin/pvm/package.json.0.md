---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/pvm/package.json#L1-L18'
title: bin/pvm/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 9a42ce80df0e5bab9b9d7f895bc91cd7a323f7b03dd390357f85063f90975b80
language: json
---
`bin/pvm/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/pvm",
  "version": "0.9.0",
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

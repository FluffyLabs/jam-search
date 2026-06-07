---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/pvm/package.json#L1-L18'
title: bin/pvm/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 14ac95adf3ac64c92da84ee04264e04f4250af8cc559f40fc0906013bacae68e
language: json
---
`bin/pvm/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/pvm",
  "version": "0.8.4",
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

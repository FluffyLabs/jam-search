---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/pvm/package.json#L1-L18'
title: bin/pvm/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f4a6879c8dd822b931f9278cd352f0cc4425ea5bca548096fc86ebee99cd6070
language: json
---
`bin/pvm/package.json` (lines 1–18)

```json
{
  "name": "@typeberry/pvm",
  "version": "0.5.11",
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

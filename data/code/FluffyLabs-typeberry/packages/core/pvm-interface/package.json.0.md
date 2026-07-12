---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interface/package.json#L1-L17
title: packages/core/pvm-interface/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4c633a5f847116f748025c7030615dd0612bc8894760a7a7e674826dadcb9964
language: json
---
`packages/core/pvm-interface/package.json` (lines 1–17)

```json
{
  "name": "@typeberry/pvm-interface",
  "version": "0.11.0",
  "description": "A PVM interface for external implementations.",
  "main": "index.ts",
  "dependencies": {
    "@typeberry/numbers": "*",
    "@typeberry/utils": "*"
  },
  "scripts": {
    "start": "tsx ./bin.ts",
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  },
  "author": "Fluffy Labs",
  "license": "MPL-2.0",
  "type": "module"
}
```

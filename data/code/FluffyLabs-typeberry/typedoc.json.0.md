---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/typedoc.json#L1-L18'
title: typedoc.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: edffa846befe0c9a3ca5f525b77338fd846354dc0a202a4f82c245673e829bfd
language: json
---
`typedoc.json` (lines 1–18)

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "plugin": ["typedoc-github-theme"],
  "includeVersion": true,
  "out": "./web/docs",
  "name": "Typeberry by Fluffy Labs",
  "entryPoints": ["./bin/lib/exports/*"],
  "searchInComments": true,
  "searchInDocuments": true,
  "projectDocuments": [
    "./README.md",
    "./bin/convert/README.md",
    "./bin/jam/README.md",
    "./bin/lib/README.md",
    "./packages/README.md",
    "./packages/jam/rpc/README.md"
  ]
}
```

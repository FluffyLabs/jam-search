---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/configs/package.json#L1-L12
title: packages/configs/package.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 22c43c14829f69b46a1fc06dd2ca8c3a825e13799bca0efbfbafc040099284f5
language: json
---
`packages/configs/package.json` (lines 1–12)

```json
{
  "name": "@typeberry/configs",
  "version": "0.7.0",
  "description": "A set of pre-defined JSON config files.",
  "license": "MPL-2.0",
  "author": "Fluffy Labs",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "test": "tsx --test $(find . -type f -name '*.test.ts' | tr '\\n' ' ')"
  }
}
```

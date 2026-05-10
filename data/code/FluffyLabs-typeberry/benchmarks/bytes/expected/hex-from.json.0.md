---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/bytes/expected/hex-from.json#L1-L30
title: benchmarks/bytes/expected/hex-from.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 7cf25dbc09b425c9840d09c974a90b0c3df9823452705f5044c9f8db1a3e6d00
language: json
---
`benchmarks/bytes/expected/hex-from.json` (lines 1–30)

```json
{
  "name": "Bytes / hex parsing",
  "date": "2024-09-16T11:53:30.029Z",
  "version": null,
  "results": [
    {
      "name": "parse hex using `Number` with NaN checking",
      "ops": 67822.92,
      "margin": 0.1
    },
    {
      "name": "parse hex from char codes",
      "ops": 454621.07,
      "margin": 5
    },
    {
      "name": "parse hex from string nibbles",
      "ops": 257193.94,
      "margin": 5
    }
  ],
  "fastest": {
    "name": "parse hex from char codes",
    "index": 1
  },
  "slowest": {
    "name": "parse hex using `Number` with NaN checking",
    "index": 0
  }
}
```

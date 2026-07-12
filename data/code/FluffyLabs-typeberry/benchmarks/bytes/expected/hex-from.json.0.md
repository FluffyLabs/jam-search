---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/bytes/expected/hex-from.json#L1-L30
title: benchmarks/bytes/expected/hex-from.json
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: a7fddd3a3b80b237765fbef5c2ed5bd3e21b72572ef22ba46f0b8914fd689e41
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
      "ops": 83811.61,
      "margin": 0.68
    },
    {
      "name": "parse hex from char codes",
      "ops": 441899.6,
      "margin": 0.29
    },
    {
      "name": "parse hex from string nibbles",
      "ops": 253385.58,
      "margin": 1.31
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

---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/ecalli-test/assembly/ecalli-index.ts#L1-L38
title: examples/ecalli-test/assembly/ecalli-index.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-16T00:03:25+02:00'
last_modified: '2026-06-16T00:03:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2cebf10a203f72537c15f4c54e9dde9bf7f329a37810f11188714e30363cf9e3
language: typescript
---
`examples/ecalli-test/assembly/ecalli-index.ts` (lines 1–38)

```typescript
/** Ecalli method indices matching the JAM specification. */
export enum EcalliIndex {
  // General (0-5, 100)
  Gas = 0,
  Fetch = 1,
  Lookup = 2,
  Read = 3,
  Write = 4,
  Info = 5,

  // Refine (6-13)
  HistoricalLookup = 6,
  Export = 7,
  Machine = 8,
  Peek = 9,
  Poke = 10,
  Pages = 11,
  Invoke = 12,
  Expunge = 13,

  // Accumulate (14-26)
  Bless = 14,
  Assign = 15,
  Designate = 16,
  Checkpoint = 17,
  NewService = 18,
  Upgrade = 19,
  Transfer = 20,
  Eject = 21,
  Query = 22,
  Solicit = 23,
  Forget = 24,
  YieldResult = 25,
  Provide = 26,

  // Debug
  Log = 100,
}
```

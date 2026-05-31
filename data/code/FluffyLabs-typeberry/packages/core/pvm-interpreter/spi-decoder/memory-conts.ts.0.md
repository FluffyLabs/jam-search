---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/spi-decoder/memory-conts.ts#L1-L8
title: packages/core/pvm-interpreter/spi-decoder/memory-conts.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 53b13c5a1605ea4432d81a91c78af3be745423f2980da146bf186e5702320853
language: typescript
---
`packages/core/pvm-interpreter/spi-decoder/memory-conts.ts` (lines 1–8)

```typescript
// GP reference: https://graypaper.fluffylabs.dev/#/7e6ff6a/2d32002d3200?v=0.6.7

export const PAGE_SIZE = 2 ** 12; // Z_P from GP
export const SEGMENT_SIZE = 2 ** 16; // Z_Z from GP
export const DATA_LEGNTH = 2 ** 24; // Z_I from GP
export const STACK_SEGMENT = 0xfe_fe_00_00; // 2^32 - 2Z_Z - Z_I from GP
export const ARGS_SEGMENT = 0xfe_ff_00_00; // 2^32 - Z_Z - Z_I from GP
export const LAST_PAGE = 0xff_ff_00_00;
```

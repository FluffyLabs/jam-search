---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/index.ts#L1-L22'
title: sdk/jam/refine/index.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-06-12T11:39:19+02:00'
last_modified: '2026-06-12T11:39:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9e39b2f60c4bdafb0d5afb07c20355eeeecdb27c2d9b08bbf491b1d5c43afe05
language: typescript
---
`sdk/jam/refine/index.ts` (lines 1–22)

```typescript
export { ExportSegmentError, RefineContext } from "./context";
export { RefineFetcher } from "./fetcher";
export {
  ExitReason,
  InvalidEntryPoint,
  InvokeIo,
  InvokeOutcome,
  Machine,
  OutOfBounds,
  PageAccess,
} from "./machine";
export {
  NestedPvm,
  SPI_ARGS_SEGMENT_START,
  SPI_MAX_ARGS_LEN,
  SPI_PAGE_SIZE,
  SPI_RO_START,
  SPI_SEGMENT_SIZE,
  SPI_STACK_SEGMENT_END,
  SpiError,
} from "./nested-pvm";
export { RefinePreimages } from "./preimages";
```

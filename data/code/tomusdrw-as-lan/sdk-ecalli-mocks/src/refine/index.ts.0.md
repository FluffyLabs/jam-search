---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/refine/index.ts#L1-L24
title: sdk-ecalli-mocks/src/refine/index.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c38ce17525d47d1ca36a7ade038ea7787409b5fc3f9ae216d613a354f1c2eebf
language: typescript
---
`sdk-ecalli-mocks/src/refine/index.ts` (lines 1–24)

```typescript
// Refine ecalli mock stubs (6-13).

export {
  historical_lookup, setHistoricalLookupPreimage, setHistoricalPreimage,
  setHistoricalLookupNone, resetHistoricalLookup,
} from "./lookup.js";
export { export_segment, setExportSegmentResult, resetSegments } from "./segments.js";
export {
  machine, peek, poke, pages, invoke, expunge, resetMachines,
  setMachineResult, setPeekResult, setPeekData, setPokeResult, setPagesResult, setInvokeResult,
  setInvokeIoR7, setExpungeResult,
  getPagesLogLength, getPagesLogField,
  getPokeLogLength, getPokeLogField, getPokeLogData,
} from "./machines.js";

import { resetHistoricalLookup } from "./lookup.js";
import { resetSegments } from "./segments.js";
import { resetMachines } from "./machines.js";

export function resetRefine(): void {
  resetHistoricalLookup();
  resetSegments();
  resetMachines();
}
```

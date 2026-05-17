---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk-ecalli-mocks/src/accumulate/checkpoint.ts#L1-L8
title: sdk-ecalli-mocks/src/accumulate/checkpoint.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 683297bada857ae98682d3958ec5a9e57aac006c23a7bd1d85794c4005ccb6f2
language: typescript
---
`sdk-ecalli-mocks/src/accumulate/checkpoint.ts` (lines 1–8)

```typescript
// Ecalli 17: Checkpoint — delegates to gas mock.

import { gas } from "../general/gas.js";

/** Ecalli 17: Checkpoint — commit state and return remaining gas. */
export function checkpoint(): bigint {
  return gas();
}
```

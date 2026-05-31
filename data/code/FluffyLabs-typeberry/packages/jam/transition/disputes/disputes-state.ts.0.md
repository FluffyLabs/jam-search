---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes-state.ts#L1-L7
title: packages/jam/transition/disputes/disputes-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b77b603f9247827b57043703c2f58d4a639d01f5a09de1617d2f0521c8efb23e
language: typescript
---
`packages/jam/transition/disputes/disputes-state.ts` (lines 1–7)

```typescript
import type { State } from "@typeberry/state";

export type DisputesState = Pick<
  State,
  "disputesRecords" | "availabilityAssignment" | "timeslot" | "currentValidatorData" | "previousValidatorData"
>;
export type DisputesStateUpdate = Pick<DisputesState, "disputesRecords" | "availabilityAssignment">;
```

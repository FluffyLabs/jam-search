---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-state.ts#L1-L43
title: packages/jam/transition/accumulate/accumulate-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 7c20d78449560655dc681f6934247a1e2473031ed9c7701e63c0525ae1c0e730
language: typescript
---
`packages/jam/transition/accumulate/accumulate-state.ts` (lines 1–43)

```typescript
import type { EntropyHash, ServiceId, TimeSlot } from "@typeberry/block";
import type { WorkReport } from "@typeberry/block/work-report.js";
import type { SortedArray } from "@typeberry/collections";
import type { OpaqueHash } from "@typeberry/hash";
import type { ServiceStateUpdate } from "@typeberry/jam-host-calls";
import type { AccumulationOutput, State } from "@typeberry/state";
import type { CountAndGasUsed } from "../statistics.js";

/** `G_A`: The gas allocated to invoke a work-report’s Accumulation logic. */
export const GAS_TO_INVOKE_WORK_REPORT = 10_000_000n;

export type AccumulateRoot = OpaqueHash;

export type AccumulateInput = {
  /** time slot from header */
  slot: TimeSlot;
  /** List of newly available work-reports */
  reports: WorkReport[];
  /** eta0' (after Safrole STF) - it is not eta0 from state! */
  entropy: EntropyHash;
};

export type AccumulateState = Pick<
  State,
  | "timeslot"
  | "designatedValidatorData"
  | "authQueues"
  | "getService"
  | "recentlyAccumulated"
  | "accumulationQueue"
  | "privilegedServices"
>;

/** Aggregated update of the accumulation state transition. */
export type AccumulateStateUpdate = Pick<State, "timeslot"> &
  Partial<Pick<State, "recentlyAccumulated" | "accumulationQueue">> &
  ServiceStateUpdate;

export type AccumulateResult = {
  stateUpdate: AccumulateStateUpdate;
  accumulationStatistics: Map<ServiceId, CountAndGasUsed>;
  accumulationOutputLog: SortedArray<AccumulationOutput>;
};
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/assurances.ts#L1-L37
title: packages/jam/state/assurances.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9435152082f5d16af087199538997b82d8be1bbb1e5ac0405c57e6c5b607b62d
language: typescript
---
`packages/jam/state/assurances.ts` (lines 1–37)

```typescript
import type { TimeSlot } from "@typeberry/block";
import { WorkReport } from "@typeberry/block/work-report.js";
import { type CodecRecord, codec, type DescribedBy } from "@typeberry/codec";
import { WithDebug } from "@typeberry/utils";
import { codecPerCore } from "./common.js";

/**
 * Assignment of particular work report to a core.
 *
 * Used by "Assurances" and "Disputes" subsystem, denoted by `rho`
 * in state.
 *
 * https://graypaper.fluffylabs.dev/#/579bd12/135800135800
 */
export class AvailabilityAssignment extends WithDebug {
  static Codec = codec.Class(AvailabilityAssignment, {
    workReport: WorkReport.Codec,
    timeout: codec.u32.asOpaque<TimeSlot>(),
  });

  static create({ workReport, timeout }: CodecRecord<AvailabilityAssignment>) {
    return new AvailabilityAssignment(workReport, timeout);
  }

  private constructor(
    /** Work report assigned to a core. */
    public readonly workReport: WorkReport,
    /** Time slot at which the report becomes obsolete. */
    public readonly timeout: TimeSlot,
  ) {
    super();
  }
}

export const availabilityAssignmentsCodec = codecPerCore(codec.optional(AvailabilityAssignment.Codec));

export type AvailabilityAssignmentsView = DescribedBy<typeof availabilityAssignmentsCodec.View>;
```

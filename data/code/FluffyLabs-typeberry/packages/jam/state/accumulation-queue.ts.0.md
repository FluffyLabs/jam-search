---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/accumulation-queue.ts#L1-L57
title: packages/jam/state/accumulation-queue.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 3d61899ef1d174b92cc916fbb0c79c2bd90d7dc9f0e41db5ef69a3ab8c5c90d4
language: typescript
---
`packages/jam/state/accumulation-queue.ts` (lines 1–57)

```typescript
import { codecPerEpochBlock, type PerEpochBlock } from "@typeberry/block";
import { codecKnownSizeArray } from "@typeberry/block/codec-utils.js";
import { MAX_REPORT_DEPENDENCIES } from "@typeberry/block/gp-constants.js";
import type { WorkPackageHash } from "@typeberry/block/refine-context.js";
import { WorkReport } from "@typeberry/block/work-report.js";
import { type CodecRecord, codec, type DescribedBy } from "@typeberry/codec";
import type { KnownSizeArray } from "@typeberry/collections";
import { HASH_SIZE } from "@typeberry/hash";
import { WithDebug } from "@typeberry/utils";

/**
 * Ready (i.e. available and/or audited) but not-yet-accumulated work-reports.
 *
 * https://graypaper.fluffylabs.dev/#/5f542d7/165300165400
 */
export class NotYetAccumulatedReport extends WithDebug {
  static Codec = codec.Class(NotYetAccumulatedReport, {
    report: WorkReport.Codec,
    dependencies: codecKnownSizeArray(codec.bytes(HASH_SIZE).asOpaque<WorkPackageHash>(), {
      typicalLength: MAX_REPORT_DEPENDENCIES / 2,
      maxLength: MAX_REPORT_DEPENDENCIES,
      minLength: 0,
    }),
  });

  static create({ report, dependencies }: CodecRecord<NotYetAccumulatedReport>) {
    return new NotYetAccumulatedReport(report, dependencies);
  }

  private constructor(
    /**
     * Each of these were made available at most one epoch ago
     * but have or had unfulfilled dependencies.
     */
    readonly report: WorkReport,
    /**
     * Alongside the work-report itself, we retain its un-accumulated
     * dependencies, a set of work-package hashes.
     *
     * https://graypaper.fluffylabs.dev/#/5f542d7/165800165800
     */
    readonly dependencies: KnownSizeArray<WorkPackageHash, `[0..${MAX_REPORT_DEPENDENCIES})`>,
  ) {
    super();
  }
}

/**
 * Accumulation queue state entry.
 */
export type AccumulationQueue = PerEpochBlock<readonly NotYetAccumulatedReport[]>;

export const accumulationQueueCodec = codecPerEpochBlock(
  codec.readonlyArray(codec.sequenceVarLen(NotYetAccumulatedReport.Codec)),
);

export type AccumulationQueueView = DescribedBy<typeof accumulationQueueCodec.View>;
```

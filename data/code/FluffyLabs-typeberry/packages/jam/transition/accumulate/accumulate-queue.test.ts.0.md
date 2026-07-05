---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-queue.test.ts#L1-L98
title: packages/jam/transition/accumulate/accumulate-queue.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 4
content_sha: 882289967f1246a305cd3e72caad87928f1d8ffd98821576176b8fceef602d0d
language: typescript
---
`packages/jam/transition/accumulate/accumulate-queue.test.ts` (lines 1–98)

```typescript
import { describe, it } from "node:test";
import { tryAsCoreIndex, tryAsPerEpochBlock, tryAsServiceGas, tryAsServiceId, tryAsTimeSlot } from "@typeberry/block";
import { RefineContext, type WorkPackageHash, WorkPackageInfo } from "@typeberry/block/refine-context.js";
import { tryAsWorkItemsCount } from "@typeberry/block/work-package.js";
import { WorkPackageSpec, WorkReport } from "@typeberry/block/work-report.js";
import { WorkExecResult, WorkRefineLoad, WorkResult } from "@typeberry/block/work-result.js";

import { Bytes, BytesBlob } from "@typeberry/bytes";
import { asKnownSize, FixedSizeArray, HashSet } from "@typeberry/collections";
import { tinyChainSpec } from "@typeberry/config";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU16, tryAsU32 } from "@typeberry/numbers";
import { InMemoryState, NotYetAccumulatedReport, PrivilegedServices, tryAsPerCore } from "@typeberry/state";
import { deepEqual } from "@typeberry/utils";
import { AccumulateQueue, pruneQueue } from "./accumulate-queue.js";

describe("accumulate-queue", () => {
  const createWorkReportHash = (i: number): WorkPackageHash => Bytes.fill(HASH_SIZE, i).asOpaque();

  const createWorkPackageInfo = (i: number): WorkPackageInfo =>
    WorkPackageInfo.create({
      segmentTreeRoot: Bytes.zero(HASH_SIZE).asOpaque(),
      workPackageHash: createWorkReportHash(i),
    });

  const createWorkReport = (
    workPackageHash: WorkPackageHash,
    prerequisites: WorkPackageHash[] = [],
    segmentRootLookup: WorkPackageInfo[] = [],
  ) =>
    WorkReport.create({
      authorizationGasUsed: tryAsServiceGas(0n),
      authorizationOutput: BytesBlob.empty(),
      authorizerHash: Bytes.zero(HASH_SIZE).asOpaque(),
      context: RefineContext.create({
        anchor: Bytes.zero(HASH_SIZE).asOpaque(),
        beefyRoot: Bytes.zero(HASH_SIZE).asOpaque(),
        lookupAnchor: Bytes.zero(HASH_SIZE).asOpaque(),
        lookupAnchorSlot: tryAsTimeSlot(0),
        prerequisites,
        stateRoot: Bytes.zero(HASH_SIZE).asOpaque(),
      }),
      coreIndex: tryAsCoreIndex(0),
      results: FixedSizeArray.new(
        [
          WorkResult.create({
            codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
            gas: tryAsServiceGas(0),
            load: WorkRefineLoad.create({
              gasUsed: tryAsServiceGas(0),
              exportedSegments: tryAsU32(0),
              extrinsicCount: tryAsU32(0),
              extrinsicSize: tryAsU32(0),
              importedSegments: tryAsU32(0),
            }),
            payloadHash: Bytes.zero(HASH_SIZE).asOpaque(),
            result: WorkExecResult.ok(BytesBlob.empty()),
            serviceId: tryAsServiceId(0),
          }),
        ],
        tryAsWorkItemsCount(1),
      ),
      segmentRootLookup,
      workPackageSpec: WorkPackageSpec.create({
        erasureRoot: Bytes.zero(HASH_SIZE).asOpaque(),
        exportsCount: tryAsU16(0),
        exportsRoot: Bytes.zero(HASH_SIZE).asOpaque(),
        hash: workPackageHash,
        length: tryAsU32(0),
      }),
    });

  const createNotAccumulatedWorkReport = (
    workPackageHash: WorkPackageHash,
    dependencies: WorkPackageHash[] = [],
    prerequisites: WorkPackageHash[] = [],
    segmentRootLookup: WorkPackageInfo[] = [],
  ) =>
    NotYetAccumulatedReport.create({
      report: createWorkReport(workPackageHash, prerequisites, segmentRootLookup),
      dependencies: asKnownSize(dependencies),
    });

  describe("AccumulateQueue", () => {
    const createEmptyRecentlyAccumulated = (): HashSet<WorkPackageHash>[] => {
      const queue = new Array(tinyChainSpec.epochLength);
      queue.fill(HashSet.new());
      return queue;
    };

    const createEmptyAccumulationQueue = (): NotYetAccumulatedReport[][] => {
      const queue = new Array(tinyChainSpec.epochLength);
      queue.fill([]);
      return queue;
    };

    const createAccumulateQueue = (
      recentlyAccumulated: HashSet<WorkPackageHash>[] = createEmptyRecentlyAccumulated(),
```

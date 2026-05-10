---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-queue.test.ts#L92-L172
title: packages/jam/transition/accumulate/accumulate-queue.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 4
content_sha: 349aac71126c40f204efe687d0bb1e0bd851f07ed7e86f407a703bdf5b22e241
language: typescript
---
`packages/jam/transition/accumulate/accumulate-queue.test.ts` (lines 92–172)

```typescript
      const queue = new Array(tinyChainSpec.epochLength);
      queue.fill([]);
      return queue;
    };

    const createAccumulateQueue = (
      recentlyAccumulated: HashSet<WorkPackageHash>[] = createEmptyRecentlyAccumulated(),
      accumulationQueue: NotYetAccumulatedReport[][] = createEmptyAccumulationQueue(),
    ) =>
      new AccumulateQueue(
        tinyChainSpec,
        InMemoryState.partial(tinyChainSpec, {
          privilegedServices: PrivilegedServices.create({
            manager: tryAsServiceId(0),
            assigners: tryAsPerCore(new Array(tinyChainSpec.coresCount).fill(tryAsServiceId(0)), tinyChainSpec),
            delegator: tryAsServiceId(0),
            registrar: tryAsServiceId(0),
            autoAccumulateServices: new Map(),
          }),
          recentlyAccumulated: tryAsPerEpochBlock(recentlyAccumulated, tinyChainSpec),
          accumulationQueue: tryAsPerEpochBlock(accumulationQueue, tinyChainSpec),
          timeslot: tryAsTimeSlot(1),
        }),
      );

    describe("getWorkReportsToAccumulateImmediately", () => {
      it("should return reports without prerequisites", () => {
        const accumulationQueue = createAccumulateQueue();
        const reportsWithoutPrerequisitesAndSegments = [createWorkReport(createWorkReportHash(0))];
        const reportsWithPrerequisites = [createWorkReport(createWorkReportHash(1), [createWorkReportHash(2)])];
        const reports = [...reportsWithPrerequisites, ...reportsWithoutPrerequisitesAndSegments];

        const result = accumulationQueue.getWorkReportsToAccumulateImmediately(reports);

        deepEqual(result, reportsWithoutPrerequisitesAndSegments);
      });

      it("should return reports without segments", () => {
        const accumulationQueue = createAccumulateQueue();
        const reportsWithoutPrerequisitesAndSegments = [createWorkReport(createWorkReportHash(0))];
        const reportsWithSegments = [createWorkReport(createWorkReportHash(1), undefined, [createWorkPackageInfo(3)])];
        const reports = [...reportsWithoutPrerequisitesAndSegments, ...reportsWithSegments];

        const result = accumulationQueue.getWorkReportsToAccumulateImmediately(reports);

        deepEqual(result, reportsWithoutPrerequisitesAndSegments);
      });
    });

    describe("getWorkReportsToAccumulateLater", () => {
      it("should return report with prerequisites", () => {
        const accumulationQueue = createAccumulateQueue();
        const reportsWithoutPrerequisitesAndSegments = [createWorkReport(createWorkReportHash(0))];
        const prerequisites = [createWorkReportHash(2)];
        const reportsWithPrerequisites = [createWorkReport(createWorkReportHash(1), prerequisites)];
        const reports = [...reportsWithPrerequisites, ...reportsWithoutPrerequisitesAndSegments];
        const expectedReports = reportsWithPrerequisites.map((report) =>
          NotYetAccumulatedReport.create({ report, dependencies: asKnownSize(prerequisites) }),
        );

        const result = accumulationQueue.getWorkReportsToAccumulateLater(reports);

        deepEqual(result, expectedReports);
      });

      it("should return report with segments", () => {
        const accumulationQueue = createAccumulateQueue();
        const segments = [createWorkPackageInfo(3)];
        const segmentHashes = segments.map((segment) => segment.workPackageHash);
        const reportsWithoutPrerequisitesAndSegments = [createWorkReport(createWorkReportHash(0))];
        const reportsWithSegments = [createWorkReport(createWorkReportHash(1), undefined, segments)];
        const reports = [...reportsWithoutPrerequisitesAndSegments, ...reportsWithSegments];
        const expectedResult = reportsWithSegments.map((report) =>
          NotYetAccumulatedReport.create({ report, dependencies: asKnownSize(segmentHashes) }),
        );

        const result = accumulationQueue.getWorkReportsToAccumulateLater(reports);

        deepEqual(result, expectedResult);
      });

```

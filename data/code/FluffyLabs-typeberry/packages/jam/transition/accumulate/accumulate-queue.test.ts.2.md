---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-queue.test.ts#L165-L254
title: packages/jam/transition/accumulate/accumulate-queue.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 6486db81fd6944ec8fb85c46f6ef1a73df1575454bca86ae947a6c9aa211c6e6
language: typescript
---
`packages/jam/transition/accumulate/accumulate-queue.test.ts` (lines 165–254)

```typescript
          NotYetAccumulatedReport.create({ report, dependencies: asKnownSize(segmentHashes) }),
        );

        const result = accumulationQueue.getWorkReportsToAccumulateLater(reports);

        deepEqual(result, expectedResult);
      });

      it("should remove reports that were accumulate earlier", () => {
        const dependencies = [createWorkReportHash(5)];
        const reports = [0, 1, 2, 3].map((i) => createWorkReport(createWorkReportHash(i), dependencies));
        const history = [0, 1].map((i) => createWorkReportHash(i));
        const recentlyAccumulated = createEmptyRecentlyAccumulated();
        recentlyAccumulated[0].insertAll(history);
        const accumulationQueue = createAccumulateQueue(recentlyAccumulated);
        const expectedReports = reports
          .slice(2)
          .map((report) => NotYetAccumulatedReport.create({ report, dependencies: asKnownSize(dependencies) }));

        const result = accumulationQueue.getWorkReportsToAccumulateLater(reports);

        deepEqual(result, expectedReports);
      });
    });

    describe("enqueueReports", () => {
      it("should move reports without deps to the beginning", () => {
        const accumulationQueue = createAccumulateQueue();
        const dependencies = [4, 5, 6].map((i) => createWorkReportHash(i));
        const reportsWithDeps = [1, 2, 3].map((i) =>
          createNotAccumulatedWorkReport(createWorkReportHash(i), dependencies),
        );
        const reportsWithoutDeps = [4, 5, 6].map((i) => createNotAccumulatedWorkReport(createWorkReportHash(i)));
        const reports = [...reportsWithDeps, ...reportsWithoutDeps];
        const expectedReports = [...reportsWithoutDeps, ...reportsWithDeps].map((x) => x.report);

        const result = accumulationQueue.enqueueReports(reports);

        deepEqual(result, expectedReports);
      });

      it("should remove reports when deps cannot be met", () => {
        const accumulationQueue = createAccumulateQueue();
        const dependencies = [9].map((i) => createWorkReportHash(i));
        const reportsWithDeps = [1, 2, 3].map((i) =>
          createNotAccumulatedWorkReport(createWorkReportHash(i), dependencies),
        );
        const reportsWithoutDeps = [4, 5, 6].map((i) => createNotAccumulatedWorkReport(createWorkReportHash(i)));
        const reports = [...reportsWithDeps, ...reportsWithoutDeps];
        const expectedReports = [...reportsWithoutDeps].map((x) => x.report);

        const result = accumulationQueue.enqueueReports(reports);

        deepEqual(result, expectedReports);
      });
    });

    describe("getQueueFromState", () => {
      it("should split reports in state by phase index and move the second part to the beginning", () => {
        const queue = Array.from({ length: tinyChainSpec.epochLength }, (_, i) => [
          createNotAccumulatedWorkReport(createWorkReportHash(i)),
        ]);
        const accumulateQueue = createAccumulateQueue(undefined, queue);
        const phaseIndex = 7;
        const slot = tryAsTimeSlot(tinyChainSpec.epochLength + phaseIndex);
        const expectedQueue = [...queue.slice(phaseIndex), ...queue.slice(0, phaseIndex)].flat();

        const result = accumulateQueue.getQueueFromState(slot);

        deepEqual(result, expectedQueue);
      });
    });
  });

  describe("pruneQueue", () => {
    it("should return the same queue when processed hash set is empty", () => {
      const reportsToAccumulate = [
        createNotAccumulatedWorkReport(createWorkReportHash(0)),
        createNotAccumulatedWorkReport(createWorkReportHash(1)),
      ];
      const processedHashes: HashSet<WorkPackageHash> = HashSet.new();

      const result = pruneQueue(reportsToAccumulate, processedHashes);

      deepEqual(result, reportsToAccumulate);
    });

    it("should remove report when processed hash set contains it", () => {
      const workReportHash = createWorkReportHash(0);
      const reportsToAccumulate = [
```

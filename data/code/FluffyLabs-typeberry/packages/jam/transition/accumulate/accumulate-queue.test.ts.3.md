---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-queue.test.ts#L249-L284
title: packages/jam/transition/accumulate/accumulate-queue.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 3
chunk_total: 4
content_sha: 02bb0d5b969fb7333115d8c46fba09ddeaa713071aa4ba855ed032953f401ccf
language: typescript
---
`packages/jam/transition/accumulate/accumulate-queue.test.ts` (lines 249–284)

```typescript
      deepEqual(result, reportsToAccumulate);
    });

    it("should remove report when processed hash set contains it", () => {
      const workReportHash = createWorkReportHash(0);
      const reportsToAccumulate = [
        createNotAccumulatedWorkReport(workReportHash),
        createNotAccumulatedWorkReport(createWorkReportHash(1)),
      ];
      const processedHashes: HashSet<WorkPackageHash> = HashSet.from([workReportHash]);
      const expectedReportsToAccumulate = reportsToAccumulate.slice(1);

      const result = pruneQueue(reportsToAccumulate, processedHashes);

      deepEqual(result, expectedReportsToAccumulate);
    });

    it("should remove work package hash from dependencies when processed hash set contains it", () => {
      const dependencyHash = createWorkReportHash(0);
      const workReportHash = createWorkReportHash(1);
      const reportsToAccumulate = [
        createNotAccumulatedWorkReport(workReportHash, [dependencyHash]),
        createNotAccumulatedWorkReport(createWorkReportHash(2)),
      ];
      const processedHashes: HashSet<WorkPackageHash> = HashSet.from([dependencyHash]);
      const expectedReportsToAccumulate = [
        createNotAccumulatedWorkReport(workReportHash),
        ...reportsToAccumulate.slice(1),
      ];

      const result = pruneQueue(reportsToAccumulate, processedHashes);

      deepEqual(result, expectedReportsToAccumulate);
    });
  });
});
```

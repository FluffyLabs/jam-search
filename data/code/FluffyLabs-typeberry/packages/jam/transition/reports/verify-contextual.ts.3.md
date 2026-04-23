---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-contextual.ts#L300-L327
title: packages/jam/transition/reports/verify-contextual.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 6180567e747e3f1cf33a8c819e05e6036be65424676bbc864b00ab7fec30b04f
language: typescript
---
`packages/jam/transition/reports/verify-contextual.ts` (lines 300–327)

```typescript
  // all work packages recently accumulated
  for (const hashes of state.recentlyAccumulated) {
    packagesInPipeline.insertAll(Array.from(hashes));
  }

  // all work packages that are in reports, which await accumulation
  for (const pendingAccumulation of state.accumulationQueue) {
    packagesInPipeline.insertAll(pendingAccumulation.map((x) => x.report.workPackageSpec.hash));
  }

  // finally all packages from reports with pending availability
  for (const pendingAvailability of state.availabilityAssignment) {
    if (pendingAvailability !== null) {
      packagesInPipeline.insert(pendingAvailability.workReport.workPackageSpec.hash);
    }
  }

  // let's check if any of our packages is in the pipeline
  const intersection = packagesInPipeline.intersection(workPackageHashes);
  for (const packageHash of intersection) {
    return Result.error(
      ReportsError.DuplicatePackage,
      () => `The same work package hash found in the pipeline (workPackageHash: ${packageHash})`,
    );
  }

  return Result.ok(OK);
}
```

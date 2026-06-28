---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-queue.ts#L107-L115
title: packages/jam/transition/accumulate/accumulate-queue.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 3b1812f48a2ecb26e04c087396fe7ca91fedffc39bc5ab930c0d5ca01b38cdf0
language: typescript
---
`packages/jam/transition/accumulate/accumulate-queue.ts` (lines 107–115)

```typescript
    .filter(({ report }) => !processedHashes.has(report.workPackageSpec.hash))
    .map((item) => {
      const { report, dependencies } = item;
      return NotYetAccumulatedReport.create({
        report,
        dependencies: asKnownSize(dependencies.filter((dependency) => !processedHashes.has(dependency))),
      });
    });
}
```

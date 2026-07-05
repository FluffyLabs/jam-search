---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.test.ts#L422-L427
title: packages/jam/transition/accumulate/accumulate.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 5
chunk_total: 13
content_sha: 3efd475b572a092e4a8b39035dc25d693fa8d1e190143d5c5e8600f6481467b5
language: typescript
---
`packages/jam/transition/accumulate/accumulate.test.ts` (lines 422–427)

```typescript
  NotYetAccumulatedReport.create({
    report: createWorkReport(workPackageHash, prerequisites, serviceId),
    dependencies: asKnownSize(dependencies),
  });

const preimageBlob = BytesBlob.parseBlob(
```

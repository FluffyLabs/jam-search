---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-post-signature.test.ts#L102-L125
title: packages/jam/transition/reports/verify-post-signature.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: eef1bc434174841eb38deb2036a171236651dca67cda2726b680d5f4b6088591
language: typescript
---
`packages/jam/transition/reports/verify-post-signature.test.ts` (lines 102–125)

```typescript
    const workReport = newWorkReport({ core: 0, authorizer: Bytes.fill(HASH_SIZE, 1) });
    // override gas to make it too high.
    workReport.results[0] = WorkResult.create({
      ...workReport.results[0],
      gas: asOpaqueType(tryAsU64(G_A + 1)),
    });
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: workReport,
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);

    const res = reports.verifyPostSignatureChecks(guarantees, reports.state.availabilityAssignment);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.WorkReportGasTooHigh,
      details: () => "Total gas too high. Got: 10000001 (ovfl: false), maximal: 10000000",
    });
  });
});
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-contextual.test.ts#L303-L412
title: packages/jam/transition/reports/verify-contextual.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 3
chunk_total: 5
content_sha: f51d0b1bc1a22b5256d31571e19c425ee588be8db3f20bab840998af17508719
language: typescript
---
`packages/jam/transition/reports/verify-contextual.test.ts` (lines 303–412)

```typescript
        "The same work package hash found in the pipeline (workPackageHash: 0x3930000063c03371b9dad9f1c60473ec0326c970984e9c90c0b5ed90eba6ada4)",
    });
  });

  it("should reject duplicate work package from accumulation queue", async () => {
    const reports = await newReports({
      services: initialServices(),
      accumulationQueue: [
        NotYetAccumulatedReport.create({ report: newWorkReport({ core: 1 }), dependencies: asKnownSize([]) }),
      ],
      clearAvailabilityOnZero: true,
    });

    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({
          core: 0,
          beefyRoot: Bytes.zero(HASH_SIZE),
        }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);
    const input = {
      slot: tryAsTimeSlot(10),
      guarantees,
      newEntropy: ENTROPY,
      recentBlocksPartialUpdate: reports.state.recentBlocks,
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
      previousValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
    };
    const res = reports.verifyContextualValidity(input);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.DuplicatePackage,
      details: () =>
        "The same work package hash found in the pipeline (workPackageHash: 0x3930000063c03371b9dad9f1c60473ec0326c970984e9c90c0b5ed90eba6ada4)",
    });
  });

  it("should reject duplicate work package from recent blocks history", async () => {
    const reports = await newReports({
      services: initialServices(),
      reportedInRecentBlocks: HashDictionary.fromEntries(
        [
          WorkPackageInfo.create({
            workPackageHash: newWorkReport({ core: 0 }).workPackageSpec.hash,
            segmentTreeRoot: Bytes.zero(HASH_SIZE).asOpaque(),
          }),
        ].map((x) => [x.workPackageHash, x]),
      ),
      clearAvailabilityOnZero: true,
    });

    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({
          core: 0,
          beefyRoot: Bytes.zero(HASH_SIZE),
        }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);
    const input = {
      slot: tryAsTimeSlot(10),
      guarantees,
      newEntropy: ENTROPY,
      recentBlocksPartialUpdate: reports.state.recentBlocks,
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
      previousValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
    };
    const res = reports.verifyContextualValidity(input);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.DuplicatePackage,
      details: () =>
        "The same work package hash found in the pipeline (workPackageHash: 0x3930000063c03371b9dad9f1c60473ec0326c970984e9c90c0b5ed90eba6ada4)",
    });
  });

  it("should reject duplicate work package from recently accumulated work packages", async () => {
    const reports = await newReports({
      services: initialServices(),
      recentlyAccumulated: HashSet.from([newWorkReport({ core: 0 }).workPackageSpec.hash]),
      clearAvailabilityOnZero: true,
    });

    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({
          core: 0,
          beefyRoot: Bytes.zero(HASH_SIZE),
        }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);
    const input = {
      slot: tryAsTimeSlot(10),
      guarantees,
      newEntropy: ENTROPY,
```

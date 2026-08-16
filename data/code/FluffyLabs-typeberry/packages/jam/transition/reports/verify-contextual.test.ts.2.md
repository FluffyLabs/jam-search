---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-contextual.test.ts#L198-L309
title: packages/jam/transition/reports/verify-contextual.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 5
content_sha: f31b7a960ae3d49c58304d5d46f946d2209174287666e137b8ab00915adda4bb
language: typescript
---
`packages/jam/transition/reports/verify-contextual.test.ts` (lines 198–309)

```typescript
    const reports = await newReports({
      services: initialServices(),
    });
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({
          core: 0,
          beefyRoot: Bytes.zero(HASH_SIZE),
          lookupAnchorSlot: tryAsTimeSlot(1),
        }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);
    const input = {
      slot: tryAsTimeSlot(20_000),
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
      error: ReportsError.SegmentRootLookupInvalid,
      details: () => "Lookup anchor slot's too old. Got: 1, minimal: 19976",
    });
  });

  it("should reject lookup anchor not in chain", async () => {
    const reports = await newReports({
      services: initialServices(),
    });
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({
          core: 0,
          beefyRoot: Bytes.zero(HASH_SIZE),
          lookupAnchor: Bytes.fill(HASH_SIZE, 1),
          lookupAnchorSlot: tryAsTimeSlot(1),
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
      error: ReportsError.SegmentRootLookupInvalid,
      details: () =>
        "Lookup anchor is not found in chain. Hash: 0x0101010101010101010101010101010101010101010101010101010101010101 (slot: 1)",
    });
  });

  it("should reject duplicate work package that's pending", async () => {
    const reports = await newReports({
      withCoreAssignment: true,
      services: initialServices(),
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

  it("should reject duplicate work package from accumulation queue", async () => {
    const reports = await newReports({
      services: initialServices(),
```

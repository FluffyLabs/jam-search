---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-credentials.test.ts#L105-L209
title: packages/jam/transition/reports/verify-credentials.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 3
content_sha: d5a300096eda4442f50c034a772fd6b6c05a07cc8cde4e50187bda77b5f10a41
language: typescript
---
`packages/jam/transition/reports/verify-credentials.test.ts` (lines 105–209)

```typescript
      recentBlocksPartialUpdate: reports.state.recentBlocks,
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
      previousValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
    };
    const hashes = reports.workReportHashes(guarantees, await Blake2b.createHasher());
    const res = reports.verifyCredentials(input, hashes);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.NotSortedOrUniqueGuarantors,
      details: () => "Credentials must be sorted by validator index. Got 0, expected at least 2",
    });
  });

  it("should reject invalid core assignment", async () => {
    const reports = await newReports();
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(5),
        report: newWorkReport({ core: 1 }),
        credentials: asOpaqueType([0, 1].map((x) => newCredential(x))),
      }),
    ]);

    const input = {
      guarantees,
      slot: tryAsTimeSlot(6),
      newEntropy: ENTROPY,
      recentBlocksPartialUpdate: reports.state.recentBlocks,
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
      previousValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
    };
    const hashes = reports.workReportHashes(guarantees, await Blake2b.createHasher());
    const res = reports.verifyCredentials(input, hashes);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.WrongAssignment,
      details: () => "Invalid core assignment for validator 1. Expected: 0, got: 1",
    });
  });

  it("should reject future reports", async () => {
    const reports = await newReports();
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(5),
        report: newWorkReport({ core: 0 }),
        credentials: asOpaqueType([0, 1].map((x) => newCredential(x))),
      }),
    ]);

    const input = {
      guarantees,
      slot: tryAsTimeSlot(4),
      newEntropy: ENTROPY,
      recentBlocksPartialUpdate: reports.state.recentBlocks,
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
      previousValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
    };
    const hashes = reports.workReportHashes(guarantees, await Blake2b.createHasher());
    const res = reports.verifyCredentials(input, hashes);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.FutureReportSlot,
      details: () => "Report slot is in future. Block 4, Report: 5",
    });
  });

  it("should reject old reports", async () => {
    const reports = await newReports();
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(9),
        report: newWorkReport({ core: 0 }),
        credentials: asOpaqueType([0, 3].map((x) => newCredential(x))),
      }),
    ]);

    const input = {
      guarantees,
      slot: tryAsTimeSlot(25),
      newEntropy: ENTROPY,
      recentBlocksPartialUpdate: reports.state.recentBlocks,
      assurancesAvailAssignment: reports.state.availabilityAssignment,
      offenders: HashSet.new<Ed25519Key>(),
      currentValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
      previousValidatorData: tryAsPerValidator(initialValidators(), tinyChainSpec),
    };
    const hashes = reports.workReportHashes(guarantees, await Blake2b.createHasher());
    const res = reports.verifyCredentials(input, hashes);

    deepEqual(res, {
      isOk: false,
      isError: true,
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-contextual.test.ts#L97-L203
title: packages/jam/transition/reports/verify-contextual.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 5
content_sha: 34b046d0ddafd60445d6155e7b0ce1fc1d6412e22e5aec43a0eead767f40d912
language: typescript
---
`packages/jam/transition/reports/verify-contextual.test.ts` (lines 97–203)

```typescript
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({
          core: 0,
          anchorBlock: Bytes.fill(HASH_SIZE, 1),
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
      error: ReportsError.AnchorNotRecent,
      details: () =>
        "Anchor block 0x0101010101010101010101010101010101010101010101010101010101010101 not found in recent blocks.",
    });
  });

  it("should reject anchor state root not matching", async () => {
    const reports = await newReports({
      services: initialServices(),
    });
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({
          core: 0,
          stateRoot: Bytes.fill(HASH_SIZE, 1),
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
      error: ReportsError.BadStateRoot,
      details: () =>
        "Anchor state root mismatch. Got: 0x0101010101010101010101010101010101010101010101010101010101010101, expected: 0xf6967658df626fa39cbfb6014b50196d23bc2cfbfa71a7591ca7715472dd2b48.",
    });
  });

  it("should reject anchor beefy root not matching", async () => {
    const reports = await newReports({
      services: initialServices(),
    });
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
        report: newWorkReport({
          core: 0,
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
      error: ReportsError.BadBeefyMmrRoot,
      details: () =>
        "Invalid BEEFY super peak hash. Got: 0x9329de635d4bbb8c47cdccbbc1285e48bf9dbad365af44b205343e99dea298f3, expected: 0x0000000000000000000000000000000000000000000000000000000000000000. Anchor: 0xc0564c5e0de0942589df4343ad1956da66797240e2a2f2d6f8116b5047768986",
    });
  });

  it("should reject old lookup anchor", async () => {
    const reports = await newReports({
      services: initialServices(),
    });
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(10),
```

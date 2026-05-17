---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-credentials.test.ts#L204-L260
title: packages/jam/transition/reports/verify-credentials.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 3
content_sha: 8f0de81f974996792d187c104fe59751df01ef07eb137e620794c37c55877f29
language: typescript
---
`packages/jam/transition/reports/verify-credentials.test.ts` (lines 204–260)

```typescript
    const hashes = reports.workReportHashes(guarantees, await Blake2b.createHasher());
    const res = reports.verifyCredentials(input, hashes);

    deepEqual(res, {
      isOk: false,
      isError: true,
      error: ReportsError.ReportEpochBeforeLast,
      details: () => "Report slot is too old. Block 25, Report: 9",
    });
  });

  it("should return signatures for verification", async () => {
    const reports = await newReports();
    const guarantees = guaranteesAsView(tinyChainSpec, [
      ReportGuarantee.create({
        slot: tryAsTimeSlot(20),
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

    const message = BytesBlob.parseBlob(
      "0x6a616d5f67756172616e7465650f8925aab38c879431d70efa7fa0adc2e1868aa1710aa032041b7c13b194ce36",
    );

    const validators = initialValidators();
    deepEqual(res, {
      isOk: true,
      isError: false,
      ok: [
        {
          signature: Bytes.zero(ED25519_SIGNATURE_BYTES).asOpaque(),
          key: validators[0].ed25519,
          message,
        },
        {
          signature: Bytes.zero(ED25519_SIGNATURE_BYTES).asOpaque(),
          key: validators[3].ed25519,
          message,
        },
      ],
    });
  });
});
```

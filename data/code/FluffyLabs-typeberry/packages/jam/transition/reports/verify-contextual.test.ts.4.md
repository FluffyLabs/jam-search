---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/verify-contextual.test.ts#L404-L429
title: packages/jam/transition/reports/verify-contextual.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 4
chunk_total: 5
content_sha: c3d0d1d9566f76a4e15070500d7302ae9b9d23f43031c0c7211c755570ae8555
language: typescript
---
`packages/jam/transition/reports/verify-contextual.test.ts` (lines 404–429)

```typescript
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
});
```

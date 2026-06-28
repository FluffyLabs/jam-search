---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.test.ts#L82-L136
title: packages/jam/transition/disputes/disputes.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: ccc3c6850c41573f48f9498833191aa1b8fd93b5c8ad412eba6a0b517241fb0c
language: typescript
---
`packages/jam/transition/disputes/disputes.test.ts` (lines 82–136)

```typescript
      Bytes.parseBytes("0x11da6d1f761ddf9bdb4c9d6e5303ebd41f61858d0a5647a1a7bfe089bf921be9", HASH_SIZE).asOpaque(),
      0,
    );
    const workReport1 = testData2.workReport(
      Bytes.parseBytes("0xe12c22d4f162d9a012c9319233da5d3e923cc5e1029b8f90e47249c9ab256b35", HASH_SIZE).asOpaque(),
      1,
    );

    const workReportHash0 = blake2b.hashBytes(Encoder.encodeObject(WorkReport.Codec, workReport0, tinyChainSpec));
    assert.strictEqual(`${workReportHash0}`, "0x23dd9ac280cd439a2c04b42cef1f2bbc9abecc7fe6454fecffef59ed110c047d");
    const workReportHash1 = blake2b.hashBytes(Encoder.encodeObject(WorkReport.Codec, workReport1, tinyChainSpec));
    assert.strictEqual(`${workReportHash1}`, "0xf00057ba131e973a662509feb0fe6821bf3728860022b3dd9d5543b5bfa6bf8c");
    const availabilityAssignment1 = AvailabilityAssignment.create({
      workReport: workReport0,
      timeout: tryAsTimeSlot(42),
    });
    const availabilityAssignment2 = AvailabilityAssignment.create({
      workReport: workReport1,
      timeout: tryAsTimeSlot(42),
    });

    const { currentValidatorData, previousValidatorData, verdicts, culprits, faults } = testData2;
    const preStateWithWorkReports: DisputesState = {
      disputesRecords: DisputesRecords.create({
        goodSet: SortedSet.fromArray(hashComparator),
        badSet: SortedSet.fromArray(hashComparator),
        wonkySet: SortedSet.fromArray(hashComparator),
        punishSet: SortedSet.fromArray(hashComparator),
      }),
      timeslot: tryAsTimeSlot(0),
      availabilityAssignment: tryAsPerCore([availabilityAssignment1, availabilityAssignment2], tinyChainSpec),
      currentValidatorData,
      previousValidatorData,
    };

    const disputes = new Disputes(tinyChainSpec, blake2b, preStateWithWorkReports);
    const disputesExtrinsic = DisputesExtrinsic.create({
      verdicts,
      culprits,
      faults,
    });

    const result = await disputes.transition(disputesExtrinsic);
    const stateUpdate = result.isOk ? result.ok.stateUpdate : undefined;

    assert.strictEqual(resultToString(result), "OK: [object Object]");
    assert.notStrictEqual(stateUpdate, undefined);

    if (stateUpdate !== undefined) {
      const clearedAvailabilityAssignment = stateUpdate.availabilityAssignment;
      assert.strictEqual(clearedAvailabilityAssignment[0], null);
      assert.strictEqual(clearedAvailabilityAssignment[1], availabilityAssignment2);
    }
  });
});
```

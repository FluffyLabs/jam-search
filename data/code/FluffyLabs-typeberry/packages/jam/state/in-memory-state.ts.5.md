---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.ts#L506-L602
title: packages/jam/state/in-memory-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 5
chunk_total: 7
content_sha: c18c6bb3919dab628b3456e34f2e418b0284a56c09e6abdab217a359b5ded908
language: typescript
---
`packages/jam/state/in-memory-state.ts` (lines 506–602)

```typescript
        Array.from({ length: spec.validatorsCount }, () =>
          ValidatorData.create({
            bandersnatch: Bytes.zero(BANDERSNATCH_KEY_BYTES).asOpaque(),
            bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
            ed25519: Bytes.zero(ED25519_KEY_BYTES).asOpaque(),
            metadata: Bytes.zero(VALIDATOR_META_BYTES).asOpaque(),
          }),
        ),
        spec,
      ),
      nextValidatorData: tryAsPerValidator(
        Array.from({ length: spec.validatorsCount }, () =>
          ValidatorData.create({
            bandersnatch: Bytes.zero(BANDERSNATCH_KEY_BYTES).asOpaque(),
            bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
            ed25519: Bytes.zero(ED25519_KEY_BYTES).asOpaque(),
            metadata: Bytes.zero(VALIDATOR_META_BYTES).asOpaque(),
          }),
        ),
        spec,
      ),
      currentValidatorData: tryAsPerValidator(
        Array.from({ length: spec.validatorsCount }, () =>
          ValidatorData.create({
            bandersnatch: Bytes.zero(BANDERSNATCH_KEY_BYTES).asOpaque(),
            bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
            ed25519: Bytes.zero(ED25519_KEY_BYTES).asOpaque(),
            metadata: Bytes.zero(VALIDATOR_META_BYTES).asOpaque(),
          }),
        ),
        spec,
      ),
      previousValidatorData: tryAsPerValidator(
        Array.from({ length: spec.validatorsCount }, () =>
          ValidatorData.create({
            bandersnatch: Bytes.zero(BANDERSNATCH_KEY_BYTES).asOpaque(),
            bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
            ed25519: Bytes.zero(ED25519_KEY_BYTES).asOpaque(),
            metadata: Bytes.zero(VALIDATOR_META_BYTES).asOpaque(),
          }),
        ),
        spec,
      ),
      disputesRecords: DisputesRecords.create({
        goodSet: SortedSet.fromSortedArray<WorkReportHash>(hashComparator, []),
        badSet: SortedSet.fromSortedArray<WorkReportHash>(hashComparator, []),
        wonkySet: SortedSet.fromSortedArray<WorkReportHash>(hashComparator, []),
        punishSet: SortedSet.fromSortedArray<Ed25519Key>(hashComparator, []),
      }),
      timeslot: tryAsTimeSlot(0),
      entropy: FixedSizeArray.fill(() => Bytes.zero(HASH_SIZE).asOpaque(), ENTROPY_ENTRIES),
      authPools: tryAsPerCore(
        Array.from({ length: spec.coresCount }, () => asKnownSize([])),
        spec,
      ),
      authQueues: tryAsPerCore(
        Array.from({ length: spec.coresCount }, () =>
          FixedSizeArray.fill((): AuthorizerHash => Bytes.zero(HASH_SIZE).asOpaque(), AUTHORIZATION_QUEUE_SIZE),
        ),
        spec,
      ),
      recentBlocks: RecentBlocks.empty(),
      statistics: StatisticsData.create({
        current: tryAsPerValidator(
          Array.from({ length: spec.validatorsCount }, () => ValidatorStatistics.empty()),
          spec,
        ),
        previous: tryAsPerValidator(
          Array.from({ length: spec.validatorsCount }, () => ValidatorStatistics.empty()),
          spec,
        ),
        cores: tryAsPerCore(
          Array.from({ length: spec.coresCount }, () => CoreStatistics.empty()),
          spec,
        ),
        services: new Map(),
      }),
      accumulationQueue: tryAsPerEpochBlock(
        Array.from({ length: spec.epochLength }, () => []),
        spec,
      ),
      recentlyAccumulated: tryAsPerEpochBlock(
        Array.from({ length: spec.epochLength }, () => HashSet.new()),
        spec,
      ),
      ticketsAccumulator: asKnownSize([]),
      sealingKeySeries: SafroleSealingKeysData.keys(
        tryAsPerEpochBlock(
          Array.from({ length: spec.epochLength }, () => Bytes.zero(BANDERSNATCH_KEY_BYTES).asOpaque()),
          spec,
        ),
      ),
      epochRoot: Bytes.zero(BANDERSNATCH_RING_ROOT_BYTES).asOpaque(),
      privilegedServices: PrivilegedServices.create({
        manager: tryAsServiceId(0),
        assigners: tryAsPerCore(new Array(spec.coresCount).fill(tryAsServiceId(0)), spec),
        delegator: tryAsServiceId(0),
```

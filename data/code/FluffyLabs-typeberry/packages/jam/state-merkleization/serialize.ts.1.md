---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state-merkleization/serialize.ts#L102-L202
title: packages/jam/state-merkleization/serialize.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 0a44d237d1966b4b649662fbb938d3feb22da63b7e59a181e719067c41188c16
language: typescript
---
`packages/jam/state-merkleization/serialize.ts` (lines 102–202)

```typescript
  /** C(8): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b0d023b0d02?v=0.6.7 */
  export const currentValidators: StateCodec<
    State["currentValidatorData"],
    ReturnType<StateView["currentValidatorDataView"]>
  > = {
    key: stateKeys.index(StateKeyIdx.Kappa),
    Codec: validatorsDataCodec,
    extract: (s) => s.currentValidatorData,
  };

  /** C(9): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b1a023b1a02?v=0.6.7 */
  export const previousValidators: StateCodec<
    State["previousValidatorData"],
    ReturnType<StateView["previousValidatorDataView"]>
  > = {
    key: stateKeys.index(StateKeyIdx.Lambda),
    Codec: validatorsDataCodec,
    extract: (s) => s.previousValidatorData,
  };

  /** C(10): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b27023b2702?v=0.6.7 */
  export const availabilityAssignment: StateCodec<
    State["availabilityAssignment"],
    ReturnType<StateView["availabilityAssignmentView"]>
  > = {
    key: stateKeys.index(StateKeyIdx.Rho),
    Codec: availabilityAssignmentsCodec,
    extract: (s) => s.availabilityAssignment,
  };

  /** C(11): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b3e023b3e02?v=0.6.7 */
  export const timeslot: StateCodec<State["timeslot"]> = {
    key: stateKeys.index(StateKeyIdx.Tau),
    Codec: codec.u32.asOpaque<TimeSlot>(),
    extract: (s) => s.timeslot,
  };

  /** C(12): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b4c023b4c02?v=0.6.7 */
  export const privilegedServices: StateCodec<State["privilegedServices"]> = {
    key: stateKeys.index(StateKeyIdx.Chi),
    Codec: PrivilegedServices.Codec,
    extract: (s) => s.privilegedServices,
  };

  /** C(13): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b5e023b5e02?v=0.6.7 */
  export const statistics: StateCodec<StatisticsData, StatisticsDataView> = {
    key: stateKeys.index(StateKeyIdx.Pi),
    Codec: StatisticsData.Codec,
    extract: (s) => s.statistics,
  };

  /** C(14): https://graypaper.fluffylabs.dev/#/1c979cb/3bf0023bf002?v=0.7.1 */
  export const accumulationQueue: StateCodec<
    State["accumulationQueue"],
    ReturnType<StateView["accumulationQueueView"]>
  > = {
    key: stateKeys.index(StateKeyIdx.Omega),
    Codec: accumulationQueueCodec,
    extract: (s) => s.accumulationQueue,
  };

  /** C(15): https://graypaper.fluffylabs.dev/#/7e6ff6a/3b96023b9602?v=0.6.7 */
  export const recentlyAccumulated: StateCodec<
    State["recentlyAccumulated"],
    ReturnType<StateView["recentlyAccumulatedView"]>
  > = {
    key: stateKeys.index(StateKeyIdx.Xi),
    Codec: recentlyAccumulatedCodec,
    extract: (s) => s.recentlyAccumulated,
  };

  /** C(16): https://graypaper.fluffylabs.dev/#/38c4e62/3b46033b4603?v=0.7.0 */
  export const accumulationOutputLog: StateCodec<State["accumulationOutputLog"]> = {
    key: stateKeys.index(StateKeyIdx.Theta),
    Codec: codec.sequenceVarLen(AccumulationOutput.Codec).convert(
      (i) => i.array,
      (o) => SortedArray.fromSortedArray(accumulationOutputComparator, o),
    ),
    extract: (s) => s.accumulationOutputLog,
  };

  /** C(255, s): https://graypaper.fluffylabs.dev/#/ab2cdbd/3b7d033b7d03?v=0.7.2 */
  export const serviceData = (serviceId: ServiceId) => ({
    key: stateKeys.serviceInfo(serviceId),
    Codec: codecWithVersion(ServiceAccountInfo.Codec),
  });

  /** https://graypaper.fluffylabs.dev/#/ab2cdbd/3bac033bac03?v=0.7.2 */
  export const serviceStorage = (blake2b: Blake2b, serviceId: ServiceId, key: StorageKey) => ({
    key: stateKeys.serviceStorage(blake2b, serviceId, key),
    Codec: dumpCodec,
  });

  /** https://graypaper.fluffylabs.dev/#/ab2cdbd/3bc9033bc903?v=0.7.2 */
  export const servicePreimages = (blake2b: Blake2b, serviceId: ServiceId, hash: PreimageHash) => ({
    key: stateKeys.servicePreimage(blake2b, serviceId, hash),
    Codec: dumpCodec,
  });

  /** https://graypaper.fluffylabs.dev/#/ab2cdbd/3bea033b0904?v=0.7.2 */
  export const serviceLookupHistory = (blake2b: Blake2b, serviceId: ServiceId, hash: PreimageHash, len: U32) => ({
```

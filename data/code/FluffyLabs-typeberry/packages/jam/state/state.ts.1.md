---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/state.ts#L94-L220
title: packages/jam/state/state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: cbdf27d481110e42266a60111dc603302dac7e7410bba2281c8067eedc12a7ca
language: typescript
---
`packages/jam/state/state.ts` (lines 94–220)

```typescript
   * https://graypaper.fluffylabs.dev/#/579bd12/091900091900
   */
  readonly disputesRecords: DisputesRecords;

  /**
   * `τ tau`: The current time slot.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/186401186401
   */
  readonly timeslot: TimeSlot;

  /**
   * `η eta`: An on-chain entropy pool is retained in η.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/080c01080d01
   */
  readonly entropy: FixedSizeArray<EntropyHash, ENTROPY_ENTRIES>;

  /**
   * `α alpha`: Authorizers available for each core (authorizer pool).
   *
   * https://graypaper-reader.netlify.app/#/6e1c0cd/102400102400
   */
  readonly authPools: PerCore<AuthorizationPool>;

  /**
   * `φ phi`: A queue of authorizers for each core used to fill up the pool.
   *
   * Only updated by `accumulate` calls using `assign` host call.
   *
   * https://graypaper-reader.netlify.app/#/6e1c0cd/102400102400
   */
  readonly authQueues: PerCore<AuthorizationQueue>;

  /**
   * `β beta`: State of the blocks from recent history.
   *
   * https://graypaper.fluffylabs.dev/#/579bd12/0fb7010fb701
   */
  readonly recentBlocks: RecentBlocks;

  /**
   * `π pi`: Previous and current statistics of each validator,
   *         cores statistics and services statistics.
   *
   * https://graypaper.fluffylabs.dev/#/68eaa1f/18f60118f601?v=0.6.4
   */
  readonly statistics: StatisticsData;

  /**
   * `ϑ theta`: We also maintain knowledge of ready (i.e. available
   * and/or audited) but not-yet-accumulated work-reports in
   * the state item ϑ.
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/165300165500
   */
  readonly accumulationQueue: AccumulationQueue;

  /**
   * `ξ xi`: In order to know which work-packages have been
   * accumulated already, we maintain a history of what has
   * been accumulated. This history, ξ, is sufficiently large
   * for an epoch worth of work-reports.
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/161a00161d00
   */
  readonly recentlyAccumulated: RecentlyAccumulated;

  /*
   * `γₐ gamma_a`: The ticket accumulator - a series of highest-scoring ticket identifiers to be
   *               used for the next epoch.
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0dc3000dc500
   */
  readonly ticketsAccumulator: SafroleData["ticketsAccumulator"];

  /**
   * `γₛ gamma_s`: γs is the current epoch’s slot-sealer series, which is either a full complement
   *                of `E` tickets or, in the case of a fallback mode, a series of `E` Bandersnatch
   *                keys.
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0dc6000dc800
   */
  readonly sealingKeySeries: SafroleData["sealingKeySeries"];

  /**
   * `γ_z gamma_z`: The epoch’s root, a Bandersnatch ring root composed with the one Bandersnatch
   *                key of each of the next epoch’s validators, defined in γ_k.
   *
   * https://graypaper.fluffylabs.dev/#/5f542d7/0da8000db800
   */
  readonly epochRoot: SafroleData["epochRoot"];

  /**
   * `χ chi`: Up to three services may be recognized as privileged. The portion of state in which
   *           this is held is denoted χ and has three service index components together with
   *           a gas limit.
   *
   * https://graypaper.fluffylabs.dev/#/85129da/116f01117201?v=0.6.3
   */
  readonly privilegedServices: PrivilegedServices;

  /**
   * `θ theta`: Sequence of merkle mountain belts from recent accumulations
   *            with service that accumulated them.
   *
   * https://graypaper.fluffylabs.dev/#/7e6ff6a/3bad023bad02?v=0.6.7
   *
   * NOTE Maximum size of this array is unspecified in GP
   */
  readonly accumulationOutputLog: SortedArray<AccumulationOutput>;

  /**
   * Retrieve details about single service.
   */
  getService(id: ServiceId): Service | null;
};

/** Service details. */
export interface Service {
  /** Service id. */
  readonly serviceId: ServiceId;

  /** Retrieve service account info. */
  getInfo(): ServiceAccountInfo;

  /** Read one particular storage item. */
```

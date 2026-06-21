---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.ts#L402-L509
title: packages/jam/state/in-memory-state.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 4
chunk_total: 7
content_sha: 2e23e88efb84f8f0e92f4ba0ba1d08dadacc595a141cee44ea318070c033c06d
language: typescript
---
`packages/jam/state/in-memory-state.ts` (lines 402–509)

```typescript
    if (servicesUpdates === undefined) {
      return Result.ok(OK);
    }
    for (const [serviceId, update] of servicesUpdates.entries()) {
      const { kind, account } = update.action;
      if (kind === UpdateServiceKind.Create) {
        const { lookupHistory } = update.action;
        if (this.services.has(serviceId)) {
          return Result.error(UpdateError.DuplicateService, () => `${serviceId} already exists!`);
        }
        this.services.set(
          serviceId,
          InMemoryService.new(serviceId, {
            info: account,
            preimages: HashDictionary.new(),
            storage: new Map(),
            lookupHistory: HashDictionary.fromEntries(
              lookupHistory === null ? [] : [[lookupHistory.hash, [lookupHistory]]],
            ),
          }),
        );
      } else if (kind === UpdateServiceKind.Update) {
        const existingService = this.services.get(serviceId);
        if (existingService === undefined) {
          return Result.error(UpdateError.NoService, () => `Cannot update ${serviceId} because it does not exist.`);
        }
        existingService.data.info = account;
      } else {
        assertNever(kind);
      }
    }
    return Result.ok(OK);
  }

  availabilityAssignment: PerCore<AvailabilityAssignment | null>;
  designatedValidatorData: PerValidator<ValidatorData>;
  nextValidatorData: PerValidator<ValidatorData>;
  currentValidatorData: PerValidator<ValidatorData>;
  previousValidatorData: PerValidator<ValidatorData>;
  disputesRecords: DisputesRecords;
  timeslot: TimeSlot;
  entropy: FixedSizeArray<EntropyHash, ENTROPY_ENTRIES>;
  authPools: PerCore<AuthorizationPool>;
  authQueues: PerCore<AuthorizationQueue>;
  recentBlocks: RecentBlocks;
  statistics: StatisticsData;
  accumulationQueue: AccumulationQueue;
  recentlyAccumulated: RecentlyAccumulated;
  ticketsAccumulator: KnownSizeArray<Ticket, "0...EpochLength">;
  sealingKeySeries: SafroleSealingKeys;
  epochRoot: BandersnatchRingRoot;
  privilegedServices: PrivilegedServices;
  accumulationOutputLog: SortedArray<AccumulationOutput>;
  services: Map<ServiceId, InMemoryService>;

  recentServiceIds(): readonly ServiceId[] {
    return Array.from(this.services.keys());
  }

  getService(id: ServiceId): Service | null {
    return this.services.get(id) ?? null;
  }

  protected constructor(
    private readonly chainSpec: ChainSpec,
    s: InMemoryStateFields,
  ) {
    super();
    this.availabilityAssignment = s.availabilityAssignment;
    this.designatedValidatorData = s.designatedValidatorData;
    this.nextValidatorData = s.nextValidatorData;
    this.currentValidatorData = s.currentValidatorData;
    this.previousValidatorData = s.previousValidatorData;
    this.disputesRecords = s.disputesRecords;
    this.timeslot = s.timeslot;
    this.entropy = s.entropy;
    this.authPools = s.authPools;
    this.authQueues = s.authQueues;
    this.recentBlocks = s.recentBlocks;
    this.statistics = s.statistics;
    this.accumulationQueue = s.accumulationQueue;
    this.recentlyAccumulated = s.recentlyAccumulated;
    this.ticketsAccumulator = s.ticketsAccumulator;
    this.sealingKeySeries = s.sealingKeySeries;
    this.epochRoot = s.epochRoot;
    this.privilegedServices = s.privilegedServices;
    this.accumulationOutputLog = s.accumulationOutputLog;
    this.services = s.services;
  }

  view(): StateView {
    return InMemoryStateView.new(this.chainSpec, this);
  }

  /**
   * Create an empty and possibly incoherent `InMemoryState`.
   */
  static empty(spec: ChainSpec) {
    return new InMemoryState(spec, {
      availabilityAssignment: tryAsPerCore(
        Array.from({ length: spec.coresCount }, () => null),
        spec,
      ),
      designatedValidatorData: tryAsPerValidator(
        Array.from({ length: spec.validatorsCount }, () =>
          ValidatorData.create({
            bandersnatch: Bytes.zero(BANDERSNATCH_KEY_BYTES).asOpaque(),
            bls: Bytes.zero(BLS_KEY_BYTES).asOpaque(),
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/reports.ts#L114-L213
title: bin/test-runner/w3f/reports.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 3
content_sha: ccecd963be9fe68f761593388f67e512b38641f6838d7845a64e87543a6a8ee8
language: typescript
---
`bin/test-runner/w3f/reports.ts` (lines 114–213)

```typescript
    currentValidatorData: PerValidator<ValidatorData>;
    previousValidatorData: PerValidator<ValidatorData>;
  } {
    return {
      state: InMemoryState.partial(spec, {
        accumulationQueue: tryAsPerEpochBlock(
          FixedSizeArray.fill(() => [], spec.epochLength),
          spec,
        ),
        recentlyAccumulated: tryAsPerEpochBlock(
          FixedSizeArray.fill(() => HashSet.new(), spec.epochLength),
          spec,
        ),
        availabilityAssignment: tryAsPerCore(pre.avail_assignments, spec),
        entropy: FixedSizeArray.new(pre.entropy, ENTROPY_ENTRIES),
        authPools: tryAsPerCore(
          pre.auth_pools.map((x) => asKnownSize(x)),
          spec,
        ),
        recentBlocks: pre.recent_blocks,
        services: new Map(pre.accounts.map((x) => [x.serviceId, x])),
      }),
      offenders: HashSet.from(pre.offenders),
      currentValidatorData: tryAsPerValidator(pre.curr_validators, spec),
      previousValidatorData: tryAsPerValidator(pre.prev_validators, spec),
    };
  }
}

enum ReportsErrorCode {
  BadCoreIndex = "bad_core_index",
  FutureReportSlot = "future_report_slot",
  ReportEpochBeforeLast = "report_epoch_before_last",
  InsufficientGuarantees = "insufficient_guarantees",
  OutOfOrderGuarantee = "out_of_order_guarantee",
  NotSortedOrUniqueGuarantors = "not_sorted_or_unique_guarantors",
  WrongAssignment = "wrong_assignment",
  CoreEngaged = "core_engaged",
  AnchorNotRecent = "anchor_not_recent",
  BadServiceId = "bad_service_id",
  BadCodeHash = "bad_code_hash",
  DependencyMissing = "dependency_missing",
  DuplicatePackage = "duplicate_package",
  BadStateRoot = "bad_state_root",
  BadBeefyMmrRoot = "bad_beefy_mmr_root",
  CoreUnauthorized = "core_unauthorized",
  BadValidatorIndex = "bad_validator_index",
  WorkReportGasTooHigh = "work_report_gas_too_high",
  ServiceItemGasTooLow = "service_item_gas_too_low",
  TooManyDependencies = "too_many_dependencies",
  SegmentRootLookupInvalid = "segment_root_lookup_invalid",
  BadSignature = "bad_signature",
  WorkReportTooBig = "work_report_too_big",
  BannedValidator = "banned_validator",
}

class OutputData {
  static fromJson = json.object<OutputData, TestReportsOutput>(
    {
      reported: json.array(segmentRootLookupItemFromJson),
      reporters: json.array(fromJson.bytes32()),
    },
    ({ reported, reporters }) => ({
      stateUpdate: {},
      reported: HashDictionary.fromEntries(reported.map((x) => [x.workPackageHash, x])),
      reporters,
    }),
  );

  reported!: WorkPackageInfo[];
  reporters!: ReportsOutput["reporters"];
}

type ReportsResult = Result<TestReportsOutput, ReportsError>;

class TestReportsResult {
  static fromJson: FromJson<TestReportsResult> = {
    ok: json.optional(OutputData.fromJson),
    err: json.optional("string"),
  };

  static toReportsResult(test: TestReportsResult): ReportsResult {
    if (test.ok !== undefined) {
      return Result.ok(test.ok);
    }

    if (test.err !== undefined) {
      const map = {
        [ReportsErrorCode.BadCoreIndex]: ReportsError.BadCoreIndex,
        [ReportsErrorCode.FutureReportSlot]: ReportsError.FutureReportSlot,
        [ReportsErrorCode.ReportEpochBeforeLast]: ReportsError.ReportEpochBeforeLast,
        [ReportsErrorCode.InsufficientGuarantees]: ReportsError.InsufficientGuarantees,
        [ReportsErrorCode.OutOfOrderGuarantee]: ReportsError.OutOfOrderGuarantee,
        [ReportsErrorCode.NotSortedOrUniqueGuarantors]: ReportsError.NotSortedOrUniqueGuarantors,
        [ReportsErrorCode.WrongAssignment]: ReportsError.WrongAssignment,
        [ReportsErrorCode.CoreEngaged]: ReportsError.CoreEngaged,
        [ReportsErrorCode.AnchorNotRecent]: ReportsError.AnchorNotRecent,
        [ReportsErrorCode.BadServiceId]: ReportsError.BadServiceId,
        [ReportsErrorCode.BadCodeHash]: ReportsError.BadCodeHash,
        [ReportsErrorCode.DependencyMissing]: ReportsError.DependencyMissing,
```

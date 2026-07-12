---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/reports.ts#L1-L119
title: bin/test-runner/w3f/reports.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 2885e382f608dcb8ca9a08e652bf551fb019ae5a038d8f6503da75ab1cd15d9d
language: typescript
---
`bin/test-runner/w3f/reports.ts` (lines 1–119)

```typescript
import {
  type EntropyHash,
  type HeaderHash,
  type PerValidator,
  type TimeSlot,
  tryAsPerEpochBlock,
  tryAsPerValidator,
} from "@typeberry/block";
import type { GuaranteesExtrinsic } from "@typeberry/block/guarantees.js";
import type { AuthorizerHash, WorkPackageHash, WorkPackageInfo } from "@typeberry/block/refine-context.js";
import { fromJson, guaranteesExtrinsicFromJson, segmentRootLookupItemFromJson } from "@typeberry/block-json";
import { asKnownSize, FixedSizeArray, HashDictionary, HashSet } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import type { Ed25519Key } from "@typeberry/crypto";
import { Blake2b } from "@typeberry/hash";
import { type FromJson, json } from "@typeberry/json-parser";
import {
  type AvailabilityAssignment,
  type CoreStatistics,
  ENTROPY_ENTRIES,
  type InMemoryService,
  InMemoryState,
  type RecentBlocks,
  tryAsPerCore,
  type ValidatorData,
} from "@typeberry/state";
import {
  availabilityAssignmentFromJson,
  JsonCoreStatistics,
  JsonService,
  recentBlocksHistoryFromJson,
  type ServiceStatisticsEntry,
  serviceStatisticsEntryFromJson,
  validatorDataFromJson,
} from "@typeberry/state-json";
import {
  type HeaderChain,
  Reports,
  ReportsError,
  type ReportsInput,
  type ReportsOutput,
  type ReportsState,
} from "@typeberry/transition/reports/index.js";
import { guaranteesAsView } from "@typeberry/transition/reports/test.utils.js";
import { copyAndUpdateState } from "@typeberry/transition/test.utils.js";
import { deepEqual, Result } from "@typeberry/utils";
import type { RunOptions } from "../common.js";

type TestReportsOutput = Omit<ReportsOutput, "stateUpdate">;

class Input {
  static fromJson: FromJson<Input> = {
    guarantees: guaranteesExtrinsicFromJson,
    slot: "number",
    known_packages: json.array(fromJson.bytes32()),
  };

  guarantees!: GuaranteesExtrinsic;
  slot!: TimeSlot;
  known_packages!: WorkPackageHash[];

  static toReportsInput(
    input: Input,
    spec: ChainSpec,
    entropy: ReportsState["entropy"],
    recentBlocksPartialUpdate: ReportsState["recentBlocks"],
    assurancesAvailAssignment: ReportsState["availabilityAssignment"],
    offenders: HashSet<Ed25519Key>,
  ): Omit<ReportsInput, "currentValidatorData" | "previousValidatorData"> {
    const view = guaranteesAsView(spec, input.guarantees, { disableCredentialsRangeCheck: true });

    return {
      guarantees: view,
      slot: input.slot,
      newEntropy: entropy,
      recentBlocksPartialUpdate,
      assurancesAvailAssignment,
      offenders,
    };
  }
}

class TestState {
  static fromJson: FromJson<TestState> = {
    avail_assignments: json.array(json.nullable(availabilityAssignmentFromJson)),
    curr_validators: json.array(validatorDataFromJson),
    prev_validators: json.array(validatorDataFromJson),
    entropy: json.array(fromJson.bytes32()),
    offenders: json.array(fromJson.bytes32<Ed25519Key>()),
    recent_blocks: recentBlocksHistoryFromJson,
    auth_pools: ["array", json.array(fromJson.bytes32())],
    accounts: json.array(JsonService.fromJson),
    cores_statistics: json.array(JsonCoreStatistics.fromJson),
    services_statistics: json.array(serviceStatisticsEntryFromJson),
  };

  avail_assignments!: Array<AvailabilityAssignment | null>;
  curr_validators!: ValidatorData[];
  prev_validators!: ValidatorData[];
  entropy!: EntropyHash[];
  offenders!: Ed25519Key[];
  auth_pools!: AuthorizerHash[][];
  recent_blocks!: RecentBlocks;
  accounts!: InMemoryService[];
  cores_statistics!: CoreStatistics[];
  services_statistics!: ServiceStatisticsEntry[];

  static toReportsState(
    pre: TestState,
    spec: ChainSpec,
  ): {
    state: ReportsState;
    offenders: HashSet<Ed25519Key>;
    currentValidatorData: PerValidator<ValidatorData>;
    previousValidatorData: PerValidator<ValidatorData>;
  } {
    return {
      state: InMemoryState.partial(spec, {
        accumulationQueue: tryAsPerEpochBlock(
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/statistics.ts#L1-L139
title: bin/test-runner/w3f/statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 2
content_sha: 1586a19c47bcebd5b7da54563acdb6f3180a32b8b33d8bb11d7b91c8f81af777
language: typescript
---
`bin/test-runner/w3f/statistics.ts` (lines 1–139)

```typescript
import assert from "node:assert";
import {
  type Extrinsic,
  type TimeSlot,
  tryAsPerValidator,
  tryAsServiceId,
  type ValidatorIndex,
} from "@typeberry/block";
import { getExtrinsicFromJson } from "@typeberry/block-json";
import { bytesBlobComparator } from "@typeberry/bytes";
import { asKnownSize, SortedSet } from "@typeberry/collections";
import { type ChainSpec, fullChainSpec, tinyChainSpec } from "@typeberry/config";
import { type FromJson, json } from "@typeberry/json-parser";
import {
  CoreStatistics,
  InMemoryState,
  ServiceStatistics,
  StatisticsData,
  tryAsPerCore,
  type ValidatorData,
  type ValidatorStatistics,
} from "@typeberry/state";
import { JsonValidatorStatistics, validatorDataFromJson } from "@typeberry/state-json";
import { type Input, Statistics, type StatisticsState } from "@typeberry/transition/statistics.js";
import { OK, Result } from "@typeberry/utils";

type TestInput = Omit<Input, "reporters" | "currentValidatorData">;
class TinyInput {
  static fromJson = json.object<TinyInput, TestInput>(
    {
      slot: "number",
      author_index: "number",
      extrinsic: getExtrinsicFromJson(tinyChainSpec),
    },
    ({ slot, author_index, extrinsic }) => {
      return {
        slot,
        authorIndex: author_index,
        extrinsic,
        incomingReports: [],
        availableReports: [],
        accumulationStatistics: new Map(),
      };
    },
  );

  slot!: TimeSlot;
  author_index!: ValidatorIndex;
  extrinsic!: Extrinsic;
}

class FullInput {
  static fromJson = json.object<FullInput, TestInput>(
    {
      slot: "number",
      author_index: "number",
      extrinsic: getExtrinsicFromJson(fullChainSpec),
    },
    ({ slot, author_index, extrinsic }) => {
      return {
        slot,
        authorIndex: author_index,
        extrinsic,
        incomingReports: [],
        availableReports: [],
        accumulationStatistics: new Map(),
      };
    },
  );

  slot!: TimeSlot;
  author_index!: ValidatorIndex;
  extrinsic!: Extrinsic;
}

class TestState {
  static fromJson: FromJson<TestState> = {
    vals_curr_stats: json.array(JsonValidatorStatistics.fromJson),
    vals_last_stats: json.array(JsonValidatorStatistics.fromJson),
    slot: "number",
    curr_validators: json.array(validatorDataFromJson),
  };

  vals_curr_stats!: ValidatorStatistics[];
  vals_last_stats!: ValidatorStatistics[];
  slot!: TimeSlot;
  curr_validators!: ValidatorData[];

  static toStatisticsState(spec: ChainSpec, state: TestState): StatisticsState {
    return {
      statistics: StatisticsData.create({
        current: tryAsPerValidator(state.vals_curr_stats, spec),
        previous: tryAsPerValidator(state.vals_last_stats, spec),
        cores: tryAsPerCore(
          Array.from({ length: spec.coresCount }, () => CoreStatistics.empty()),
          spec,
        ),
        services: new Map(),
      }),
      timeslot: state.slot,
      currentValidatorData: tryAsPerValidator(state.curr_validators, spec),
    };
  }
}

export class StatisticsTestTiny {
  static fromJson: FromJson<StatisticsTestTiny> = {
    input: TinyInput.fromJson,
    pre_state: TestState.fromJson,
    output: json.fromAny(() => null),
    post_state: TestState.fromJson,
  };
  input!: TestInput;
  pre_state!: TestState;
  output!: null;
  post_state!: TestState;
}

export class StatisticsTestFull {
  static fromJson: FromJson<StatisticsTestFull> = {
    input: FullInput.fromJson,
    pre_state: TestState.fromJson,
    output: json.fromAny(() => null),
    post_state: TestState.fromJson,
  };
  input!: TestInput;
  pre_state!: TestState;
  output!: null;
  post_state!: TestState;
}

export async function runStatisticsTest(
  { input, pre_state, post_state }: StatisticsTestTiny | StatisticsTestFull,
  spec: ChainSpec,
) {
  input.incomingReports = input.extrinsic.guarantees.map((g) => g.report);

  const preState = TestState.toStatisticsState(spec, pre_state);
  const postState = TestState.toStatisticsState(spec, post_state);
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/disputes.ts#L1-L109
title: bin/test-runner/w3f/disputes.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c7646b4c161451de803d72763fdde829147c921a4eac95767d8fcbea028d8f19
language: typescript
---
`bin/test-runner/w3f/disputes.ts` (lines 1–109)

```typescript
import assert from "node:assert";
import { type TimeSlot, tryAsPerValidator } from "@typeberry/block";
import type { DisputesExtrinsic } from "@typeberry/block/disputes.js";
import { disputesExtrinsicFromJson, fromJson } from "@typeberry/block-json";
import type { ChainSpec } from "@typeberry/config";
import type { Ed25519Key } from "@typeberry/crypto";
import { Disputes, type DisputesState } from "@typeberry/disputes";
import type { DisputesErrorCode } from "@typeberry/disputes/disputes-error-code.js";
import { Blake2b } from "@typeberry/hash";
import { type FromJson, json } from "@typeberry/json-parser";
import { type AvailabilityAssignment, type DisputesRecords, tryAsPerCore, type ValidatorData } from "@typeberry/state";
import { availabilityAssignmentFromJson, disputesRecordsFromJson, validatorDataFromJson } from "@typeberry/state-json";
import { copyAndUpdateState } from "@typeberry/transition/test.utils.js";
import type { RunOptions } from "../common.js";

class DisputesOutputMarks {
  static fromJson: FromJson<DisputesOutputMarks> = {
    offenders_mark: json.array(fromJson.bytes32<Ed25519Key>()),
  };

  offenders_mark!: Ed25519Key[];
}

class TestState {
  static fromJson: FromJson<TestState> = {
    psi: disputesRecordsFromJson,
    rho: json.array(json.nullable(availabilityAssignmentFromJson)),
    tau: "number",
    kappa: json.array(validatorDataFromJson),
    lambda: json.array(validatorDataFromJson),
  };

  /** Disputes records. */
  psi!: DisputesRecords;
  /** Availability assignments. */
  rho!: Array<AvailabilityAssignment | null>;
  /** Time slot. */
  tau!: TimeSlot;
  /** Current validator set. */
  kappa!: ValidatorData[];
  /** Previous validator set. */
  lambda!: ValidatorData[];

  static toDisputesState(testState: TestState, spec: ChainSpec): DisputesState {
    const { rho, kappa, lambda } = testState;
    const availabilityAssignment = tryAsPerCore(rho, spec);
    const currentValidatorData = tryAsPerValidator(kappa, spec);
    const previousValidatorData = tryAsPerValidator(lambda, spec);

    return {
      disputesRecords: testState.psi,
      availabilityAssignment,
      timeslot: testState.tau,
      currentValidatorData,
      previousValidatorData,
    };
  }
}

class Input {
  static fromJson: FromJson<Input> = {
    disputes: disputesExtrinsicFromJson,
  };

  disputes!: DisputesExtrinsic;
}

export class Output {
  static fromJson: FromJson<Output> = {
    ok: json.optional(DisputesOutputMarks.fromJson),
    err: json.optional("string"),
  };

  ok?: DisputesOutputMarks;
  err?: DisputesErrorCode;
}

export class DisputesTest {
  static fromJson: FromJson<DisputesTest> = {
    input: Input.fromJson,
    pre_state: TestState.fromJson,
    output: Output.fromJson,
    post_state: TestState.fromJson,
  };
  input!: Input;
  pre_state!: TestState;
  output!: Output;
  post_state!: TestState;
}

export async function runDisputesTest(testContent: DisputesTest, { chainSpec }: RunOptions) {
  const preState = testContent.pre_state;

  const disputes = new Disputes(
    chainSpec,
    await Blake2b.createHasher(),
    TestState.toDisputesState(preState, chainSpec),
  );

  const result = await disputes.transition(testContent.input.disputes);
  const error = result.isError ? result.error : undefined;
  const ok = result.isOk ? Array.from(result.ok.offendersMark) : undefined;
  const stateUpdate = result.isOk ? result.ok.stateUpdate : undefined;

  assert.deepEqual(error, testContent.output.err);
  assert.deepEqual(ok, testContent.output.ok?.offenders_mark);
  const newState = stateUpdate === undefined ? disputes.state : copyAndUpdateState(disputes.state, stateUpdate);
  assert.deepEqual(newState, TestState.toDisputesState(testContent.post_state, chainSpec));
}
```

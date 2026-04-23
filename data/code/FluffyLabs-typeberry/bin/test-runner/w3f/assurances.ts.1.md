---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/assurances.ts#L108-L199
title: bin/test-runner/w3f/assurances.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: c3262a9c26c1a942743a84a9560a4cd5d3fdd1099595f859e679331eba6dbc84
language: typescript
---
`bin/test-runner/w3f/assurances.ts` (lines 108–199)

```typescript
          return Result.error(AssurancesError.NoReportPending, () => "No report pending: core not engaged");
        case AssurancesErrorCode.BAD_SIGNATURE:
          return Result.error(AssurancesError.InvalidSignature, () => "Invalid signature");
        case AssurancesErrorCode.NOT_SORTED_OR_UNIQUE_ASSURERS:
          return Result.error(AssurancesError.InvalidOrder, () => "Invalid order: assurers not sorted or unique");
        default:
          throw new Error(`Unhandled output error: ${out.err}`);
      }
    }

    throw new Error("Invalid output.");
  }
}

export class AssurancesTestTiny {
  static fromJson: FromJson<AssurancesTestTiny> = {
    input: inputFromJson(tinyChainSpec),
    pre_state: TestState.fromJson,
    output: Output.fromJson,
    post_state: TestState.fromJson,
  };
  input!: Input;
  pre_state!: TestState;
  output!: Output;
  post_state!: TestState;
}

export class AssurancesTestFull {
  static fromJson: FromJson<AssurancesTestFull> = {
    input: inputFromJson(fullChainSpec),
    pre_state: TestState.fromJson,
    output: Output.fromJson,
    post_state: TestState.fromJson,
  };
  input!: Input;
  pre_state!: TestState;
  output!: Output;
  post_state!: TestState;
}

export async function runAssurancesTestTiny(testContent: AssurancesTestTiny, options: RunOptions) {
  const spec = options.chainSpec;
  const preState = TestState.toAssurancesState(testContent.pre_state, spec);
  const postState = TestState.toAssurancesState(testContent.post_state, spec);
  const input = Input.toAssurancesInput(testContent.input, spec, preState.availabilityAssignment);
  const expectedResult = Output.toAssurancesTransitionResult(testContent.output);

  await runAssurancesTest(options, preState, postState, input, expectedResult);
}

export async function runAssurancesTestFull(testContent: AssurancesTestFull, options: RunOptions) {
  const spec = options.chainSpec;
  const preState = TestState.toAssurancesState(testContent.pre_state, spec);
  const postState = TestState.toAssurancesState(testContent.post_state, spec);
  const input = Input.toAssurancesInput(testContent.input, spec, preState.availabilityAssignment);
  const expectedResult = Output.toAssurancesTransitionResult(testContent.output);

  await runAssurancesTest(options, preState, postState, input, expectedResult);
}

async function runAssurancesTest(
  { chainSpec: spec, path }: RunOptions,
  preState: AssurancesState,
  postState: AssurancesState,
  input: AssurancesInput,
  expectedResult: Result<WorkReport[], AssurancesError>,
) {
  const assurances = new Assurances(spec, preState, await blake2b);
  const res = await assurances.transition(input);

  // validators are in incorrect order as well so it depends which error is checked first
  if (path.includes("assurances_with_bad_validator_index-1")) {
    if (!expectedResult.isError) {
      throw new Error(`Expected success in ${path}?`);
    }
    assert.strictEqual(expectedResult.error, AssurancesError.InvalidValidatorIndex);
    expectedResult.error = AssurancesError.InvalidOrder;
  }

  if (res.isError) {
    deepEqual(res, expectedResult, {
      context: "output",
      ignore: ["output.details"],
    });
    deepEqual(assurances.state, postState, { context: "state" });
  } else {
    const { availableReports, stateUpdate } = res.ok;
    const result = copyAndUpdateState(preState, stateUpdate);
    deepEqual(Result.ok(availableReports), expectedResult);
    deepEqual(result, postState, { context: "state" });
  }
}
```

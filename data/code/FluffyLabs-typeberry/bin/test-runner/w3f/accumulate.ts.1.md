---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/accumulate.ts#L121-L171
title: bin/test-runner/w3f/accumulate.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: 873d5b0536a8c2427ca877bc4f6a9fa6d8521f6d7098ac48fbaf5dfb7ba8f059
language: typescript
---
`bin/test-runner/w3f/accumulate.ts` (lines 121–171)

```typescript
  ok!: AccumulateRoot;

  static toAccumulateOutput(output: Output): Result<AccumulateRoot, never> {
    return Result.ok(output.ok);
  }
}

export class AccumulateTest {
  static fromJson: FromJson<AccumulateTest> = {
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

export async function runAccumulateTest(
  test: AccumulateTest,
  { chainSpec, accumulateSequentially }: RunOptions,
  variant: "ananas" | "builtin",
) {
  const pvm = variant === "ananas" ? PvmBackend.Ananas : PvmBackend.BuiltIn;
  const options = { pvm, accumulateSequentially };
  /**
   * entropy has to be moved to input because state is incompatibile -
   * in test state we have: `entropy: EntropyHash;`
   * in typeberry state we have: `entropy: FixedSizeArray<EntropyHash, ENTROPY_ENTRIES>;`
   * The accumulation doesn't modify entropy so we can remove it safely from pre/post state
   */
  const entropy = test.pre_state.entropy;

  const post_state = TestState.toAccumulateState(test.post_state, chainSpec);
  const state = TestState.toAccumulateState(test.pre_state, chainSpec);
  const accumulate = new Accumulate(chainSpec, await Blake2b.createHasher(), state, options);
  const accumulateOutput = new AccumulateOutput();
  const result = await accumulate.transition({ ...test.input, entropy });
  if (result.isError) {
    assert.fail(`Expected successfull accumulation for ${PvmBackendNames[pvm]}, got: ${result}`);
  }
  const accumulateRoot = await accumulateOutput.transition({
    accumulationOutputLog: result.ok.accumulationOutputLog,
  });
  state.applyUpdate(result.ok.stateUpdate);
  deepEqual(state, post_state);
  deepEqual(accumulateRoot, test.output.ok);
}
```

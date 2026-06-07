---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/reports.ts#L211-L291
title: bin/test-runner/w3f/reports.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 0925b3cf9d5a5cba337abc268d9dac36a49c05afbb2215f129cc44ee2cec45a7
language: typescript
---
`bin/test-runner/w3f/reports.ts` (lines 211–291)

```typescript
        [ReportsErrorCode.BadServiceId]: ReportsError.BadServiceId,
        [ReportsErrorCode.BadCodeHash]: ReportsError.BadCodeHash,
        [ReportsErrorCode.DependencyMissing]: ReportsError.DependencyMissing,
        [ReportsErrorCode.DuplicatePackage]: ReportsError.DuplicatePackage,
        [ReportsErrorCode.BadStateRoot]: ReportsError.BadStateRoot,
        [ReportsErrorCode.BadBeefyMmrRoot]: ReportsError.BadBeefyMmrRoot,
        [ReportsErrorCode.CoreUnauthorized]: ReportsError.CoreUnauthorized,
        [ReportsErrorCode.BadValidatorIndex]: ReportsError.BadValidatorIndex,
        [ReportsErrorCode.WorkReportGasTooHigh]: ReportsError.WorkReportGasTooHigh,
        [ReportsErrorCode.ServiceItemGasTooLow]: ReportsError.ServiceItemGasTooLow,
        [ReportsErrorCode.TooManyDependencies]: ReportsError.TooManyDependencies,
        [ReportsErrorCode.SegmentRootLookupInvalid]: ReportsError.SegmentRootLookupInvalid,
        [ReportsErrorCode.BadSignature]: ReportsError.BadSignature,
        [ReportsErrorCode.WorkReportTooBig]: ReportsError.WorkReportTooBig,
        [ReportsErrorCode.BannedValidator]: ReportsError.BannedValidator,
      };

      if (map[test.err] !== undefined) {
        return Result.error(map[test.err], () => `Reports validation failed: ${test.err}`);
      }
      throw new Error(`Unknown expected reports error code: "${test.err}"`);
    }

    throw new Error('Neither "ok" nor "err" is defined in output.');
  }

  ok?: TestReportsOutput;
  err?: ReportsErrorCode;
}

export class ReportsTest {
  static fromJson: FromJson<ReportsTest> = {
    input: Input.fromJson,
    pre_state: TestState.fromJson,
    output: TestReportsResult.fromJson,
    post_state: TestState.fromJson,
  };
  input!: Input;
  pre_state!: TestState;
  output!: TestReportsResult;
  post_state!: TestState;
}

export async function runReportsTest(testContent: ReportsTest, { chainSpec: spec }: RunOptions) {
  const preState = TestState.toReportsState(testContent.pre_state, spec);
  const postState = TestState.toReportsState(testContent.post_state, spec);
  const input = Input.toReportsInput(
    testContent.input,
    spec,
    preState.state.entropy,
    preState.state.recentBlocks, // note: for full fidelity this should be partially updated state, not prior state as it is now
    preState.state.availabilityAssignment,
    preState.offenders,
  );
  const expectedOutput = TestReportsResult.toReportsResult(testContent.output);

  // Seems like we don't have any additional source of information
  // for which lookup headers are in chain, so we just use the recent
  // blocks history.
  // NOTE: this is done internally by reports checking.
  const headerChain: HeaderChain = {
    isAncestor(_pastSlot: TimeSlot, _pastHash: HeaderHash, _currentHash: HeaderHash) {
      return false;
    },
  };

  const reports = new Reports(spec, await Blake2b.createHasher(), preState.state, headerChain);

  const output = await reports.transition({
    ...input,
    currentValidatorData: preState.currentValidatorData,
    previousValidatorData: preState.previousValidatorData,
  });
  let state = reports.state;
  if (output.isOk) {
    state = copyAndUpdateState(state, output.ok.stateUpdate);
  }

  deepEqual(output, expectedOutput, { context: "output", ignore: ["output.details", "output.ok.stateUpdate"] });
  deepEqual(state, postState.state, { context: "postState" });
}
```

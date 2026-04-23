---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f/statistics.ts#L136-L175
title: bin/test-runner/w3f/statistics.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: ee5ef9ce25929e58ec4013e16afabc41fe36554e054035ed745a0225e15c2235
language: typescript
---
`bin/test-runner/w3f/statistics.ts` (lines 136–175)

```typescript
  input.incomingReports = input.extrinsic.guarantees.map((g) => g.report);

  const preState = TestState.toStatisticsState(spec, pre_state);
  const postState = TestState.toStatisticsState(spec, post_state);
  const statistics = new Statistics(spec, preState);
  assert.deepStrictEqual(statistics.state, preState);

  const reporters = SortedSet.fromArray(
    bytesBlobComparator,
    input.extrinsic.guarantees
      .flatMap((g) => g.credentials)
      .map((c) => preState.currentValidatorData[c.validatorIndex].ed25519),
  ).array;
  // when
  const update = statistics.transition({
    ...input,
    currentValidatorData: preState.currentValidatorData,
    reporters: asKnownSize(reporters),
  });
  const state = InMemoryState.partial(spec, preState);
  assert.deepEqual(state.applyUpdate(update), Result.ok(OK));

  // NOTE [MaSo] This is a workaround for the fact that the test data does not contain any posterior service statistics.
  assert.deepStrictEqual(postState.statistics.services.size, 0, "We expect services are not calculated.");
  if (state.statistics.services.size > 0) {
    const serviceStatistics = state.statistics.services.get(tryAsServiceId(0)) ?? ServiceStatistics.empty();
    postState.statistics.services.set(tryAsServiceId(0), serviceStatistics);
  }

  // then
  assert.deepStrictEqual(state, InMemoryState.partial(spec, postState));
}

export async function runStatisticsTestTiny(test: StatisticsTestTiny) {
  await runStatisticsTest(test, tinyChainSpec);
}

export async function runStatisticsTestFull(test: StatisticsTestFull) {
  await runStatisticsTest(test, fullChainSpec);
}
```

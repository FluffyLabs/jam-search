---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/in-core.test.ts#L97-L150
title: packages/jam/in-core/in-core.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 2
content_sha: c13d3b5f264f0f8acc704e90c7bf56dfdf3aaf6d428dec6b37319dee0db363ab
language: typescript
---
`packages/jam/in-core/in-core.test.ts` (lines 97–150)

```typescript
  return WithHash.new(workPackageHash, workPackage);
}

describe("InCore", () => {
  it("should return StateMissing error when anchor block state is not in DB", async () => {
    const spec = tinyChainSpec;
    const states = InMemoryStates.new(spec);
    const inCore = InCore.new(spec, states, PvmBackend.BuiltIn, blake2b);

    const anchorHash = Bytes.fill(HASH_SIZE, 1).asOpaque<HeaderHash>();
    const stateRoot = Bytes.zero(HASH_SIZE).asOpaque<StateRootHash>();
    const authCodeHash = getAuthCodeHash();
    const workPackage = createWorkPackage(anchorHash, stateRoot, authCodeHash);

    const result = await inCore.refine(
      hashWorkPackage(spec, workPackage),
      tryAsCoreIndex(0),
      asKnownSize([[]]),
      asKnownSize([[]]),
    );

    assert.strictEqual(result.isError, true);
    assert.strictEqual(result.error, RefineError.StateMissing);
  });

  it("should refine work package and produce a report when state is set up", async () => {
    const spec = tinyChainSpec;
    const states = InMemoryStates.new(spec);
    const inCore = InCore.new(spec, states, PvmBackend.BuiltIn, blake2b);

    const authCodeHash = getAuthCodeHash();
    const anchorHash = Bytes.fill(HASH_SIZE, 1).asOpaque<HeaderHash>();
    const state = InMemoryState.partial(spec, {
      timeslot: tryAsTimeSlot(16),
      services: new Map([[AUTH_SERVICE_ID, createService(AUTH_SERVICE_ID, authCodeHash, AUTHORIZER_PVM)]]),
    });
    await states.insertInitialState(anchorHash, state);

    const correctStateRoot = await states.getStateRoot(state);
    const workPackage = createWorkPackage(anchorHash, correctStateRoot, authCodeHash, state.timeslot);

    const result = await inCore.refine(
      hashWorkPackage(spec, workPackage),
      tryAsCoreIndex(0),
      asKnownSize([[]]),
      asKnownSize([[]]),
    );

    assert.strictEqual(result.isOk, true, `Expected OK but got error: ${result.isError ? result.details() : ""}`);
    assert.strictEqual(result.ok.report.coreIndex, 0);
    assert.strictEqual(result.ok.report.results.length, 1);
    assert.deepStrictEqual(result.ok.report.workPackageSpec.exportsRoot.raw, Bytes.zero(HASH_SIZE).raw);
  });
});
```

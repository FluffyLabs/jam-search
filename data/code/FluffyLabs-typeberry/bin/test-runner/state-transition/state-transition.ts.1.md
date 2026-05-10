---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/state-transition/state-transition.ts#L93-L136
title: bin/test-runner/state-transition/state-transition.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: 8244b0a8bfedf13d7ec651349793c1f846811e2d5bed470bb9737075c8deada3
language: typescript
---
`bin/test-runner/state-transition/state-transition.ts` (lines 93–136)

```typescript
  // verify that we compute the state root exactly the same.
  assert.deepStrictEqual(testContent.pre_state.state_root.toString(), preStateRoot.toString());
  assert.deepStrictEqual(testContent.post_state.state_root.toString(), postStateRoot.toString());

  const shouldBlockBeRejected = testContent.pre_state.state_root.isEqualTo(testContent.post_state.state_root);

  const verifier = BlockVerifier.new(stf.hasher, blocksDb);
  // NOTE [ToDr] we skip full verification here, since we can run tests in isolation
  // (i.e. no block history)
  const verificationResult = await verifier.verifyBlock(blockView, { skipParentAndStateRoot: true });
  if (verificationResult.isError) {
    assert.ok(shouldBlockBeRejected, `Block verification error: ${resultToString(verificationResult)}`);
    return;
  }

  const headerHash = verificationResult.ok;
  // now perform the state transition
  const stfResult = await stf.transition(blockView, headerHash);
  if (shouldBlockBeRejected) {
    assert.strictEqual(stfResult.isOk, false, "The block should be rejected, yet we imported it.");
    // there should be no changes.
    const root = preState.backend.getRootHash(blake2b);
    deepEqual(preState, postState);
    assert.deepStrictEqual(root.toString(), postStateRoot.toString());
    return;
  }

  if (stfResult.isError) {
    assert.fail(`Expected the transition to go smoothly, got error: ${resultToString(stfResult)}`);
  }

  preState.backend.applyUpdate(serializeStateUpdate(spec, blake2b, stfResult.ok));

  // some conformance test vectors have an empty state, we run them, yet do not perform any assertions.
  if (testContent.post_state.keyvals.length === 0) {
    options.test.skip(`Successfuly run a test vector with empty post state!. Please verify: ${options.path}`);
    return;
  }

  // if the stf was successful compare the resulting state and the root (redundant, but double checking).
  const root = preState.backend.getRootHash(blake2b);
  deepEqual(preState, postState);
  assert.deepStrictEqual(root.toString(), postStateRoot.toString());
}
```

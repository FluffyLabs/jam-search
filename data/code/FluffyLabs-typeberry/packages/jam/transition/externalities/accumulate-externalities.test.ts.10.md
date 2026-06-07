---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L1149-L1258
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 10
chunk_total: 26
content_sha: 5722f9aa51204db76deff4df5231493b54fe912ef09e4a123736965b42fdf502
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 1149–1258)

```typescript
    // put something into updated state
    const status = partialState.requestPreimage(preimageHash, tryAsU64(5));
    assert.deepStrictEqual(status, Result.ok(OK));

    // when
    partialState.checkpoint();

    // then
    assert.deepStrictEqual(partialState.getStateUpdates()[1], state.stateUpdate);
  });
});

describe("PartialState.upgradeService", () => {
  it("should update the service with new code hash and gas limits", () => {
    const state = partiallyUpdatedState();
    const maybeService = state.state.services.get(tryAsServiceId(0));
    if (maybeService === undefined) {
      throw new Error("Invalid service!");
    }
    const service = maybeService;

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const codeHash = Bytes.fill(HASH_SIZE, 0xcd).asOpaque();
    const gas = tryAsU64(1_000n);
    const allowance = tryAsU64(2_000n);

    // when
    partialState.upgradeService(codeHash, gas, allowance);

    // then
    assert.deepStrictEqual(
      state.stateUpdate.services.updated,
      new Map([
        [
          tryAsServiceId(0),
          UpdateService.update({
            serviceInfo: ServiceAccountInfo.create({
              ...service.getInfo(),
              codeHash,
              accumulateMinGas: tryAsServiceGas(gas),
              onTransferMinGas: tryAsServiceGas(allowance),
            }),
          }),
        ],
      ]),
    );
  });
});

describe("PartialState.updateAuthorizationQueue", () => {
  it("should update the authorization queue and transfer the assigner for the given core", () => {
    const state = partiallyUpdatedState();
    const initialPrivileged = state.state.privilegedServices;
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const coreIndex = tryAsCoreIndex(0);
    const newAssigner = tryAsServiceId(99);
    const queue = FixedSizeArray.new(
      Array.from({ length: AUTHORIZATION_QUEUE_SIZE }, () => Bytes.fill(HASH_SIZE, 0xee).asOpaque()),
      AUTHORIZATION_QUEUE_SIZE,
    );

    // when
    const result = partialState.updateAuthorizationQueue(coreIndex, queue, newAssigner);

    // then
    deepEqual(result, Result.ok(OK));
    assert.deepStrictEqual(state.stateUpdate.authorizationQueues.get(coreIndex), queue);

    // the privilegedServices update must be written, with only the targeted
    // core's assigner transferred; all other fields must be preserved.
    const updated = state.stateUpdate.privilegedServices;
    assert.ok(updated !== null, "stateUpdate.privilegedServices should be written");
    assert.strictEqual(updated.assigners[0], newAssigner);
    assert.strictEqual(updated.assigners[1], initialPrivileged.assigners[1]);
    assert.strictEqual(updated.manager, initialPrivileged.manager);
    assert.strictEqual(updated.delegator, initialPrivileged.delegator);
    assert.strictEqual(updated.registrar, initialPrivileged.registrar);
    assert.strictEqual(updated.autoAccumulateServices, initialPrivileged.autoAccumulateServices);
  });

  it("should return InvalidServiceId when given auth manager is invalid", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const coreIndex = tryAsCoreIndex(0);
    const assigners: ServiceId | null = null;
    const queue = FixedSizeArray.new(
```

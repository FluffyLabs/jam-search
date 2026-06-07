---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L1784-L1924
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 16
chunk_total: 26
content_sha: 628017d8cbef3d0b8c7ea14401c40d203f427f36916782a8e1a462591872d0fa
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 1784–1924)

```typescript
      // we need to replace the existing service
      state.state.services.set(
        service.serviceId,
        InMemoryService.new(service.serviceId, {
          ...service.data,
          preimages,
          lookupHistory,
        }),
      );
    }

    const secondService = InMemoryService.new(tryAsServiceId(1), {
      info: ServiceAccountInfo.create({
        ...service.data.info,
        onTransferMinGas: tryAsServiceGas(1000),
      }),
      preimages: self ? HashDictionary.new() : preimages,
      lookupHistory: self ? HashDictionary.new() : lookupHistory,
      storage: new Map(),
    });
    state.state.services.set(secondService.serviceId, secondService);

    return {
      state,
      preimage,
    };
  };

  it("should provide a preimage for other service", () => {
    const { state, preimage } = partiallyUpdatedStateWithSecondService({
      self: false,
      requested: true,
    });

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const serviceId = tryAsServiceId(1);
    assert.deepStrictEqual(state.stateUpdate.services.preimages.size, 0);

    // when
    const result = partialState.providePreimage(serviceId, preimage.blob);

    // then
    assert.deepStrictEqual(result, Result.ok(OK));
    assert.deepStrictEqual(
      state.stateUpdate.services.preimages,
      new Map([
        [
          tryAsServiceId(0),

          [
            UpdatePreimage.provide({
              preimage: PreimageItem.create({
                hash: preimage.hash,
                blob: preimage.blob,
              }),
              slot: state.state.timeslot,
              providedFor: serviceId,
            }),
          ],
        ],
        [
          tryAsServiceId(1),
          [
            UpdatePreimage.provide({
              preimage: PreimageItem.create({
                hash: preimage.hash,
                blob: preimage.blob,
              }),
              slot: state.state.timeslot,
              providedFor: serviceId,
            }),
          ],
        ],
      ]),
    );
  });

  it("should provide a preimage for itself", () => {
    const { state, preimage } = partiallyUpdatedStateWithSecondService({ self: true, requested: true });

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const serviceId = tryAsServiceId(0);
    assert.deepStrictEqual(state.stateUpdate.services.preimages.size, 0);

    // when
    const result = partialState.providePreimage(serviceId, preimage.blob);

    // then
    assert.deepStrictEqual(result, Result.ok(OK));
    assert.deepStrictEqual(
      state.stateUpdate.services.preimages,
      new Map([
        [
          tryAsServiceId(0),
          [
            UpdatePreimage.provide({
              preimage: PreimageItem.create({
                hash: preimage.hash,
                blob: preimage.blob,
              }),
              slot: state.state.timeslot,
              providedFor: tryAsServiceId(0),
            }),
          ],
        ],
      ]),
    );
  });

  it("should return error if preimage was not requested", () => {
    const { state, preimage } = partiallyUpdatedStateWithSecondService({
      self: false,
      requested: false,
    });

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const serviceId = tryAsServiceId(1);
```

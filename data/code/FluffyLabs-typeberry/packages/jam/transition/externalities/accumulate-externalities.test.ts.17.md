---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L1918-L2047
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 17
chunk_total: 26
content_sha: 01b99340fa9a6518ac8a57cda9f05ca3018314edf22346059744a6c3adc51aba
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 1918–2047)

```typescript
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
    deepEqual(
      result,
      Result.error(
        ProvidePreimageError.WasNotRequested,
        () =>
          "Preimage was not requested: hash=0xe58b8e8cb80789549d264af831d0433975a8415b794e3622f2415127caa2aa25, service=1",
      ),
    );
    assert.deepStrictEqual(state.stateUpdate.services.preimages.size, 0);
  });

  it("should return error if preimage is requested and already available for other service", () => {
    const { state, preimage } = partiallyUpdatedStateWithSecondService({
      self: false,
      requested: true,
      available: true,
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
    const updates = state.stateUpdate.services.preimages.get(serviceId) ?? [];
    updates.push(
      UpdatePreimage.provide({
        preimage: PreimageItem.create({
          hash: preimage.hash,
          blob: preimage.blob,
        }),
        slot: state.state.timeslot,
        providedFor: serviceId,
      }),
    );
    state.stateUpdate.services.preimages.set(serviceId, updates);

    // when
    const result = partialState.providePreimage(serviceId, preimage.blob);

    // then
    deepEqual(
      result,
      Result.error(
        ProvidePreimageError.WasNotRequested,
        () =>
          "Preimage was not requested: hash=0xe58b8e8cb80789549d264af831d0433975a8415b794e3622f2415127caa2aa25, service=1",
      ),
    );
    assert.deepStrictEqual(
      state.stateUpdate.services.preimages,
      new Map([
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

  it("should return error if preimage is requested and already provided for self", () => {
    const { state, preimage } = partiallyUpdatedStateWithSecondService({
      self: true,
      requested: true,
      available: true,
    });

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    const serviceId = tryAsServiceId(0);

    // when
    const result = partialState.providePreimage(serviceId, preimage.blob);

    // then
    deepEqual(
      result,
      Result.error(
        ProvidePreimageError.AlreadyProvided,
        () =>
          "Preimage already provided: hash=0xe58b8e8cb80789549d264af831d0433975a8415b794e3622f2415127caa2aa25, service=0",
      ),
    );
    assert.deepStrictEqual(state.stateUpdate.services.preimages, new Map());
  });

  it("should return ok and then error if preimage is provided twice for self", () => {
    const { state, preimage } = partiallyUpdatedStateWithSecondService({
      self: true,
      requested: true,
      available: false,
    });

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
```

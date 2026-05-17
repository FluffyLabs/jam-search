---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L2042-L2178
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 18
chunk_total: 26
content_sha: 022dac130940c661d2bb7d632d7f000841e1d046367890764675da2982ad5652
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 2042–2178)

```typescript
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });

    const serviceId = tryAsServiceId(0);
    assert.deepStrictEqual(state.stateUpdate.services.preimages, new Map());

    // when
    const resultok = partialState.providePreimage(serviceId, preimage.blob);
    const resulterr = partialState.providePreimage(serviceId, preimage.blob);

    // then
    assert.deepStrictEqual(resultok, Result.ok(OK));
    deepEqual(
      resulterr,
      Result.error(
        ProvidePreimageError.WasNotRequested,
        () =>
          "Preimage was not requested: hash=0xe58b8e8cb80789549d264af831d0433975a8415b794e3622f2415127caa2aa25, service=0",
      ),
    );
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
      ]),
    );
  });

  it("should return ok and then error if preimage is provided twice for other", () => {
    const { state, preimage } = partiallyUpdatedStateWithSecondService({
      self: false,
      requested: true,
      available: false,
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
    assert.deepStrictEqual(state.stateUpdate.services.preimages, new Map());

    // when
    const resultok = partialState.providePreimage(serviceId, preimage.blob);
    const resulterr = partialState.providePreimage(serviceId, preimage.blob);

    // then
    assert.deepStrictEqual(resultok, Result.ok(OK));
    deepEqual(
      resulterr,
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
          serviceId,
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
});

describe("PartialState.eject", () => {
  function setupEjectableService(
    stateUpdate: InMemoryState,
    overrides: {
      codeHash?: CodeHash;
      storageUtilisationCount?: U32;
      storageUtilisationBytes?: U64;
      tombstone?: {
        hash: PreimageHash;
        length: U32;
        slots: LookupHistorySlots;
      };
    } = {},
  ): ServiceId {
    const destinationId = tryAsServiceId(1);

    const baseService = stateUpdate.services.get(tryAsServiceId(0));
    if (baseService === undefined) {
      throw new Error("Missing required service!");
    }
    const codeHash =
      overrides.codeHash ??
      (() => {
        const expected = Bytes.zero(HASH_SIZE).asOpaque<CodeHash>();
```

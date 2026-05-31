---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L119-L241
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 26
content_sha: b888f788616ae2a5706c6136c0a4ca69d7c74ac36dc5e2a488c309ef2d6281a0
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 119–241)

```typescript
      status: PreimageStatusKind.Requested,
    });
  });
});

describe("PartialState.requestPreimage", () => {
  it("should request a preimage and update service info", () => {
    const state = partiallyUpdatedState();
    const serviceId = tryAsServiceId(0);
    const maybeService = state.state.services.get(serviceId);
    if (maybeService === undefined) {
      throw new Error("Invalid service!");
    }
    const service = maybeService;

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: serviceId,
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    const preimageHash = Bytes.fill(HASH_SIZE, 0xa).asOpaque();

    const status = partialState.requestPreimage(preimageHash, tryAsU64(5));
    assert.deepStrictEqual(status, Result.ok(OK));

    assert.deepStrictEqual(
      state.stateUpdate.services.preimages,
      new Map([
        [
          serviceId,
          [
            UpdatePreimage.updateOrAdd({
              lookupHistory: LookupHistoryItem.new(preimageHash, tryAsU32(5), tryAsLookupHistorySlots([])),
            }),
          ],
        ],
      ]),
    );
    assert.deepStrictEqual(
      state.stateUpdate.services.updated,
      new Map([
        [
          serviceId,
          UpdateService.update({
            serviceInfo: ServiceAccountInfo.create({
              ...service.getInfo(),
              storageUtilisationBytes: tryAsU64(service.getInfo().storageUtilisationBytes + 5n + 81n),
              storageUtilisationCount: tryAsU32(service.getInfo().storageUtilisationCount + 2),
            }),
          }),
        ],
      ]),
    );
  });

  it("should request a preimage and update service info", () => {
    const state = partiallyUpdatedState();
    const serviceId = tryAsServiceId(0);
    const maybeService = state.state.services.get(serviceId);
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
    const preimageHash = Bytes.fill(HASH_SIZE, 0xa).asOpaque();

    const status = partialState.requestPreimage(preimageHash, tryAsU64(5));
    assert.deepStrictEqual(status, Result.ok(OK));

    assert.deepStrictEqual(
      state.stateUpdate.services.preimages,
      new Map([
        [
          serviceId,
          [
            UpdatePreimage.updateOrAdd({
              lookupHistory: LookupHistoryItem.new(preimageHash, tryAsU32(5), tryAsLookupHistorySlots([])),
            }),
          ],
        ],
      ]),
    );
    assert.deepStrictEqual(
      state.stateUpdate.services.updated,
      new Map([
        [
          serviceId,
          UpdateService.update({
            serviceInfo: ServiceAccountInfo.create({
              ...service.getInfo(),
              storageUtilisationBytes: tryAsU64(service.getInfo().storageUtilisationBytes + 5n + 81n),
              storageUtilisationCount: tryAsU32(service.getInfo().storageUtilisationCount + 2),
            }),
          }),
        ],
      ]),
    );
  });

  it("should fail if preimage is already requested", () => {
    const state = partiallyUpdatedState();
    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(16),
    });
    const preimageHash = Bytes.fill(HASH_SIZE, 0xa).asOpaque();

    const status = partialState.requestPreimage(preimageHash, tryAsU64(5));
```

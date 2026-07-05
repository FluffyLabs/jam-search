---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L2517-L2635
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 22
chunk_total: 26
content_sha: 81fab8f06747c80d9c873bef6ec5a8195820d0e6c9cf89925a451ac4904aa923
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 2517–2635)

```typescript
    const destinationId = setupEjectableService(state.state, {
      tombstone: {
        hash: tombstone,
        length,
        slots: tryAsLookupHistorySlots([0, 1].map((x) => tryAsTimeSlot(x))),
      },
    });

    const partialState = AccumulateExternalities.forService({
      chainSpec: tinyChainSpec,
      blake2b: blake2b,
      updatedState: state,
      currentServiceId: tryAsServiceId(0),
      nextNewServiceIdCandidate: tryAsServiceId(10),
      currentTimeslot: tryAsTimeSlot(50),
    });

    // when
    const result = partialState.eject(destinationId, tombstone);

    // then
    assert.deepStrictEqual(result, Result.ok(OK));
    assert.deepStrictEqual(state.stateUpdate.services.removed, [destinationId]);
    assert.deepStrictEqual(
      state.stateUpdate.services.preimages,
      new Map([[destinationId, [UpdatePreimage.remove({ hash: tombstone, length: length })]]]),
    );
  });
});

describe("AccumulateServiceExternalities", () => {
  const prepareState = (serviceArray: InMemoryService[] = []) => {
    const services = new Map<ServiceId, InMemoryService>();

    for (const service of serviceArray) {
      services.set(service.serviceId, service);
    }

    const state = InMemoryState.empty(tinyChainSpec);
    state.services = services;
    return PartiallyUpdatedState.new(state);
  };

  const prepareService = (
    serviceId: ServiceId,
    {
      storage,
      preimages,
      info,
    }: {
      storage?: Map<string, StorageItem>;
      preimages?: HashDictionary<PreimageHash, PreimageItem>;
      info?: Partial<ServiceAccountInfo>;
    } = {},
  ) => {
    const initialStorage = storage ?? new Map();
    const storageUtilisationBytes = Array.from(initialStorage.values()).reduce(
      (sum, item) => sum + (item?.value.length ?? 0),
      0,
    );

    return InMemoryService.new(serviceId, {
      info: ServiceAccountInfo.create({
        balance: tryAsU64(2 ** 32),
        accumulateMinGas: tryAsServiceGas(1000),
        storageUtilisationBytes: tryAsU64(storageUtilisationBytes),
        storageUtilisationCount: tryAsU32(initialStorage.size),
        codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
        onTransferMinGas: tryAsServiceGas(1000),
        gratisStorage: tryAsU64(1024),
        created: tryAsTimeSlot(10),
        lastAccumulation: tryAsTimeSlot(15),
        parentService: tryAsServiceId(1),
        ...info,
      }),
      storage: initialStorage,
      preimages: preimages ?? HashDictionary.new(),
      lookupHistory: HashDictionary.new(),
    });
  };

  const preparePreimages = (preimageArray: [PreimageHash, BytesBlob][]) => {
    const preimages: HashDictionary<PreimageHash, PreimageItem> = HashDictionary.new();

    for (const [hash, blob] of preimageArray) {
      const item = PreimageItem.create({ hash, blob });
      preimages.set(hash, item);
    }

    return preimages;
  };

  describe("getInfo", () => {
    it("should return null when serviceId is null", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const serviceId: ServiceId | null = null;
      const state = prepareState([prepareService(currentServiceId)]);
      const expectedServiceInfo: ServiceAccountInfo | null = null;

      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      const serviceInfo = accumulateServiceExternalities.getServiceInfo(serviceId);

      assert.strictEqual(serviceInfo, expectedServiceInfo);
    });

    it("should return null when serviceId is incorrect", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const serviceId = tryAsServiceId(5);
      const state = prepareState([prepareService(currentServiceId)]);
      const expectedServiceInfo: ServiceAccountInfo | null = null;

```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.test.ts#L127-L273
title: packages/jam/state/in-memory-state.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 5
content_sha: b376da364ecf5e29133f3135c4e80769e8b21890fa22740bcf1f9e0270e89a27
language: typescript
---
`packages/jam/state/in-memory-state.test.ts` (lines 127–273)

```typescript
      Result.error(UpdateError.DuplicateService, () => "1 already exists!"),
    );
  });

  it("should update storage of an existing service", () => {
    const state = InMemoryState.empty(tinyChainSpec);

    const serviceId = tryAsServiceId(1);
    const accountInfo = ServiceAccountInfo.create({
      codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
      balance: tryAsU64(100),
      accumulateMinGas: tryAsServiceGas(10),
      onTransferMinGas: tryAsServiceGas(5),
      storageUtilisationBytes: tryAsU64(8),
      storageUtilisationCount: tryAsU32(3),
      ...accountComp,
    });

    // Create service first
    let result = state.applyUpdate({
      updated: new Map([
        [
          serviceId,
          UpdateService.create({
            serviceInfo: accountInfo,
            lookupHistory: null,
          }),
        ],
      ]),
    });

    assert.deepEqual(result, Result.ok(OK));
    // Now set storage
    const key: StorageKey = asOpaqueType(Bytes.fill(1, HASH_SIZE));
    const value = BytesBlob.blobFromString("hello");
    const item = StorageItem.create({ key, value });
    const expectedItem = StorageItem.create({ key, value });

    result = state.applyUpdate({
      storage: new Map([
        [
          serviceId,
          [
            UpdateStorage.set({
              storage: item,
            }),
          ],
        ],
      ]),
    });

    assert.deepEqual(result, Result.ok(OK));

    const service = state.services.get(serviceId);
    if (service === undefined) {
      assert.fail("Service not found after update.");
    }

    const actual = service.data.storage.get(key.toString());
    assert.deepEqual(actual, expectedItem);
  });

  it("should fail to update storage of non-existing service", () => {
    const state = InMemoryState.empty(tinyChainSpec);

    const serviceId = tryAsServiceId(42); // Not created
    const key = Bytes.zero(HASH_SIZE).asOpaque();
    const value = BytesBlob.blobFromString("data");
    const item = StorageItem.create({ key, value });

    const result = state.applyUpdate({
      storage: new Map([
        [
          serviceId,
          [
            UpdateStorage.set({
              storage: item,
            }),
          ],
        ],
      ]),
    });

    deepEqual(
      result,
      Result.error(UpdateError.NoService, () => `Attempting to update storage of non-existing service: ${serviceId}`),
    );
  });

  it("should provide a preimage to an existing service", () => {
    const state = InMemoryState.empty(tinyChainSpec);

    const serviceId = tryAsServiceId(1);
    const accountInfo = ServiceAccountInfo.create({
      codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
      balance: tryAsU64(100),
      accumulateMinGas: tryAsServiceGas(10),
      onTransferMinGas: tryAsServiceGas(5),
      storageUtilisationBytes: tryAsU64(8),
      storageUtilisationCount: tryAsU32(3),
      ...accountComp,
    });

    // Create service first
    let result = state.applyUpdate({
      updated: new Map([
        [
          serviceId,
          UpdateService.create({
            serviceInfo: accountInfo,
            lookupHistory: null,
          }),
        ],
      ]),
    });

    assert.deepEqual(result, Result.ok(OK));

    const blob = BytesBlob.blobFromString("my preimage");
    const hash = blake2b.hashBytes(blob).asOpaque();
    const preimage = PreimageItem.create({ hash, blob });
    const slot = tryAsTimeSlot(5);

    result = state.applyUpdate({
      preimages: new Map([
        [
          serviceId,
          [
            UpdatePreimage.provide({
              preimage,
              slot,
              providedFor: serviceId,
            }),
          ],
        ],
      ]),
    });

    assert.deepEqual(result, Result.ok(OK));

    const service = state.services.get(serviceId);
    if (service === undefined) {
      assert.fail("Service not found after preimage update.");
    }

    assert.deepEqual(service.data.preimages.get(hash), preimage);

```

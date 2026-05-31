---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.test.ts#L398-L552
title: packages/jam/state/in-memory-state.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 3
chunk_total: 5
content_sha: c1b39d5ca9d322bd53caa452087ced5c5b9b7138b8ad80b884d4bd576c8a1f80
language: typescript
---
`packages/jam/state/in-memory-state.test.ts` (lines 398–552)

```typescript
      preimages: new Map([
        [
          serviceId,
          [
            UpdatePreimage.updateOrAdd({
              lookupHistory: newItem,
            }),
          ],
        ],
      ]),
    });

    assert.deepEqual(result, Result.ok(OK));

    const service = state.services.get(serviceId);
    if (service === undefined) {
      assert.fail("Service not found after UpdateOrAdd.");
    }

    // Preimage should not be modified
    assert.deepEqual(service.data.preimages.get(hash), preimage);

    // Lookup history should be updated
    const history = service.data.lookupHistory.get(hash);
    assert.deepEqual(history?.length, 1);
    assert.deepEqual(history?.[0], newItem);
  });

  it("should fail to provide a preimage that already exists", () => {
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

    // Create the service
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

    const blob = BytesBlob.blobFromString("duplicate");
    const hash = blake2b.hashBytes(blob).asOpaque();
    const preimage = PreimageItem.create({ hash, blob });
    const slot = tryAsTimeSlot(1);

    // First application should succeed
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

    // Second application should fail
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

    deepEqual(
      result,
      Result.error(UpdateError.PreimageExists, () => `Overwriting existing preimage at ${serviceId}: ${preimage}`),
    );
  });

  it("should remove a preimage and its lookup history entry", () => {
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

    // Create the service
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

    // Add a preimage
    const blob = BytesBlob.blobFromString("removable");
    const hash = blake2b.hashBytes(blob).asOpaque();
    const length = tryAsU32(blob.length);
    const preimage = PreimageItem.create({ hash, blob });
    const slot = tryAsTimeSlot(3);

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

```

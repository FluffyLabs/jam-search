---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.test.ts#L267-L409
title: packages/jam/state/in-memory-state.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 5
content_sha: c58efbb935dd1259e72c2f430d1cb26361f675304396fd29b8fc4c88693c5c8a
language: typescript
---
`packages/jam/state/in-memory-state.test.ts` (lines 267–409)

```typescript
    const service = state.services.get(serviceId);
    if (service === undefined) {
      assert.fail("Service not found after preimage update.");
    }

    assert.deepEqual(service.data.preimages.get(hash), preimage);

    const history = service.data.lookupHistory.get(hash);
    assert.deepEqual(history?.length, 1);
    assert.deepEqual(history?.[0].length, tryAsU32(blob.length));
    assert.deepEqual(history?.[0].slots, tryAsLookupHistorySlots([slot]));
  });

  it("should provide a preimage with slot = null and not create lookup history", () => {
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

    result = state.applyUpdate({
      preimages: new Map([
        [
          serviceId,
          [
            UpdatePreimage.provide({
              preimage,
              slot: null,
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

    // Should not create lookup history
    assert.deepEqual(service.data.lookupHistory.get(hash), undefined);
  });

  it("should update or replace lookup history entry with UpdateOrAdd", () => {
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

    // Provide preimage first
    const blob = BytesBlob.blobFromString("lookup");
    const hash = blake2b.hashBytes(blob).asOpaque();
    const preimage = PreimageItem.create({ hash, blob });
    const slot1 = tryAsTimeSlot(1);

    result = state.applyUpdate({
      preimages: new Map([
        [
          serviceId,
          [
            UpdatePreimage.provide({
              preimage,
              slot: slot1,
              providedFor: serviceId,
            }),
          ],
        ],
      ]),
    });

    assert.deepEqual(result, Result.ok(OK));

    // Now UpdateOrAdd with different slot but same length
    const slot2 = tryAsTimeSlot(2);
    const newItem = LookupHistoryItem.new(hash, tryAsU32(blob.length), tryAsLookupHistorySlots([slot2]));

    result = state.applyUpdate({
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

```

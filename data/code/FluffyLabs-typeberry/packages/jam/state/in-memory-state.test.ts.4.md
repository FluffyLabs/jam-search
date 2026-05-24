---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/in-memory-state.test.ts#L541-L670
title: packages/jam/state/in-memory-state.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 4
chunk_total: 5
content_sha: 7a81a06b048a25d9b6bffab9bc5694c05131a69a8770b2d0301238af0211e6ab
language: typescript
---
`packages/jam/state/in-memory-state.test.ts` (lines 541–670)

```typescript
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
      assert.fail("Service not found after provide.");
    }

    assert.deepEqual(service.data.preimages.get(hash), preimage);
    assert.deepEqual(service.data.lookupHistory.get(hash)?.length, 1);

    // Now remove the preimage
    result = state.applyUpdate({
      preimages: new Map([
        [
          serviceId,
          [
            UpdatePreimage.remove({
              hash,
              length,
            }),
          ],
        ],
      ]),
    });

    assert.deepEqual(result, Result.ok(OK));

    assert.deepEqual(service.data.preimages.has(hash), false);
    assert.deepEqual(service.data.lookupHistory.get(hash)?.length, 0);
  });

  it("should remove a specific lookup history entry by length", () => {
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
    const blob = BytesBlob.blobFromString("some"); // length: 4
    const hash = blake2b.hashBytes(blob).asOpaque();
    const preimage = PreimageItem.create({ hash, blob });

    const slot1 = tryAsTimeSlot(1);
    const slot2 = tryAsTimeSlot(2);
    const length1 = tryAsU32(blob.length);
    const length2 = tryAsU32(blob.length + 1); // simulate different-length record
    const secondItem = LookupHistoryItem.new(hash, length2, tryAsLookupHistorySlots([slot2]));

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
            UpdatePreimage.updateOrAdd({
              lookupHistory: secondItem,
            }),
          ],
        ],
      ]),
    });

    const service = state.services.get(serviceId);
    if (service === undefined) {
      assert.fail("Service not found");
    }

    const historyBefore = service.data.lookupHistory.get(hash);
    assert.deepEqual(historyBefore?.length, 2);

    // Now remove only length1
    result = state.applyUpdate({
      preimages: new Map([
        [
          serviceId,
          [
            UpdatePreimage.remove({
              hash,
              length: length1,
            }),
          ],
        ],
      ]),
    });

    assert.deepEqual(result, Result.ok(OK));

    const historyAfter = service.data.lookupHistory.get(hash);
    assert.deepEqual(historyAfter?.length, 1);
    assert.deepEqual(historyAfter?.[0], secondItem);

    // Preimage itself is also removed
    assert.deepEqual(service.data.preimages.get(hash), undefined);
  });
});
```

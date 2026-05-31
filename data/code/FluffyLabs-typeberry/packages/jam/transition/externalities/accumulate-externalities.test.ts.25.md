---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L2826-L2877
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 25
chunk_total: 26
content_sha: cb1fa9310450fd7f3cece9726c4162836e720082378c63da5e7c74f1dc9edb2e
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 2826–2877)

```typescript
      assert.strictEqual(result, value);
    });

    it("should correctly write to storage", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const hash = Bytes.fill(HASH_SIZE, 1).asOpaque();
      const blob = BytesBlob.empty();
      const state = prepareState([prepareService(currentServiceId)]);
      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      assert.strictEqual(state.stateUpdate.services.storage.size, 0);

      accumulateServiceExternalities.write(hash, blob);

      assert.strictEqual(state.stateUpdate.services.storage.size, 1);
    });

    it("should return new value if there was a write", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const key: StorageKey = Bytes.fill(HASH_SIZE, 2).asOpaque();
      const initialStorage = new Map<string, StorageItem>();
      const value = BytesBlob.empty();
      const newBlob = BytesBlob.parseBlob("0x11111111");
      initialStorage.set(key.toString(), StorageItem.create({ key, value }));

      const state = prepareState([prepareService(currentServiceId, { storage: initialStorage })]);
      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      accumulateServiceExternalities.write(key, newBlob);

      assert.strictEqual(state.stateUpdate.services.storage.size, 1);

      const result = accumulateServiceExternalities.read(currentServiceId, key);

      assert.deepStrictEqual(result, newBlob);
    });
  });
});
```

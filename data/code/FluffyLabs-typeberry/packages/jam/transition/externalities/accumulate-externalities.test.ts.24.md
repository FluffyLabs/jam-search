---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L2725-L2831
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 24
chunk_total: 26
content_sha: 81e784fbfa1450cce11e2c18b6dd8b660b19fb8c995ea27d0caa0f3e23857106
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 2725–2831)

```typescript
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      const result = accumulateServiceExternalities.lookup(currentServiceId, requestedHash);

      assert.strictEqual(result, expectedResult);
    });

    it("should return return a correct preimage", () => {
      const serviceId = tryAsServiceId(0);
      const expectedResult = BytesBlob.empty();
      const requestedHash = Bytes.fill(HASH_SIZE, 1).asOpaque();
      const preimages = preparePreimages([[requestedHash, expectedResult]]);
      const service = prepareService(serviceId, { preimages });
      const state = prepareState([service]);

      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: serviceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      const result = accumulateServiceExternalities.lookup(serviceId, requestedHash);

      assert.deepStrictEqual(result, expectedResult);
    });
  });

  describe("read / write", () => {
    it("should return null when serviceId is null ", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const serviceId: ServiceId | null = null;
      const hash = Bytes.fill(HASH_SIZE, 1).asOpaque();
      const state = prepareState([prepareService(currentServiceId)]);

      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      const result = accumulateServiceExternalities.read(serviceId, hash);

      assert.strictEqual(result, null);
    });

    it("should return null when service does not exist ", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const serviceId = tryAsServiceId(33);
      const hash = Bytes.fill(HASH_SIZE, 1).asOpaque();
      const state = prepareState([prepareService(currentServiceId)]);
      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      const result = accumulateServiceExternalities.read(serviceId, hash);

      assert.strictEqual(result, null);
    });

    it("should correctly read from storage", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const serviceId = tryAsServiceId(33);
      const key: StorageKey = Bytes.fill(HASH_SIZE, 1).asOpaque();
      const initialStorage = new Map<string, StorageItem>();
      const value = BytesBlob.empty();
      initialStorage.set(
        key.toString(),
        StorageItem.create({
          key,
          value,
        }),
      );
      const service = prepareService(serviceId, { storage: initialStorage });
      const state = prepareState([prepareService(currentServiceId), service]);

      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      const result = accumulateServiceExternalities.read(serviceId, key);
      assert.strictEqual(result, value);
    });

    it("should correctly write to storage", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const hash = Bytes.fill(HASH_SIZE, 1).asOpaque();
```

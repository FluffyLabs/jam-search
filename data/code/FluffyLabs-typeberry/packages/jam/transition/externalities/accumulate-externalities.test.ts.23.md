---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.test.ts#L2631-L2731
title: packages/jam/transition/externalities/accumulate-externalities.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 23
chunk_total: 26
content_sha: 4dc11d1f35f3f8bcbc42a99d0496df04150c370e0a08c79982eca1d76ea2547c
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.test.ts` (lines 2631–2731)

```typescript
      const currentServiceId = tryAsServiceId(10_000);
      const serviceId = tryAsServiceId(5);
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

    it("should return correct service info", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const serviceId = tryAsServiceId(5);
      const state = prepareState([prepareService(currentServiceId), prepareService(serviceId)]);
      const expectedServiceInfo = prepareService(serviceId).getInfo();

      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      const serviceInfo = accumulateServiceExternalities.getServiceInfo(serviceId);

      assert.deepStrictEqual(serviceInfo, expectedServiceInfo);
    });
  });

  describe("lookup", () => {
    it("should return null when serviceId is null", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const serviceId: ServiceId | null = null;
      const hash = Bytes.fill(HASH_SIZE, 1).asOpaque();
      const state = prepareState([prepareService(currentServiceId)]);
      const expectedResult: BytesBlob | null = null;

      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      const result = accumulateServiceExternalities.lookup(serviceId, hash);

      assert.strictEqual(result, expectedResult);
    });

    it("should return null when service does not exist", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const serviceId = tryAsServiceId(0);
      const hash = Bytes.fill(HASH_SIZE, 1).asOpaque();
      const state = prepareState([prepareService(currentServiceId)]);
      const expectedResult: BytesBlob | null = null;

      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

      const result = accumulateServiceExternalities.lookup(serviceId, hash);

      assert.strictEqual(result, expectedResult);
    });

    it("should return null when preimage does not exists", () => {
      const currentServiceId = tryAsServiceId(10_000);
      const requestedHash = Bytes.fill(HASH_SIZE, 1).asOpaque();
      const otherHash = Bytes.fill(HASH_SIZE, 2).asOpaque();
      const preimages = preparePreimages([[otherHash, BytesBlob.empty()]]);
      const service = prepareService(currentServiceId, { preimages });
      const state = prepareState([service]);
      const expectedResult: BytesBlob | null = null;

      const accumulateServiceExternalities = AccumulateExternalities.forService({
        chainSpec: tinyChainSpec,
        blake2b: blake2b,
        updatedState: state,
        currentServiceId: currentServiceId,
        nextNewServiceIdCandidate: tryAsServiceId(42),
        currentTimeslot: tryAsTimeSlot(16),
      });

```

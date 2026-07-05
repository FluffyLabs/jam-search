---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/provide.test.ts#L93-L167
title: packages/jam/jam-host-calls/accumulate/provide.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 38f2f6243e6423d575d51d43dfaae82ecaffaf97b5bfdfbd87ccdcee062acc8f
language: typescript
---
`packages/jam/jam-host-calls/accumulate/provide.test.ts` (lines 93–167)

```typescript
    const preimage = BytesBlob.blobFromNumbers([0xaa, 0xbb, 0xcc, 0xdd]);
    accumulate.providePreimageResponse = Result.error(
      ProvidePreimageError.WasNotRequested,
      () => "Test: preimage was not requested for provide",
    );

    const { registers, memory } = prepareRegsAndMemory(serviceId, preimage);

    const result = await provide.execute(gas, registers, memory);

    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
    assert.deepStrictEqual(accumulate.providePreimageData, [[serviceId, preimage]]);
    deepEqual(
      accumulate.providePreimageResponse,
      Result.error(ProvidePreimageError.WasNotRequested, () => "Test: preimage was not requested for provide"),
    );
  });

  it("should return HUH if preimage already provided", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const provide = Provide.new(currentServiceId, accumulate);
    const serviceId = tryAsServiceId(15_000);
    const preimage = BytesBlob.blobFromNumbers([0xaa, 0xbb, 0xcc, 0xdd]);
    accumulate.providePreimageResponse = Result.error(
      ProvidePreimageError.AlreadyProvided,
      () => "Test: preimage already provided",
    );

    const { registers, memory } = prepareRegsAndMemory(serviceId, preimage);

    const result = await provide.execute(gas, registers, memory);

    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
    assert.deepStrictEqual(accumulate.providePreimageData, [[serviceId, preimage]]);
    deepEqual(
      accumulate.providePreimageResponse,
      Result.error(ProvidePreimageError.AlreadyProvided, () => "Test: preimage already provided"),
    );
  });

  it("should return OK if preimage was not provided before (for other service)", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const provide = Provide.new(currentServiceId, accumulate);
    const serviceId = tryAsServiceId(15_000);
    const preimage = BytesBlob.blobFromNumbers([0xaa, 0xbb, 0xcc, 0xdd]);

    const { registers, memory } = prepareRegsAndMemory(serviceId, preimage);

    const result = await provide.execute(gas, registers, memory);

    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    assert.deepStrictEqual(accumulate.providePreimageData, [[serviceId, preimage]]);
  });

  it("should return OK if preimage was not provided before (for self)", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const provide = Provide.new(currentServiceId, accumulate);
    const serviceId = tryAsServiceId(15_000);
    const preimage = BytesBlob.blobFromNumbers([0xaa, 0xbb, 0xcc, 0xdd]);

    const { registers, memory } = prepareRegsAndMemory(serviceId, preimage);

    const result = await provide.execute(gas, registers, memory);

    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    assert.deepStrictEqual(accumulate.providePreimageData, [[serviceId, preimage]]);
  });
});
```

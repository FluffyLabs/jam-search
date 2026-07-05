---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/eject.test.ts#L98-L177
title: packages/jam/jam-host-calls/accumulate/eject.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: d8aa80d3cc041266e1d86277fc8463100e3cc326f4fa49380bb1affe9fbc5824
language: typescript
---
`packages/jam/jam-host-calls/accumulate/eject.test.ts` (lines 98–177)

```typescript
    // when
    const result = await eject.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
    assert.deepStrictEqual(accumulate.ejectData, [[sourceServiceId, hash]]);
    deepEqual(
      accumulate.ejectReturnValue,
      Result.error(EjectError.InvalidService, () => "Test: destination service does not exist for eject"),
    );
  });

  it("should fail if destination and source are the same", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(15_000);
    const eject = Eject.new(serviceId, accumulate);
    const sourceServiceId = tryAsServiceId(15_000);
    const hash = Bytes.fill(HASH_SIZE, 5);

    const { registers, memory } = prepareRegsAndMemory(sourceServiceId, hash);

    // when
    const result = await eject.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
    assert.deepStrictEqual(accumulate.ejectData, []);
  });

  it("should fail if destination has no available preimage", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const eject = Eject.new(serviceId, accumulate);
    const sourceServiceId = tryAsServiceId(15_000);
    const hash = Bytes.fill(HASH_SIZE, 5);
    accumulate.ejectReturnValue = Result.error(
      EjectError.InvalidPreimage,
      () => "Test: no available preimage for eject",
    );

    const { registers, memory } = prepareRegsAndMemory(sourceServiceId, hash);

    // when
    const result = await eject.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
    assert.deepStrictEqual(accumulate.ejectData, [[sourceServiceId, hash]]);
    deepEqual(
      accumulate.ejectReturnValue,
      Result.error(EjectError.InvalidPreimage, () => "Test: no available preimage for eject"),
    );
  });

  it("should fail if preimage is too old", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const eject = Eject.new(serviceId, accumulate);
    const sourceServiceId = tryAsServiceId(15_000);
    const hash = Bytes.fill(HASH_SIZE, 5);
    accumulate.ejectReturnValue = Result.error(EjectError.InvalidPreimage, () => "Test: preimage is too old for eject");

    const { registers, memory } = prepareRegsAndMemory(sourceServiceId, hash);

    // when
    const result = await eject.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
    assert.deepStrictEqual(accumulate.ejectData, [[sourceServiceId, hash]]);
    deepEqual(
      accumulate.ejectReturnValue,
      Result.error(EjectError.InvalidPreimage, () => "Test: preimage is too old for eject"),
    );
  });
});
```

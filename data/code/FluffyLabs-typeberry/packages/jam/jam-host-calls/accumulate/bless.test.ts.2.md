---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/bless.test.ts#L199-L282
title: packages/jam/jam-host-calls/accumulate/bless.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 8d971457d67320d21a7418153d7739b6b17bfc55cd3118f29770e6965aa3965b
language: typescript
---
`packages/jam/jam-host-calls/accumulate/bless.test.ts` (lines 199–282)

```typescript
  it("should return HUH when service is unprivileged", async () => {
    const accumulate = new PartialStateMock();
    accumulate.privilegedServicesResponse = Result.error(
      UpdatePrivilegesError.UnprivilegedService,
      () => "Test: unprivileged service attempting bless",
    );
    const serviceId = tryAsServiceId(11_000);
    const bless = Bless.new(serviceId, accumulate, tinyChainSpec);
    const entries = prepareServiceGasMap();
    const authorizers = prepareAuthorizers();
    const { registers, memory } = prepareRegsAndMemory(entries, authorizers);

    // when
    const result = await bless.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
    assert.deepStrictEqual(accumulate.privilegedServices, []);
  });

  it("should return WHO if given manager is invalid", async () => {
    const accumulate = new PartialStateMock();
    accumulate.privilegedServicesResponse = Result.error(
      UpdatePrivilegesError.InvalidServiceId,
      () => "Test: invalid manager service ID for bless",
    );
    const serviceId = tryAsServiceId(11_000);
    const bless = Bless.new(serviceId, accumulate, tinyChainSpec);
    const entries = prepareServiceGasMap();
    const authorizers = prepareAuthorizers();
    const { registers, memory } = prepareRegsAndMemory(entries, authorizers, { manager: tryAsU64(MAX_VALUE_U64) });

    // when
    const result = await bless.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
    assert.deepStrictEqual(accumulate.privilegedServices, []);
  });

  it("should return WHO if given validator is invalid", async () => {
    const accumulate = new PartialStateMock();
    accumulate.privilegedServicesResponse = Result.error(
      UpdatePrivilegesError.InvalidServiceId,
      () => "Test: invalid validator service ID for bless",
    );
    const serviceId = tryAsServiceId(11_000);
    const bless = Bless.new(serviceId, accumulate, tinyChainSpec);
    const entries = prepareServiceGasMap();
    const authorizers = prepareAuthorizers();
    const { registers, memory } = prepareRegsAndMemory(entries, authorizers, { validator: tryAsU64(MAX_VALUE_U64) });

    // when
    const result = await bless.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
    assert.deepStrictEqual(accumulate.privilegedServices, []);
  });

  it("should return WHO if given registrar is invalid", async () => {
    const accumulate = new PartialStateMock();
    accumulate.privilegedServicesResponse = Result.error(
      UpdatePrivilegesError.InvalidServiceId,
      () => "Test: invalid registrar service ID for bless",
    );
    const serviceId = tryAsServiceId(11_000);
    const bless = Bless.new(serviceId, accumulate, tinyChainSpec);
    const entries = prepareServiceGasMap();
    const authorizers = prepareAuthorizers();
    const { registers, memory } = prepareRegsAndMemory(entries, authorizers, { registrar: tryAsU64(MAX_VALUE_U64) });

    // when
    const result = await bless.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
    assert.deepStrictEqual(accumulate.privilegedServices, []);
  });
});
```

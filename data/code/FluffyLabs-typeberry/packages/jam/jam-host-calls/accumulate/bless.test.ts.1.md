---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/bless.test.ts#L95-L202
title: packages/jam/jam-host-calls/accumulate/bless.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 3
content_sha: bf74e8e5af49b7fe7125c6fa7c974e771523b27a85e06497e49e70479ffe119a
language: typescript
---
`packages/jam/jam-host-calls/accumulate/bless.test.ts` (lines 95–202)

```typescript
    const { registers, memory } = prepareRegsAndMemory(entries, authorizers);

    // when
    const result = await bless.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    deepEqual(accumulate.privilegedServices, [
      [
        tryAsServiceId(5),
        tryAsPerCore([tryAsServiceId(10), tryAsServiceId(15)], tinyChainSpec),
        tryAsServiceId(20),
        tryAsServiceId(42),
        new Map(entries),
      ],
    ]);
  });

  it("should return panic when dictionary is not readable", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const bless = Bless.new(serviceId, accumulate, tinyChainSpec);
    const entries = prepareServiceGasMap();
    const authorizers = prepareAuthorizers();
    const { registers, memory } = prepareRegsAndMemory(entries, authorizers, { skipDictionary: true });

    // when
    const result = await bless.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accumulate.privilegedServices, []);
  });

  it("should return panic when authorizers are not readable", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const bless = Bless.new(serviceId, accumulate, tinyChainSpec);
    const entries = prepareServiceGasMap();
    const authorizers = prepareAuthorizers();
    const { registers, memory } = prepareRegsAndMemory(entries, authorizers, { skipAuth: true });

    // when
    const result = await bless.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accumulate.privilegedServices, []);
  });

  it("should auto-accumulate services when dictionary is out of order", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const bless = Bless.new(serviceId, accumulate, tinyChainSpec);
    const entries = prepareServiceGasMap();
    entries.push([tryAsServiceId(5), tryAsServiceGas(10_000)]);
    const authorizers = prepareAuthorizers();
    const { registers, memory } = prepareRegsAndMemory(entries, authorizers);

    // when
    const result = await bless.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);

    deepEqual(accumulate.privilegedServices, [
      [
        tryAsServiceId(5),
        tryAsPerCore([tryAsServiceId(10), tryAsServiceId(15)], tinyChainSpec),
        tryAsServiceId(20),
        tryAsServiceId(42),
        new Map(entries),
      ],
    ]);
  });

  it("should auto-accumulate services when dictionary contains duplicates", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const bless = Bless.new(serviceId, accumulate, tinyChainSpec);
    const entries = prepareServiceGasMap();
    entries.push(entries[entries.length - 1]);
    const authorizers = prepareAuthorizers();
    const { registers, memory } = prepareRegsAndMemory(entries, authorizers);

    // when
    const result = await bless.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    deepEqual(accumulate.privilegedServices, [
      [
        tryAsServiceId(5),
        tryAsPerCore([tryAsServiceId(10), tryAsServiceId(15)], tinyChainSpec),
        tryAsServiceId(20),
        tryAsServiceId(42),
        new Map(entries),
      ],
    ]);
  });

  it("should return HUH when service is unprivileged", async () => {
    const accumulate = new PartialStateMock();
    accumulate.privilegedServicesResponse = Result.error(
      UpdatePrivilegesError.UnprivilegedService,
```

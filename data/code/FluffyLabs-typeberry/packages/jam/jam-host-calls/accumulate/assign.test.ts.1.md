---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/assign.test.ts#L92-L174
title: packages/jam/jam-host-calls/accumulate/assign.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: d92eaa9353ae674963a16854e695f1b248cea7d3f7cbde341932dd255a9e62f7
language: typescript
---
`packages/jam/jam-host-calls/accumulate/assign.test.ts` (lines 92–174)

```typescript
  it("should return an error if core index is too large", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const assign = Assign.new(serviceId, accumulate, tinyChainSpec);
    const { registers, memory } = prepareRegsAndMemory(tryAsCoreIndex(3), []);

    // when
    const result = await assign.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.CORE);
    assert.deepStrictEqual(accumulate.authQueue.length, 0);
  });

  it("should return an error if core index is waay too large", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const assign = Assign.new(serviceId, accumulate, tinyChainSpec);
    const { registers, memory } = prepareRegsAndMemory(tryAsCoreIndex(3), []);
    registers.set(CORE_INDEX_REG, tryAsU64(2 ** 16 + 3));

    // when
    const result = await assign.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.CORE);
    assert.deepStrictEqual(accumulate.authQueue.length, 0);
  });

  it("should return panic if data not readable", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const assign = Assign.new(serviceId, accumulate, tinyChainSpec);
    const { registers, memory } = prepareRegsAndMemory(tryAsCoreIndex(3), [], { skipAuthQueue: true });

    // when
    const result = await assign.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accumulate.authQueue.length, 0);
  });

  it("should return an error when current service is unprivileged", async () => {
    const accumulate = new PartialStateMock();
    accumulate.authQueueResponse = Result.error(
      UpdatePrivilegesError.UnprivilegedService,
      () => "Test: unprivileged service attempting assign",
    );
    const serviceId = tryAsServiceId(10_000);
    const assign = Assign.new(serviceId, accumulate, tinyChainSpec);
    const { registers, memory } = prepareRegsAndMemory(tryAsCoreIndex(0), [], { assigners: 0 });

    // when
    const result = await assign.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
    assert.deepStrictEqual(accumulate.authQueue.length, 0);
  });

  it("should return an error when auth manager is invalid", async () => {
    const accumulate = new PartialStateMock();
    accumulate.authQueueResponse = Result.error(
      UpdatePrivilegesError.InvalidServiceId,
      () => "Test: invalid service ID for assign",
    );
    const serviceId = tryAsServiceId(10_000);
    const assign = Assign.new(serviceId, accumulate, tinyChainSpec);
    const { registers, memory } = prepareRegsAndMemory(tryAsCoreIndex(0), [], { assigners: null });

    // when
    const result = await assign.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
    assert.deepStrictEqual(accumulate.authQueue.length, 0);
  });
});
```

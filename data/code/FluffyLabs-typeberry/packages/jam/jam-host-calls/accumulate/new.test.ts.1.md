---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/new.test.ts#L104-L213
title: packages/jam/jam-host-calls/accumulate/new.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 72496928973f143fbe5ffc9ac40b0ad36cec81529d9515b7c5bbef8dff352d95
language: typescript
---
`packages/jam/jam-host-calls/accumulate/new.test.ts` (lines 104–213)

```typescript
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.CASH);
    assert.deepStrictEqual(accumulate.newServiceCalled.length, 1);
  });

  it("should fail when code not readable", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const n = New.new(serviceId, accumulate);
    const { registers, memory } = prepareRegsAndMemory(
      Bytes.fill(HASH_SIZE, 0x69).asOpaque(),
      tryAsU64(4_096n),
      tryAsU64(2n ** 40n),
      tryAsU64(2n ** 50n),
      tryAsU64(1_024n),
      tryAsU64(2 ** 32 - 1), // default service id
      { skipCodeHash: true },
    );

    // when
    const result = await n.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accumulate.newServiceCalled, []);
  });

  it("should fail when trying to set gratis storage by unprivileged service", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000);
    const n = New.new(serviceId, accumulate);
    accumulate.newServiceResponse = Result.error(
      NewServiceError.UnprivilegedService,
      () => "Test: unprivileged service trying to set gratis storage",
    );
    const { registers, memory } = prepareRegsAndMemory(
      Bytes.fill(HASH_SIZE, 0x69).asOpaque(),
      tryAsU64(4_096n),
      tryAsU64(2n ** 40n),
      tryAsU64(2n ** 50n),
      tryAsU64(1_024n),
    );

    // when
    await n.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
    assert.deepStrictEqual(accumulate.newServiceCalled.length, 1);
  });

  it("should create a new service with selected id", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10); // service has registrar privilege
    const n = New.new(serviceId, accumulate);
    accumulate.newServiceResponse = Result.ok(tryAsServiceId(42));
    const { registers, memory } = prepareRegsAndMemory(
      Bytes.fill(HASH_SIZE, 0x69).asOpaque(),
      tryAsU64(4_096n),
      tryAsU64(2n ** 40n),
      tryAsU64(2n ** 50n),
      tryAsU64(1_024n),
      tryAsU64(42n),
    );

    // when
    await n.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(tryAsServiceId(Number(registers.get(RESULT_REG))), tryAsServiceId(42));
    const gratisStorage = 1_024n;
    assert.deepStrictEqual(accumulate.newServiceCalled, [
      [Bytes.fill(HASH_SIZE, 0x69), 4_096n, 2n ** 40n, 2n ** 50n, gratisStorage, 42n],
    ]);
  });

  it("should create a new service with random id", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10_000); // service does not have registrar privilege
    const n = New.new(serviceId, accumulate);
    accumulate.newServiceResponse = Result.ok(tryAsServiceId(2 ** 20));
    const { registers, memory } = prepareRegsAndMemory(
      Bytes.fill(HASH_SIZE, 0x69).asOpaque(),
      tryAsU64(4_096n),
      tryAsU64(2n ** 40n),
      tryAsU64(2n ** 50n),
      tryAsU64(1_024n),
      tryAsU64(42n),
    );

    // when
    await n.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(tryAsServiceId(Number(registers.get(RESULT_REG))), tryAsServiceId(2 ** 20));
    const gratisStorage = 1_024n;
    assert.deepStrictEqual(accumulate.newServiceCalled, [
      [Bytes.fill(HASH_SIZE, 0x69), 4_096n, 2n ** 40n, 2n ** 50n, gratisStorage, 42n],
    ]);
  });

  it("should fail when trying to set selected id, but service already exists", async () => {
    const accumulate = new PartialStateMock();
    const serviceId = tryAsServiceId(10);
    const n = New.new(serviceId, accumulate);
    accumulate.newServiceResponse = Result.error(
      NewServiceError.RegistrarServiceIdAlreadyTaken,
      () => "Test: service ID already taken",
    );
    const { registers, memory } = prepareRegsAndMemory(
      Bytes.fill(HASH_SIZE, 0x69).asOpaque(),
```

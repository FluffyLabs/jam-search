---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/write.test.ts#L94-L187
title: packages/jam/jam-host-calls/general/write.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 5ba166586e6f041702ed285d747df42c1237323c8093c2ba4905cc4d4c04b65b
language: typescript
---
`packages/jam/jam-host-calls/general/write.test.ts` (lines 94–187)

```typescript
  it("should write data to account state when low balance but with gratisStorage", async () => {
    const serviceId = tryAsServiceId(10_000);
    const accounts = prepareAccounts(serviceId, { balance: 100n, gratisStorage: 150_000n });
    const write = Write.new(serviceId, accounts);
    const key = BytesBlob.blobFromString("imma key");
    const { registers, memory } = prepareRegsAndMemory(key, BytesBlob.blobFromString("hello world!"));
    accounts.storage.set(BytesBlob.blobFromString("old data"), serviceId, asOpaqueType(key));

    // when
    const result = await write.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64("old data".length));
    assert.deepStrictEqual(accounts.storage.get(serviceId, asOpaqueType(key))?.asText(), "hello world!");
    assert.deepStrictEqual(accounts.storage.data.size, 1);
  });

  it("should remove data from account state", async () => {
    const serviceId = tryAsServiceId(10_000);
    const accounts = prepareAccounts(serviceId);
    const write = Write.new(serviceId, accounts);
    const key = BytesBlob.blobFromString("xyz");
    const { registers, memory } = prepareRegsAndMemory(key, BytesBlob.blobFromNumbers([]));
    accounts.storage.set(BytesBlob.blobFromString("hello world!"), serviceId, asOpaqueType(key));
    accounts.storage.set(null, serviceId, asOpaqueType(key));

    // when
    const result = await write.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.NONE);
    assert.deepStrictEqual(accounts.storage.get(serviceId, asOpaqueType(key)), undefined);
  });

  it("should fail if there is no memory for key", async () => {
    const serviceId = tryAsServiceId(10_000);
    const accounts = prepareAccounts(serviceId);
    const write = Write.new(serviceId, accounts);
    const key = BytesBlob.blobFromString("xyz");
    const { registers, memory } = prepareRegsAndMemory(key, BytesBlob.blobFromString("hello world!"), {
      skipKey: true,
    });

    // when
    const result = await write.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accounts.storage.data.size, 0);
  });

  it("should fail if there is no memory for result", async () => {
    const serviceId = tryAsServiceId(10_000);
    const accounts = prepareAccounts(serviceId);
    const write = Write.new(serviceId, accounts);
    const key = BytesBlob.blobFromString("xyz");
    const { registers, memory } = prepareRegsAndMemory(key, BytesBlob.blobFromString("hello world!"), {
      skipValue: true,
    });

    // when
    const result = await write.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accounts.storage.data.size, 0);
  });

  it("should fail if the key is not fully readable", async () => {
    const serviceId = tryAsServiceId(10_000);
    const accounts = prepareAccounts(serviceId);
    const write = Write.new(serviceId, accounts);
    const key = BytesBlob.blobFromString("xyz");
    const { registers, memory } = prepareRegsAndMemory(key, BytesBlob.blobFromString("hello world!"));
    registers.set(KEY_LEN_REG, tryAsU64(PAGE_SIZE + 1));

    // when
    const result = await write.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accounts.storage.data.size, 0);
  });

  it("should fail if the value is not fully readable", async () => {
    const serviceId = tryAsServiceId(10_000);
    const accounts = prepareAccounts(serviceId);
    const write = Write.new(serviceId, accounts);
    const key = BytesBlob.blobFromString("xyz");
    const { registers, memory } = prepareRegsAndMemory(key, BytesBlob.blobFromString("hello world!"));
    registers.set(DEST_LEN_REG, tryAsU64(PAGE_SIZE + 1));

```

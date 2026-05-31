---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/read.test.ts#L97-L187
title: packages/jam/jam-host-calls/general/read.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 77212eb5e024affa1a018fda5b0af79d94733eb02a24e382818ff75ff2f5d4c3
language: typescript
---
`packages/jam/jam-host-calls/general/read.test.ts` (lines 97–187)

```typescript
      const accounts = new TestAccounts(currentServiceId);
      const read = Read.new(currentServiceId, accounts);
      const serviceId = tryAsServiceId(11_000);
      const key = BytesBlob.blobFromString("key");
      const value = "hello world";
      const { registers, memory, readResult } = prepareRegsAndMemory(key, value.length, {
        serviceId,
      });
      accounts.storage.set(BytesBlob.blobFromString(value), serviceId, asOpaqueType(key));

      const result = await read.execute(gas, registers, memory);

      assert.deepStrictEqual(result, undefined);
      assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(value.length));
      assert.deepStrictEqual(readResult().asText(), value);
    });

    it("with offset", async () => {
      const currentServiceId = tryAsServiceId(10_000);
      const accounts = new TestAccounts(currentServiceId);
      const read = Read.new(currentServiceId, accounts);
      const serviceId = tryAsServiceId(10_000);
      const key = BytesBlob.blobFromString("key");
      const value = "hello world";
      const { registers, memory, readResult } = prepareRegsAndMemory(key, value.length, {
        valueOffset: 6,
      });
      accounts.storage.set(BytesBlob.blobFromString(value), serviceId, asOpaqueType(key));

      const result = await read.execute(gas, registers, memory);

      assert.deepStrictEqual(result, undefined);
      assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(value.length));
      assert.deepStrictEqual(readResult().toString(), "0x776f726c64");
    });

    it("with offset and length", async () => {
      const currentServiceId = tryAsServiceId(10_000);
      const accounts = new TestAccounts(currentServiceId);
      const read = Read.new(currentServiceId, accounts);
      const serviceId = tryAsServiceId(10_000);
      const key = BytesBlob.blobFromString("key");
      const value = "hello world";
      const { registers, memory, readResult } = prepareRegsAndMemory(key, value.length, {
        valueOffset: 6,
        valueLengthToWrite: 1,
      });
      accounts.storage.set(BytesBlob.blobFromString(value), serviceId, asOpaqueType(key));

      const result = await read.execute(gas, registers, memory);

      assert.deepStrictEqual(result, undefined);
      assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(value.length));
      assert.deepStrictEqual(readResult().toString(), "0x7700000000");
    });

    it("with 0-length destination target", async () => {
      const currentServiceId = tryAsServiceId(10_000);
      const accounts = new TestAccounts(currentServiceId);
      const read = Read.new(currentServiceId, accounts);
      const serviceId = tryAsServiceId(10_000);
      const key = BytesBlob.blobFromString("xyz");
      const value = "hello world";
      const { registers, memory, readResult } = prepareRegsAndMemory(key, value.length, { valueLengthToWrite: 0 });
      accounts.storage.set(BytesBlob.blobFromString(value), serviceId, asOpaqueType(key));
      const result = await read.execute(gas, registers, memory);

      assert.deepStrictEqual(result, undefined);
      assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(value.length));
      assert.deepStrictEqual(readResult().toString(), "0x0000000000000000000000");
    });
  });

  it("should handle missing account", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const accounts = new TestAccounts(currentServiceId);
    const read = Read.new(currentServiceId, accounts);
    const value = "xyz";
    const key = BytesBlob.blobFromString(value);
    const { registers, memory } = prepareRegsAndMemory(key, value.length);

    // serviceId out of range
    registers.set(SERVICE_ID_REG, tryAsU64(2n ** 32n));

    const result = await read.execute(gas, registers, memory);

    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(SERVICE_ID_REG), HostCallResult.NONE);
  });

  it("should handle missing value", async () => {
```

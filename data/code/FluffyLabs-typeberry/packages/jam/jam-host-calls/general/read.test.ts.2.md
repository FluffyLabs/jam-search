---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/read.test.ts#L181-L231
title: packages/jam/jam-host-calls/general/read.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 3
content_sha: 429516809487e223a51309315294ccd317ad516d8c606ebc3bce7df5c44b8248
language: typescript
---
`packages/jam/jam-host-calls/general/read.test.ts` (lines 181–231)

```typescript
    const result = await read.execute(gas, registers, memory);

    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(SERVICE_ID_REG), HostCallResult.NONE);
  });

  it("should handle missing value", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const accounts = new TestAccounts(currentServiceId);
    const read = Read.new(currentServiceId, accounts);
    const serviceId = tryAsServiceId(10_000);
    const value = "xyz";
    const key = BytesBlob.blobFromString(value);
    const { registers, memory, readResult } = prepareRegsAndMemory(key, value.length);
    accounts.storage.set(null, serviceId, asOpaqueType(key));

    const result = await read.execute(gas, registers, memory);

    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.NONE);
    assert.deepStrictEqual(readResult().toString(), "0x000000");
  });

  it("should fail if there is no memory for key", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const accounts = new TestAccounts(currentServiceId);
    const read = Read.new(currentServiceId, accounts);
    const serviceId = tryAsServiceId(10_000);
    const value = "xyz";
    const key = BytesBlob.blobFromString(value);
    const { registers, memory } = prepareRegsAndMemory(key, value.length, { skipKey: true });
    accounts.storage.set(BytesBlob.blobFromString("hello world"), serviceId, asOpaqueType(key));

    const result = await read.execute(gas, registers, memory);
    assert.deepStrictEqual(result, PvmExecution.Panic);
  });

  it("should fail if there is no memory for result", async () => {
    const currentServiceId = tryAsServiceId(10_000);
    const accounts = new TestAccounts(currentServiceId);
    const read = Read.new(currentServiceId, accounts);
    const serviceId = tryAsServiceId(10_000);
    const value = "xyz";
    const key = BytesBlob.blobFromString(value);
    const { registers, memory } = prepareRegsAndMemory(key, value.length, { skipValue: true });
    accounts.storage.set(BytesBlob.blobFromString("hello world"), serviceId, asOpaqueType(key));

    const result = await read.execute(gas, registers, memory);
    assert.deepStrictEqual(result, PvmExecution.Panic);
  });
});
```

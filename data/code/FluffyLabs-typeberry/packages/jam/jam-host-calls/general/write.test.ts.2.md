---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/write.test.ts#L184-L215
title: packages/jam/jam-host-calls/general/write.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 39edfa2eedfb9498c8c63319a7b18b20f5ceede7a94370f9d987928e61611c2e
language: typescript
---
`packages/jam/jam-host-calls/general/write.test.ts` (lines 184–215)

```typescript
    const key = BytesBlob.blobFromString("xyz");
    const { registers, memory } = prepareRegsAndMemory(key, BytesBlob.blobFromString("hello world!"));
    registers.set(DEST_LEN_REG, tryAsU64(PAGE_SIZE + 1));

    // when
    const result = await write.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accounts.storage.data.size, 0);
  });

  it("should handle storage full when low balance in the account", async () => {
    const serviceId = tryAsServiceId(10_000);
    const accounts = prepareAccounts(serviceId, { balance: 100n });
    const write = Write.new(serviceId, accounts);
    const key = BytesBlob.blobFromString("imma key");
    const { registers, memory } = prepareRegsAndMemory(
      key,
      BytesBlob.blobFromString("hello world! Is super long very very very."),
    );
    accounts.storage.set(BytesBlob.blobFromString("old data"), serviceId, asOpaqueType(key));

    // when
    const result = await write.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.FULL);
    assert.deepStrictEqual(accounts.storage.data.size, 1);
  });
});
```

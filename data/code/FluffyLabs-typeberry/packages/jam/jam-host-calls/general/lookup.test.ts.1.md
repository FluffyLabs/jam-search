---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/general/lookup.test.ts#L100-L181
title: packages/jam/jam-host-calls/general/lookup.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 18b422d3cedb3d6d7f466be4a64382595126e17a3125fd92a88e4aa1061fe0aa
language: typescript
---
`packages/jam/jam-host-calls/general/lookup.test.ts` (lines 100–181)

```typescript
    const result = await lookup.execute(gas, registers, memory);

    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(SERVICE_ID_REG), HostCallResult.NONE);
  });

  it("should fail on page fault if memory isn't readable", async () => {
    const currentServiceId = tryAsServiceId(15_000);
    const accounts = new TestAccounts(currentServiceId);
    const lookup = Lookup.new(currentServiceId, accounts);
    const serviceId = tryAsServiceId(10_000);
    const { registers, memory: emptyMemory } = prepareRegsAndMemory(serviceId, HASH, {
      skipKey: true,
    });

    const result = await lookup.execute(gas, registers, emptyMemory);

    assert.deepStrictEqual(result, PvmExecution.Panic);
  });

  it("should fail on page fault if destination memory is not writable", async () => {
    const currentServiceId = tryAsServiceId(15_000);
    const accounts = new TestAccounts(currentServiceId);
    const lookup = Lookup.new(currentServiceId, accounts);
    const serviceId = tryAsServiceId(10_000);
    const { registers, memory: emptyMemory } = prepareRegsAndMemory(serviceId, HASH, {
      skipValue: true,
      preimageLength: 1,
    });

    accounts.preimages.set(PREIMAGE_BLOB, serviceId, HASH);
    const result = await lookup.execute(gas, registers, emptyMemory);

    assert.deepStrictEqual(result, PvmExecution.Panic);
  });

  describe("should lookup key from an account", () => {
    it("without offset", async () => {
      const currentServiceId = tryAsServiceId(15_000);
      const accounts = new TestAccounts(currentServiceId);
      const lookup = Lookup.new(currentServiceId, accounts);
      const serviceId = tryAsServiceId(10_000);
      const preimageLength = 5;
      const { registers, memory } = prepareRegsAndMemory(serviceId, HASH, { preimageLength });

      accounts.preimages.set(PREIMAGE_BLOB, serviceId, HASH);

      const result = await lookup.execute(gas, registers, memory);
      assert.deepStrictEqual(result, undefined);

      const resultBlob = Bytes.zero(preimageLength);
      const readResult = memory.loadInto(resultBlob.raw, tryAsU64(DESTINATION_MEM_ADDRESS));
      assert.strictEqual(readResult.isOk, true);
      assert.deepStrictEqual(resultBlob.asText(), "hello");
      assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64("hello world".length));
    });

    it("with offset", async () => {
      const currentServiceId = tryAsServiceId(15_000);
      const accounts = new TestAccounts(currentServiceId);
      const lookup = Lookup.new(currentServiceId, accounts);
      const serviceId = tryAsServiceId(10_000);
      const preimageLength = 5;
      const preimageOffset = 6;
      const { registers, memory } = prepareRegsAndMemory(serviceId, HASH, {
        preimageLength,
        preimageOffset,
      });

      accounts.preimages.set(PREIMAGE_BLOB, serviceId, HASH);

      const result = await lookup.execute(gas, registers, memory);
      assert.deepStrictEqual(result, undefined);

      const resultBlob = Bytes.zero(preimageLength);
      const readResult = memory.loadInto(resultBlob.raw, tryAsU64(DESTINATION_MEM_ADDRESS));
      assert.strictEqual(readResult.isOk, true);
      assert.deepStrictEqual(resultBlob.asText(), "world");
      assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64("hello world".length));
    });
  });
});
```

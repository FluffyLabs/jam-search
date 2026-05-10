---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/historical-lookup.test.ts#L91-L193
title: packages/jam/jam-host-calls/refine/historical-lookup.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 3
content_sha: 8be6fa70f933c5ad84b4534d4baf74e102d4a6516ca2a34c6898c94ad62fe854
language: typescript
---
`packages/jam/jam-host-calls/refine/historical-lookup.test.ts` (lines 91–193)

```typescript
    // when
    const result = await lookup.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(data.length));
    assert.deepStrictEqual(readResult().toString(), "0x68656c");
  });

  it("should lookup key longer than destination + offset", async () => {
    const refine = new TestRefineExt();
    const lookup = HistoricalLookup.new(refine);
    const serviceId = tryAsServiceId(10_000);
    const hash = Bytes.fill(32, 3);
    const data = "hello world";
    const { registers, memory, readResult } = prepareRegsAndMemory(serviceId, hash, 4, 3);
    refine.historicalLookupData.set(BytesBlob.blobFromString(data), serviceId, hash);

    // when
    const result = await lookup.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(data.length));
    assert.deepStrictEqual(readResult().toString(), "0x6f2077");
  });

  it("should handle missing value", async () => {
    const refine = new TestRefineExt();
    const lookup = HistoricalLookup.new(refine);
    const serviceId = tryAsServiceId(10_000);
    const hash = Bytes.fill(32, 3);
    const { registers, memory, readResult } = prepareRegsAndMemory(serviceId, hash, 0, 32);
    refine.historicalLookupData.set(null, serviceId, hash);

    // when
    const result = await lookup.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.NONE);
    assert.deepStrictEqual(
      readResult().toString(),
      "0x0000000000000000000000000000000000000000000000000000000000000000",
    );
  });

  it("should panic if no memory for key", async () => {
    const refine = new TestRefineExt();
    const lookup = HistoricalLookup.new(refine);
    const serviceId = tryAsServiceId(10_000);
    const hash = Bytes.fill(32, 3);
    const { registers, memory } = prepareRegsAndMemory(serviceId, hash, 0, 32, { skipHash: true });

    // when
    const result = await lookup.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(serviceId));
  });

  it("should panic if memory is not writable", async () => {
    const refine = new TestRefineExt();
    const lookup = HistoricalLookup.new(refine);
    const serviceId = tryAsServiceId(10_000);
    const hash = Bytes.fill(32, 3);
    const data = "hello world";
    const { registers, memory } = prepareRegsAndMemory(serviceId, hash, 0, 32, { writableMemory: false });
    refine.historicalLookupData.set(BytesBlob.blobFromString(data), serviceId, hash);

    // when
    const result = await lookup.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(serviceId));
  });

  it("should handle if the destination length is greater than data length", async () => {
    const refine = new TestRefineExt();
    const lookup = HistoricalLookup.new(refine);
    const serviceId = tryAsServiceId(10_000);
    const hash = Bytes.fill(32, 3);
    const data = "hello world";
    const { registers, memory, readResult } = prepareRegsAndMemory(serviceId, hash, 0, 32);
    refine.historicalLookupData.set(BytesBlob.blobFromString(data), serviceId, hash);
    registers.set(DEST_LEN_REG, tryAsU64(PAGE_SIZE + 1));

    // when
    const result = await lookup.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(data.length));
    assert.deepStrictEqual(
      readResult().toString(),
      "0x68656c6c6f20776f726c64000000000000000000000000000000000000000000",
    );
  });

  it("should panic if the destination is beyond mem limit", async () => {
    const refine = new TestRefineExt();
```

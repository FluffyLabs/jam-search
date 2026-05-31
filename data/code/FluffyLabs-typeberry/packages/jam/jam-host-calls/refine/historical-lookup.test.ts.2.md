---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/historical-lookup.test.ts#L188-L227
title: packages/jam/jam-host-calls/refine/historical-lookup.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 918ce082e00f5bd8fcedbf2e9895368e5d1ae8286ea70a839c4ce3fca5b24363
language: typescript
---
`packages/jam/jam-host-calls/refine/historical-lookup.test.ts` (lines 188–227)

```typescript
      "0x68656c6c6f20776f726c64000000000000000000000000000000000000000000",
    );
  });

  it("should panic if the destination is beyond mem limit", async () => {
    const refine = new TestRefineExt();
    const lookup = HistoricalLookup.new(refine);
    const serviceId = tryAsServiceId(10_000);
    const hash = Bytes.fill(32, 3);
    const data = "hello world";
    const { registers, memory } = prepareRegsAndMemory(serviceId, hash, 0, 32);
    refine.historicalLookupData.set(BytesBlob.blobFromString(data), serviceId, hash);
    registers.set(DEST_START_REG, tryAsU64(2 ** 32 - 1));
    registers.set(DEST_LEN_REG, tryAsU64(2 ** 10));

    // when
    const result = await lookup.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(serviceId));
  });

  it("should handle 0-length destination", async () => {
    const refine = new TestRefineExt();
    const lookup = HistoricalLookup.new(refine);
    const serviceId = tryAsServiceId(10_000);
    const hash = Bytes.fill(32, 3);
    const data = "hello world";
    const { registers, memory } = prepareRegsAndMemory(serviceId, hash, 0, 0);
    refine.historicalLookupData.set(BytesBlob.blobFromString(data), serviceId, hash);

    // when
    const result = await lookup.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), tryAsU64(data.length));
  });
});
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/solicit.test.ts#L93-L133
title: packages/jam/jam-host-calls/accumulate/solicit.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: a186ea31265b4d95a2b12f76d974f2459baca30f87e7a75b5448eb594dbcb30f
language: typescript
---
`packages/jam/jam-host-calls/accumulate/solicit.test.ts` (lines 93–133)

```typescript
    assert.deepStrictEqual(accumulate.requestPreimageData, [[Bytes.fill(HASH_SIZE, 0x69), 4_096n]]);
  });

  it("should fail if already available", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const solicit = Solicit.new(currentServiceId, accumulate);

    accumulate.requestPreimageResponse = Result.error(
      RequestPreimageError.AlreadyAvailable,
      () => "Test: preimage already available for solicit",
    );
    const { registers, memory } = prepareRegsAndMemory(Bytes.fill(HASH_SIZE, 0x69).asOpaque(), tryAsU64(4_096));

    // when
    await solicit.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.HUH);
    assert.deepStrictEqual(accumulate.requestPreimageData, [[Bytes.fill(HASH_SIZE, 0x69), 4_096n]]);
  });

  it("should fail if balance too low", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const solicit = Solicit.new(currentServiceId, accumulate);

    accumulate.requestPreimageResponse = Result.error(
      RequestPreimageError.InsufficientFunds,
      () => "Test: insufficient funds for solicit",
    );
    const { registers, memory } = prepareRegsAndMemory(Bytes.fill(HASH_SIZE, 0x69).asOpaque(), tryAsU64(4_096));

    // when
    await solicit.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.FULL);
    assert.deepStrictEqual(accumulate.requestPreimageData, [[Bytes.fill(HASH_SIZE, 0x69), 4_096n]]);
  });
});
```

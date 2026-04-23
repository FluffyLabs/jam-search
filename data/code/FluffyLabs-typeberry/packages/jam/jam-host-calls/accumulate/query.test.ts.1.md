---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/query.test.ts#L97-L198
title: packages/jam/jam-host-calls/accumulate/query.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 3
content_sha: fe6e24990ca305186bf0a869c6076fc57d5cdc930c2406b8ed879cee527fcee6
language: typescript
---
`packages/jam/jam-host-calls/accumulate/query.test.ts` (lines 97–198)

```typescript
    const w8 = tryAsU64(32);
    const data = Bytes.fill(HASH_SIZE, 0xaa).asOpaque();
    const status: PreimageStatus = {
      status: PreimageStatusKind.Requested,
    };
    accumulate.checkPreimageStatusResponse = status;

    const { registers, memory } = prepareRegsAndMemory(tryAsU32(Number(w7)), tryAsU32(Number(w8)), data);

    // when
    const result = await query.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), 0n);
    assert.deepStrictEqual(registers.get(RESULT_REG_2), 0n);
    assert.deepStrictEqual(accumulate.checkPreimageStatusData, [[Bytes.fill(HASH_SIZE, 0xaa), w8]]);
  });

  it("should return available if preimage is available", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const query = Query.new(currentServiceId, accumulate);

    const w7 = tryAsU64(2 ** 16);
    const w8 = tryAsU64(32);
    const data = Bytes.fill(HASH_SIZE, 0xaa).asOpaque();
    const timeslot1 = tryAsTimeSlot(0x1234);

    const status: PreimageStatus = {
      status: PreimageStatusKind.Available,
      data: [timeslot1],
    };
    accumulate.checkPreimageStatusResponse = status;

    const { registers, memory } = prepareRegsAndMemory(tryAsU32(Number(w7)), tryAsU32(Number(w8)), data);

    // when
    const result = await query.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), (BigInt(timeslot1) << UPPER_BITS_SHIFT) + 1n);
    assert.deepStrictEqual(registers.get(RESULT_REG_2), 0n);
    assert.deepStrictEqual(accumulate.checkPreimageStatusData, [[Bytes.fill(HASH_SIZE, 0xaa), w8]]);
  });

  it("should return unavailable if preimage is unavailable", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const query = Query.new(currentServiceId, accumulate);

    const w7 = tryAsU64(2 ** 16);
    const w8 = tryAsU64(32);
    const data = Bytes.fill(HASH_SIZE, 0xaa).asOpaque();
    const timeslot1 = tryAsTimeSlot(0x1234);
    const timeslot2 = tryAsTimeSlot(0x5678);

    const status: PreimageStatus = {
      status: PreimageStatusKind.Unavailable,
      data: [timeslot1, timeslot2],
    };
    accumulate.checkPreimageStatusResponse = status;

    const { registers, memory } = prepareRegsAndMemory(tryAsU32(Number(w7)), tryAsU32(Number(w8)), data);

    // when
    const result = await query.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), (BigInt(timeslot1) << UPPER_BITS_SHIFT) + 2n);
    assert.deepStrictEqual(registers.get(RESULT_REG_2), BigInt(timeslot2));
    assert.deepStrictEqual(accumulate.checkPreimageStatusData, [[Bytes.fill(HASH_SIZE, 0xaa), w8]]);
  });

  it("should return reavailable if preimage is reavailable", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const query = Query.new(currentServiceId, accumulate);

    const w7 = tryAsU64(2 ** 16);
    const w8 = tryAsU64(32);
    const data = Bytes.fill(HASH_SIZE, 0xaa).asOpaque();
    const timeslot1 = tryAsTimeSlot(0x1234);
    const timeslot2 = tryAsTimeSlot(0x5678);
    const timeslot3 = tryAsTimeSlot(0x9abc);

    const status: PreimageStatus = {
      status: PreimageStatusKind.Reavailable,
      data: [timeslot1, timeslot2, timeslot3],
    };
    accumulate.checkPreimageStatusResponse = status;

    const { registers, memory } = prepareRegsAndMemory(tryAsU32(Number(w7)), tryAsU32(Number(w8)), data);

    // when
    const result = await query.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), (BigInt(timeslot1) << UPPER_BITS_SHIFT) + 3n);
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/transfer.test.ts#L98-L204
title: packages/jam/jam-host-calls/accumulate/transfer.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 5a0833988bd1ecf8b683d9eacdad8367be1cf23afa0f65eb890835f4ebafc80b
language: typescript
---
`packages/jam/jam-host-calls/accumulate/transfer.test.ts` (lines 98–204)

```typescript
    const expectedGas = 8_990n;

    // when
    gas.sub(basicGasCost);
    await transfer.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    assert.deepStrictEqual(accumulate.transferData, [[15_000, 2n ** 45n, 1_000n, Bytes.fill(TRANSFER_MEMO_BYTES, 33)]]);
    assert.deepStrictEqual(gas.get(), expectedGas);
  });

  itPost072("should OOG if gas is too low", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const transfer = Transfer.new(currentServiceId, accumulate);

    const { registers, memory } = prepareRegsAndMemory(
      tryAsServiceId(15_000),
      tryAsU64(2n ** 45n),
      tryAsU64(1_000n),
      Bytes.fill(TRANSFER_MEMO_BYTES, 33),
    );

    const gas = gasCounter(tryAsGas(1_000));
    const basicGasCost =
      typeof transfer.basicGasCost === "number" ? transfer.basicGasCost : transfer.basicGasCost(registers);
    const expectedGas = 0n;

    // when
    gas.sub(basicGasCost);
    const result = await transfer.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.OOG);
    assert.deepStrictEqual(accumulate.transferData, [[15_000, 2n ** 45n, 1_000n, Bytes.fill(TRANSFER_MEMO_BYTES, 33)]]);
    assert.deepStrictEqual(gas.get(), expectedGas);
  });

  it("should fail if there is no memory for memo", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const transfer = Transfer.new(currentServiceId, accumulate);

    const { registers, memory } = prepareRegsAndMemory(
      tryAsServiceId(15_000),
      tryAsU64(2n ** 45n),
      tryAsU64(1_000n),
      Bytes.fill(TRANSFER_MEMO_BYTES, 33),
      { skipMemo: true },
    );

    const gas = gasCounter(tryAsGas(10_000));
    const basicGasCost =
      typeof transfer.basicGasCost === "number" ? transfer.basicGasCost : transfer.basicGasCost(registers);
    const expectedGas = Compatibility.isGreaterOrEqual(GpVersion.V0_7_2) ? 9_990n : 8_990n;

    // when
    gas.sub(basicGasCost);
    const result = await transfer.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(accumulate.transferData, []);
    assert.deepStrictEqual(gas.get(), expectedGas);
  });

  it("should fail if gas is too low", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const transfer = Transfer.new(currentServiceId, accumulate);

    const { registers, memory } = prepareRegsAndMemory(
      tryAsServiceId(15_000),
      tryAsU64(2n ** 45n),
      tryAsU64(1_000n),
      Bytes.fill(TRANSFER_MEMO_BYTES, 33),
    );

    const gas = gasCounter(tryAsGas(10_000));
    const basicGasCost =
      typeof transfer.basicGasCost === "number" ? transfer.basicGasCost : transfer.basicGasCost(registers);
    const expectedGas = Compatibility.isGreaterOrEqual(GpVersion.V0_7_2) ? 9_990n : 8_990n;

    // when
    gas.sub(basicGasCost);
    accumulate.transferReturnValue = Result.error(TransferError.GasTooLow, () => "Test: gas too low for transfer");
    await transfer.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.LOW);
    assert.deepStrictEqual(
      accumulate.transferData,
      Compatibility.isGreaterOrEqual(GpVersion.V0_7_2)
        ? [[15_000, 2n ** 45n, 0n, Bytes.fill(TRANSFER_MEMO_BYTES, 33)]]
        : [[15_000, 2n ** 45n, 1_000n, Bytes.fill(TRANSFER_MEMO_BYTES, 33)]],
    );
    assert.deepStrictEqual(gas.get(), expectedGas);
  });

  it("should fail if amount is too big", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const transfer = Transfer.new(currentServiceId, accumulate);

    const { registers, memory } = prepareRegsAndMemory(
      tryAsServiceId(15_000),
```

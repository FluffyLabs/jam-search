---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/transfer.test.ts#L200-L270
title: packages/jam/jam-host-calls/accumulate/transfer.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 3
content_sha: 133a94624542b70339f4aa5b474903381959bc4a56732d7f301803b5b1cd9a57
language: typescript
---
`packages/jam/jam-host-calls/accumulate/transfer.test.ts` (lines 200–270)

```typescript
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
    accumulate.transferReturnValue = Result.error(
      TransferError.BalanceBelowThreshold,
      () => "Test: balance below threshold for transfer",
    );
    await transfer.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.CASH);
    assert.deepStrictEqual(
      accumulate.transferData,
      Compatibility.isGreaterOrEqual(GpVersion.V0_7_2)
        ? [[15_000, 2n ** 45n, 0n, Bytes.fill(TRANSFER_MEMO_BYTES, 33)]]
        : [[15_000, 2n ** 45n, 1_000n, Bytes.fill(TRANSFER_MEMO_BYTES, 33)]],
    );
    assert.deepStrictEqual(gas.get(), expectedGas);
  });

  it("should fail if destination does not exist", async () => {
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
    accumulate.transferReturnValue = Result.error(
      TransferError.DestinationNotFound,
      () => "Test: destination not found for transfer",
    );
    await transfer.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
    assert.deepStrictEqual(
      accumulate.transferData,
      Compatibility.isGreaterOrEqual(GpVersion.V0_7_2)
        ? [[15_000, 2n ** 45n, 0n, Bytes.fill(TRANSFER_MEMO_BYTES, 33)]]
        : [[15_000, 2n ** 45n, 1_000n, Bytes.fill(TRANSFER_MEMO_BYTES, 33)]],
    );

    assert.deepStrictEqual(gas.get(), expectedGas);
  });
});
```

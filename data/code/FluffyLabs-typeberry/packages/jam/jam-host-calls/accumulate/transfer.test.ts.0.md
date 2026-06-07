---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/accumulate/transfer.test.ts#L1-L105
title: packages/jam/jam-host-calls/accumulate/transfer.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 8f05859fe42fead3bb680f757dc0474844eaa9001c6a6e8f19bd6f1b6d034c23
language: typescript
---
`packages/jam/jam-host-calls/accumulate/transfer.test.ts` (lines 1–105)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { type ServiceId, tryAsServiceId } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { tryAsU64, type U64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { MemoryBuilder } from "@typeberry/pvm-interpreter";
import { gasCounter } from "@typeberry/pvm-interpreter/gas.js";
import { tryAsMemoryIndex } from "@typeberry/pvm-interpreter/memory/index.js";
import { tryAsSbrkIndex } from "@typeberry/pvm-interpreter/memory/memory-index.js";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/spi-decoder/memory-conts.js";
import { Compatibility, GpVersion, Result } from "@typeberry/utils";
import { TRANSFER_MEMO_BYTES, TransferError } from "../externalities/partial-state.js";
import { PartialStateMock } from "../externalities/partial-state-mock.js";
import { HostCallResult } from "../general/results.js";
import { Transfer } from "./transfer.js";

const RESULT_REG = 7;
const DESTINATION_REG = 7;
const AMOUNT_REG = 8; // `a`
const ON_TRANSFER_GAS_REG = 9; // `l`
const MEMO_START_REG = 10; // `o`

function prepareRegsAndMemory(
  destination: ServiceId,
  amount: U64,
  gas: U64,
  memo: Bytes<TRANSFER_MEMO_BYTES>,
  { skipMemo = false }: { skipMemo?: boolean } = {},
) {
  const memStart = 2 ** 16;
  const registers = HostCallRegisters.empty();
  registers.set(DESTINATION_REG, tryAsU64(destination));
  registers.set(AMOUNT_REG, amount);
  registers.set(ON_TRANSFER_GAS_REG, gas);
  registers.set(MEMO_START_REG, tryAsU64(memStart));

  const builder = new MemoryBuilder();
  if (!skipMemo) {
    builder.setReadablePages(tryAsMemoryIndex(memStart), tryAsMemoryIndex(memStart + PAGE_SIZE), memo.raw);
  }

  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));
  return {
    registers,
    memory,
  };
}

describe("HostCalls: Transfer", () => {
  const itPost072 = Compatibility.isGreaterOrEqual(GpVersion.V0_7_2) ? it : it.skip;

  it("should perform a transfer to self?", async () => {
    const accumulate = new PartialStateMock();
    const currentServiceId = tryAsServiceId(10_000);
    const transfer = Transfer.new(currentServiceId, accumulate);

    const { registers, memory } = prepareRegsAndMemory(
      transfer.currentServiceId,
      tryAsU64(2n ** 45n),
      tryAsU64(1_000n),
      Bytes.fill(TRANSFER_MEMO_BYTES, 33),
    );

    const gas = gasCounter(tryAsGas(10_000));
    const basicGasCost =
      typeof transfer.basicGasCost === "number" ? transfer.basicGasCost : transfer.basicGasCost(registers);
    const expectedGas = 8_990n;

    // when
    gas.sub(basicGasCost);
    await transfer.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
    assert.deepStrictEqual(accumulate.transferData, [
      [transfer.currentServiceId, 2n ** 45n, 1_000n, Bytes.fill(TRANSFER_MEMO_BYTES, 33)],
    ]);
    assert.deepStrictEqual(gas.get(), expectedGas);
  });

  it("should perform a transfer to different account", async () => {
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
    const expectedGas = 8_990n;

    // when
    gas.sub(basicGasCost);
    await transfer.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
```

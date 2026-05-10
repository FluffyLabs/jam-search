---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/peek.test.ts#L1-L107
title: packages/jam/jam-host-calls/refine/peek.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: fd88afce2c75f97a59bdae4e631987644a2936346ccf62766462ed282c83b0ac
language: typescript
---
`packages/jam/jam-host-calls/refine/peek.test.ts` (lines 1–107)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsServiceId } from "@typeberry/block";
import { tryAsU64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter, MemoryBuilder, tryAsMemoryIndex, tryAsSbrkIndex } from "@typeberry/pvm-interpreter";
import { OK, Result } from "@typeberry/utils";
import { type MachineId, PeekPokeError, tryAsMachineId } from "../externalities/refine-externalities.js";
import { TestRefineExt } from "../externalities/refine-externalities.test.js";
import { HostCallResult } from "../general/results.js";
import { Peek } from "./peek.js";

const gas = gasCounter(tryAsGas(0));
const RESULT_REG = 7;

function prepareRegsAndMemory(machineId: MachineId, destinationStart: number, sourceStart: number, length: number) {
  const registers = HostCallRegisters.empty();
  registers.set(7, machineId);
  registers.set(8, tryAsU64(destinationStart));
  registers.set(9, tryAsU64(sourceStart));
  registers.set(10, tryAsU64(length));

  const builder = new MemoryBuilder();
  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));

  return {
    registers,
    memory,
  };
}

function prepareTest(result: Result<OK, PeekPokeError>) {
  const refine = new TestRefineExt();
  const peek = Peek.new(refine);
  peek.currentServiceId = tryAsServiceId(10_000);
  const machineId = tryAsMachineId(10_000);
  const destinationStart = 2 ** 16;
  const memoryStart = 2 ** 20;
  const dataLength = 128;
  const { registers, memory } = prepareRegsAndMemory(machineId, destinationStart, memoryStart, dataLength);
  refine.machinePeekData.set(
    result,
    machineId,
    tryAsU64(destinationStart),
    tryAsU64(memoryStart),
    tryAsU64(dataLength),
    memory,
  );

  return {
    peek,
    registers,
    memory,
  };
}

describe("HostCalls: Peek", () => {
  it("should request to copy a piece of memory from a running machine", async () => {
    const { peek, registers, memory } = prepareTest(Result.ok(OK));

    // when
    const result = await peek.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
  });

  it("should return WHO if there is no machine", async () => {
    const { peek, registers, memory } = prepareTest(
      Result.error(PeekPokeError.NoMachine, () => "Test: error occurred"),
    );

    // when
    const result = await peek.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
  });

  it("should return OOB if there is a page fault on machine side", async () => {
    const { peek, registers, memory } = prepareTest(
      Result.error(PeekPokeError.DestinationPageFault, () => "Test: error occurred"),
    );

    // when
    const result = await peek.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OOB);
  });

  it("should panic if there is a page fault on source side", async () => {
    const { peek, registers, memory } = prepareTest(
      Result.error(PeekPokeError.SourcePageFault, () => "Test: error occurred"),
    );

    // when
    const result = await peek.execute(gas, registers, memory);

    // then
    assert.deepStrictEqual(result, PvmExecution.Panic);
  });
});
```

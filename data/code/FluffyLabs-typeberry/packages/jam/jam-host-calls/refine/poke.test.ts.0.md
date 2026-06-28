---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/poke.test.ts#L1-L106
title: packages/jam/jam-host-calls/refine/poke.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: a9473badce5a47f4cfc3d5ffb72fe78f58060d3541a063832cb0b8c0251d987b
language: typescript
---
`packages/jam/jam-host-calls/refine/poke.test.ts` (lines 1–106)

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
import { Poke } from "./poke.js";

const gas = gasCounter(tryAsGas(0));
const RESULT_REG = 7;

function prepareRegsAndMemory(machineId: MachineId, sourceStart: number, destinationStart: number, length: number) {
  const registers = HostCallRegisters.empty();
  registers.set(7, machineId);
  registers.set(8, tryAsU64(sourceStart));
  registers.set(9, tryAsU64(destinationStart));
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
  const poke = Poke.new(refine);
  poke.currentServiceId = tryAsServiceId(10_000);
  const machineId = tryAsMachineId(10_000);
  const memoryStart = 2 ** 20;
  const destinationStart = 2 ** 16;
  const dataLength = 128;
  const { registers, memory } = prepareRegsAndMemory(machineId, memoryStart, destinationStart, dataLength);
  refine.machinePokeData.set(
    result,
    machineId,
    tryAsU64(memoryStart),
    tryAsU64(destinationStart),
    tryAsU64(dataLength),
    memory,
  );

  return {
    poke,
    registers,
    memory,
  };
}

describe("HostCalls: Poke", () => {
  it("should request to copy a piece of memory into a running machine", async () => {
    const { poke, registers, memory } = prepareTest(Result.ok(OK));
    // when
    const result = await poke.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OK);
  });

  it("should return WHO if machine does not exist", async () => {
    const { poke, registers, memory } = prepareTest(
      Result.error(PeekPokeError.NoMachine, () => "Test: error occurred"),
    );

    // when
    const result = await poke.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
  });

  it("should return OOB if there is a page fault on machine side", async () => {
    const { poke, registers, memory } = prepareTest(
      Result.error(PeekPokeError.DestinationPageFault, () => "Test: error occurred"),
    );

    // when
    const result = await poke.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.OOB);
  });

  it("should panic if there is a page fault on source side", async () => {
    const { poke, registers, memory } = prepareTest(
      Result.error(PeekPokeError.SourcePageFault, () => "Test: error occurred"),
    );

    // when
    const result = await poke.execute(gas, registers, memory);

    // then
    assert.strictEqual(result, PvmExecution.Panic);
  });
});
```

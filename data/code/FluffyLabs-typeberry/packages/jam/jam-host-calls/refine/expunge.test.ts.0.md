---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/expunge.test.ts#L1-L74
title: packages/jam/jam-host-calls/refine/expunge.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1a07f095538b4f2514ce5c1616054ce90d61c2b0dccf4dbfaa0015a3e9e9e651
language: typescript
---
`packages/jam/jam-host-calls/refine/expunge.test.ts` (lines 1–74)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsServiceId } from "@typeberry/block";
import { HostCallMemory, HostCallRegisters } from "@typeberry/pvm-host-calls";
import { tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter, MemoryBuilder } from "@typeberry/pvm-interpreter";
import { tryAsMemoryIndex, tryAsSbrkIndex } from "@typeberry/pvm-interpreter/memory/memory-index.js";
import { Result } from "@typeberry/utils";
import {
  type MachineId,
  NoMachineError,
  type ProgramCounter,
  tryAsMachineId,
  tryAsProgramCounter,
} from "../externalities/refine-externalities.js";
import { TestRefineExt } from "../externalities/refine-externalities.test.js";
import { HostCallResult } from "../general/results.js";
import { Expunge } from "./expunge.js";

const gas = gasCounter(tryAsGas(0));
const RESULT_REG = 7;

function prepareRegsAndMemory(machineId: MachineId) {
  const registers = HostCallRegisters.empty();
  registers.set(7, machineId);

  const builder = new MemoryBuilder();
  const memory = HostCallMemory.new(builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0)));

  return {
    registers,
    memory,
  };
}

function prepareTest(result: Result<ProgramCounter, NoMachineError>) {
  const refine = new TestRefineExt();
  const expunge = Expunge.new(refine);
  expunge.currentServiceId = tryAsServiceId(10_000);
  const machineId = tryAsMachineId(10_000);
  const { registers, memory } = prepareRegsAndMemory(machineId);
  refine.machineExpungeData.set(result, machineId);

  return {
    expunge,
    registers,
    memory,
  };
}

describe("HostCalls: Expunge", () => {
  it("should expunge machine and return its program counter", async () => {
    const programCounter = tryAsProgramCounter(0x1234_5678_9abc_def0n);
    const { expunge, registers } = prepareTest(Result.ok(programCounter));

    // when
    const result = await expunge.execute(gas, registers);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), programCounter);
  });

  it("should return WHO if machine unknown", async () => {
    const { expunge, registers } = prepareTest(Result.error(NoMachineError, () => "Test: error occurred"));

    // when
    const result = await expunge.execute(gas, registers);

    // then
    assert.strictEqual(result, undefined);
    assert.deepStrictEqual(registers.get(RESULT_REG), HostCallResult.WHO);
  });
});
```

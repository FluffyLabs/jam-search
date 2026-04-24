---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jam-host-calls/refine/invoke.test.ts#L1-L118
title: packages/jam/jam-host-calls/refine/invoke.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 060fff239bf90d0f80d34b072df598d73f6b318176c64f9a7a8e96345101062e
language: typescript
---
`packages/jam/jam-host-calls/refine/invoke.test.ts` (lines 1–118)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { tryAsServiceId } from "@typeberry/block";
import { Bytes, type BytesBlob } from "@typeberry/bytes";
import { tryAsU64, type U64 } from "@typeberry/numbers";
import { HostCallMemory, HostCallRegisters, PvmExecution } from "@typeberry/pvm-host-calls";
import { Status, tryAsGas } from "@typeberry/pvm-interface";
import { gasCounter, MemoryBuilder } from "@typeberry/pvm-interpreter";
import { RESERVED_NUMBER_OF_PAGES } from "@typeberry/pvm-interpreter/memory/memory-consts.js";
import { tryAsMemoryIndex, tryAsSbrkIndex } from "@typeberry/pvm-interpreter/memory/memory-index.js";
import { PAGE_SIZE } from "@typeberry/pvm-interpreter/spi-decoder/memory-conts.js";
import {
  type MachineId,
  MachineInstance,
  type MachineStatus,
  tryAsMachineId,
} from "../externalities/refine-externalities.js";
import { TestRefineExt } from "../externalities/refine-externalities.test.js";
import { HostCallResult } from "../general/results.js";
import { Invoke } from "./invoke.js";

const gas = gasCounter(tryAsGas(0));
const MACHINE_INDEX_REG = 7;
const RESULT_REG_1 = MACHINE_INDEX_REG;
const DEST_REG = 8;
const RESULT_REG_2 = DEST_REG;
const GAS_REG_SIZE = 112;
const MEM_START = RESERVED_NUMBER_OF_PAGES * PAGE_SIZE;

function prepareRegsAndMemory(
  machineIndex: U64,
  destinationStart: U64,
  data: BytesBlob,
  { registerMemory = true }: { registerMemory?: boolean } = {},
) {
  const registers = HostCallRegisters.empty();
  registers.set(MACHINE_INDEX_REG, machineIndex);
  registers.set(DEST_REG, tryAsU64(destinationStart));

  const memory = HostCallMemory.new(prepareMemory(data, destinationStart, PAGE_SIZE, { registerMemory }));

  return {
    registers,
    memory,
  };
}

function prepareMemory(
  data: BytesBlob,
  address: U64,
  size: number,
  { registerMemory = true }: { registerMemory?: boolean } = {},
) {
  const builder = new MemoryBuilder();
  const addressAsNumber = Number(address);
  if (registerMemory) {
    builder.setWriteablePages(tryAsMemoryIndex(addressAsNumber), tryAsMemoryIndex(addressAsNumber + size), data.raw);
  }
  return builder.finalize(tryAsMemoryIndex(0), tryAsSbrkIndex(0));
}

async function prepareMachine(
  machineStatus: MachineStatus,
  { registerMachine = true }: { registerMachine?: boolean } = {},
): Promise<[TestRefineExt, MachineId]> {
  const refine = new TestRefineExt();
  const machineId = tryAsMachineId(10_000);
  if (registerMachine) {
    refine.machineInvokeData.set(machineId, new MachineInstance());
    refine.machineInvokeStatus = machineStatus;
  }
  return [refine, machineId];
}

describe("HostCalls: Invoke", () => {
  it("should return panic if memory is unwritable", async () => {
    const [refine, machineId] = await prepareMachine(
      {
        status: Status.OK,
      },
      {
        registerMachine: false,
      },
    );

    const invoke = Invoke.new(refine);
    invoke.currentServiceId = tryAsServiceId(10_000);

    const w7 = tryAsU64(machineId);
    const w8 = tryAsU64(MEM_START);
    const code = Bytes.zero(GAS_REG_SIZE);
    const { registers, memory } = prepareRegsAndMemory(w7, w8, code, { registerMemory: false });

    const result = await invoke.execute(gas, registers, memory);

    assert.strictEqual(result, PvmExecution.Panic);
    assert.deepStrictEqual(registers.get(RESULT_REG_1), w7);
    assert.deepStrictEqual(registers.get(RESULT_REG_2), w8);
  });

  it("should return `who` if machine is not found (machine not initialized)", async () => {
    const [refine, machineId] = await prepareMachine(
      {
        status: Status.OK,
      },
      {
        registerMachine: false,
      },
    );

    const invoke = Invoke.new(refine);
    invoke.currentServiceId = tryAsServiceId(10_000);

    const w7 = tryAsU64(machineId);
    const w8 = tryAsU64(MEM_START);
    const code = Bytes.zero(GAS_REG_SIZE);
    const { registers, memory } = prepareRegsAndMemory(w7, w8, code);

```

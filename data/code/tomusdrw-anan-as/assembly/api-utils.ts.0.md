---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/api-utils.ts#L1-L132'
title: assembly/api-utils.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 338771d5d87134f3134f963d8a937680ccf06618674fee826244f41aa6298948
language: typescript
---
`assembly/api-utils.ts` (lines 1–132)

```typescript
import { buildMemory, getAssembly, vmDestroy, vmExecute, vmInit, vmRunOnce } from "./api-internal";
import { InitialChunk, InitialPage, VmInput, VmOutput, VmPause, VmRunOptions } from "./api-types";
import { Gas } from "./gas";
import { Interpreter } from "./interpreter";
import { MaybePageFault, MemoryBuilder } from "./memory";
import { deblob, extractCodeAndMetadata, liftBytes, ProgramCounter } from "./program";
import { NO_OF_REGISTERS, newRegisters, Registers } from "./registers";
import { decodeSpi, StandardProgram } from "./spi";

export enum InputKind {
  Generic = 0,
  SPI = 1,
}

export enum HasMetadata {
  Yes = 0,
  No = 1,
}

class BlockGasCost {
  pc: ProgramCounter = 0;
  gas: Gas = 0;
}

export function getBlockGasCosts(input: u8[], kind: InputKind, withMetadata: HasMetadata): BlockGasCost[] {
  const program = prepareProgram(kind, withMetadata, input, [], [], [], [], 0, true);
  const blockCosts: BlockGasCost[] = [];
  const costs = program.program.gasCosts.codeAndGas;
  for (let n: i32 = 0; n < costs.length; n += 1) {
    const gas = costs[n] >> 8;
    if (gas !== 0) {
      const x = new BlockGasCost();
      x.pc = n;
      x.gas = costs[n];
      blockCosts.push(x);
    }
  }
  return blockCosts;
}

export function disassemble(input: u8[], kind: InputKind, withMetadata: HasMetadata): string {
  const program = prepareProgram(kind, withMetadata, input, [], [], [], [], 0, false);

  let output = "";
  if (withMetadata === HasMetadata.Yes) {
    output = "Metadata: \n";
    output += "0x";
    output += program.metadata.reduce((acc, x) => acc + x.toString(16).padStart(2, "0"), "");
    output += "\n\n";
  }

  output += getAssembly(program.program);

  return output;
}

export function prepareProgram(
  kind: InputKind,
  hasMetadata: HasMetadata,
  program: u8[],
  /** NOTE: ignored in case of SPI. */
  initialRegisters: u64[],
  /** NOTE: ignored in case of SPI. */
  initialPageMap: InitialPage[],
  /** NOTE: ignored in case of SPI. */
  initialMemory: InitialChunk[],
  /** NOTE: ONLY needed for SPI. */
  args: u8[],
  /** Preallocate a bunch of memory pages for faster execution. */
  preallocateMemoryPages: u32,
  /** Compute gas per-block instead of per-instruction. */
  useBlockGas: boolean,
): StandardProgram {
  let code = liftBytes(program);
  let metadata = new Uint8Array(0);

  if (hasMetadata === HasMetadata.Yes) {
    const data = extractCodeAndMetadata(code);
    // @ts-ignore: TS 5.9 Uint8Array generic parameter mismatch
    code = data.code;
    // @ts-ignore: TS 5.9 Uint8Array generic parameter mismatch
    metadata = data.metadata;
  }

  if (kind === InputKind.Generic) {
    const program = deblob(code, useBlockGas);

    const builder = new MemoryBuilder(preallocateMemoryPages);
    const memory = buildMemory(builder, initialPageMap, initialMemory);

    const registers: Registers = newRegisters();
    const safeLen = initialRegisters.length < NO_OF_REGISTERS ? initialRegisters.length : NO_OF_REGISTERS;
    for (let r = 0; r < safeLen; r++) {
      registers[r] = initialRegisters[r];
    }

    const exe: StandardProgram = new StandardProgram(program, memory, registers);
    exe.metadata = metadata;

    return exe;
  }

  if (kind === InputKind.SPI) {
    const exe = decodeSpi(code, liftBytes(args), preallocateMemoryPages);
    exe.metadata = metadata;
    return exe;
  }

  throw new Error(`Unknown kind: ${kind}`);
}

/** Execute PVM program and stop. */
export function runProgram(
  program: StandardProgram,
  initialGas: i64 = 0,
  programCounter: u32 = 0,
  logs: boolean = false,
  dumpMemory: boolean = false,
): VmOutput {
  const vmInput = new VmInput(program.program, program.memory, program.registers);
  vmInput.gas = i64(initialGas);
  vmInput.pc = programCounter;

  const vmOptions = new VmRunOptions();
  vmOptions.logs = logs;
  vmOptions.dumpMemory = dumpMemory;

  return vmRunOnce(vmInput, vmOptions);
}

/** Next available pvm id. */
let nextPvmId: u32 = 0;
```

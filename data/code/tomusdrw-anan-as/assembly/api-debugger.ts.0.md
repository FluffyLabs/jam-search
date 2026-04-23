---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/api-debugger.ts#L1-L154'
title: assembly/api-debugger.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 3
content_sha: 57e9d9a59aa10fef44770ca00bcd7974eeb48c5d63bc1f16e94f1937f30c869b
language: typescript
---
`assembly/api-debugger.ts` (lines 1–154)

```typescript
import { buildMemory } from "./api-internal";
import { InitialChunk, InitialPage } from "./api-types";
import { Decoder } from "./codec";
import { Gas } from "./gas";
import { Interpreter, Status } from "./interpreter";
import { MaybePageFault, MemoryBuilder } from "./memory";
import { Access, PAGE_SIZE } from "./memory-page";
import { deblob, extractCodeAndMetadata, liftBytes } from "./program";
import { NO_OF_REGISTERS, newRegisters, REG_SIZE_BYTES, Registers } from "./registers";
import { decodeSpi } from "./spi";

let interpreter: Interpreter | null = null;

export function resetJAM(
  program: u8[],
  pc: u32,
  initialGas: Gas,
  args: u8[],
  hasMetadata: boolean = false,
  useBlockGas: boolean = false,
): void {
  const code = hasMetadata ? extractCodeAndMetadata(liftBytes(program)).code : liftBytes(program);

  const p = decodeSpi(code, liftBytes(args), 128, useBlockGas);
  const int = new Interpreter(p.program, p.registers, p.memory);
  int.nextPc = <u32>pc;
  int.gas.set(initialGas);

  if (interpreter !== null) {
    (<Interpreter>interpreter).memory.free();
  }

  interpreter = int;
}

export function resetGeneric(
  program: u8[],
  flatRegisters: u8[],
  initialGas: Gas,
  hasMetadata: boolean = false,
  useBlockGas: boolean = false,
): void {
  const code = hasMetadata ? extractCodeAndMetadata(liftBytes(program)).code : liftBytes(program);

  const p = deblob(code, useBlockGas);
  const registers: Registers = newRegisters();
  fillRegisters(registers, flatRegisters);
  const int = new Interpreter(p, registers);
  int.gas.set(initialGas);

  if (interpreter !== null) {
    (<Interpreter>interpreter).memory.free();
  }

  interpreter = int;
}

export function resetGenericWithMemory(
  program: u8[],
  flatRegisters: u8[],
  pageMap: Uint8Array,
  chunks: Uint8Array,
  initialGas: Gas,
  hasMetadata: boolean = false,
  useBlockGas: boolean = false,
): void {
  const code = hasMetadata ? extractCodeAndMetadata(liftBytes(program)).code : liftBytes(program);

  const p = deblob(code, useBlockGas);
  const registers: Registers = newRegisters();
  fillRegisters(registers, flatRegisters);

  const builder = new MemoryBuilder();
  const memory = buildMemory(builder, readPages(pageMap), readChunks(chunks));

  const int = new Interpreter(p, registers, memory);
  int.gas.set(initialGas);

  interpreter = int;
}

export function nextStep(): boolean {
  if (interpreter !== null) {
    const int = <Interpreter>interpreter;
    return int.nextSteps();
  }
  return false;
}

export function nSteps(steps: u32): boolean {
  if (interpreter !== null) {
    const int = <Interpreter>interpreter;
    return int.nextSteps(steps);
  }
  return false;
}

export function getProgramCounter(): u32 {
  if (interpreter === null) {
    return 0;
  }
  const int = <Interpreter>interpreter;
  return u32(int.pc);
}

export function setNextProgramCounter(pc: u32): void {
  if (interpreter === null) {
    return;
  }
  const int = <Interpreter>interpreter;
  int.nextPc = pc;
}

export function getStatus(): u8 {
  if (interpreter === null) {
    return <u8>Status.PANIC;
  }
  const int = <Interpreter>interpreter;
  return <u8>int.status;
}

export function getExitArg(): u32 {
  if (interpreter === null) {
    return 0;
  }
  const int = <Interpreter>interpreter;
  return int.exitCode || 0;
}

export function getGasLeft(): i64 {
  if (interpreter === null) {
    return i64(0);
  }
  const int = <Interpreter>interpreter;
  return int.gas.get();
}

export function setGasLeft(gas: Gas): void {
  if (interpreter !== null) {
    const int = <Interpreter>interpreter;
    int.gas.set(gas);
  }
}

export function getRegisters(): Uint8Array {
  const flat = new Uint8Array(NO_OF_REGISTERS * REG_SIZE_BYTES).fill(0);
  if (interpreter === null) {
    return flat;
  }

  const int = <Interpreter>interpreter;
  for (let i = 0; i < int.registers.length; i++) {
    let val = int.registers[i];
    for (let j = 0; j < REG_SIZE_BYTES; j++) {
```

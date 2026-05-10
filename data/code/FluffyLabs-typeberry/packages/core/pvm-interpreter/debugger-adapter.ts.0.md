---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/debugger-adapter.ts#L1-L100
title: packages/core/pvm-interpreter/debugger-adapter.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 9fe581c14b6db528763cb40f8656736339f27d98645d3bac30d2cc9186b88203
language: typescript
---
`packages/core/pvm-interpreter/debugger-adapter.ts` (lines 1–100)

```typescript
import { Status, tryAsGas } from "@typeberry/pvm-interface";
import { check, safeAllocUint8Array } from "@typeberry/utils";
import { Interpreter } from "./interpreter.js";
import { type Memory, tryAsMemoryIndex } from "./memory/index.js";
import { PAGE_SIZE } from "./memory/memory-consts.js";
import { Registers } from "./registers.js";

export class DebuggerAdapter {
  private readonly pvm: Interpreter;

  static new(useSbrkGas = false) {
    return new DebuggerAdapter(useSbrkGas);
  }

  private constructor(useSbrkGas = false) {
    this.pvm = Interpreter.new({ useSbrkGas });
  }

  resetJAM(jamProgram: Uint8Array, pc: number, gas: bigint, args: Uint8Array, hasMetadata = false) {
    this.pvm.resetJam(jamProgram, args, pc, tryAsGas(gas), hasMetadata);
  }

  resetGeneric(rawProgram: Uint8Array, flatRegisters: Uint8Array, initialGas: bigint) {
    this.pvm.resetGeneric(rawProgram, 0, tryAsGas(initialGas), Registers.fromBytes(flatRegisters));
  }

  reset(rawProgram: Uint8Array, pc: number, gas: bigint, maybeRegisters?: Registers, maybeMemory?: Memory) {
    this.pvm.resetGeneric(rawProgram, pc, tryAsGas(gas), maybeRegisters, maybeMemory);
  }

  getPageDump(pageNumber: number): null | Uint8Array {
    const page = this.pvm.getMemoryPage(pageNumber);

    if (page === null) {
      // page wasn't allocated so we return an empty page
      return safeAllocUint8Array(PAGE_SIZE);
    }

    if (page.length === PAGE_SIZE) {
      // page was allocated and has a proper size so we can simply return it
      return page;
    }

    // page was allocated but it is shorter than PAGE_SIZE so we have to extend it
    const fullPage = safeAllocUint8Array(PAGE_SIZE);
    fullPage.set(page);
    return fullPage;
  }

  setMemory(address: number, value: Uint8Array) {
    this.pvm.memory.storeFrom(tryAsMemoryIndex(address), value);
  }

  getExitArg(): number {
    return this.pvm.getExitParam() ?? 0;
  }

  getStatus(): Status {
    return this.pvm.getStatus();
  }

  nextStep(): boolean {
    return this.pvm.nextStep() === Status.OK;
  }

  nSteps(steps: number): boolean {
    check`${steps >>> 0 > 0} Expected a positive integer got ${steps}`;
    for (let i = 0; i < steps; i++) {
      const isOk = this.nextStep();
      if (!isOk) {
        return false;
      }
    }
    return true;
  }

  getRegisters(): Uint8Array {
    return this.pvm.registers.getAllEncoded();
  }

  setRegisters(registers: Uint8Array) {
    this.pvm.registers.copyFrom(Registers.fromBytes(registers));
  }

  getProgramCounter(): number {
    return this.pvm.getPC();
  }

  setNextProgramCounter(nextPc: number) {
    this.pvm.setNextPC(nextPc);
  }

  getGasLeft(): bigint {
    return BigInt(this.pvm.gas.get());
  }

  setGasLeft(gas: bigint) {
    this.pvm.gas.set(tryAsGas(gas));
  }
}
```

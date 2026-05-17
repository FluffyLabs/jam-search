---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/load-ops.ts#L1-L110
title: packages/core/pvm-interpreter/ops/load-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 2
content_sha: 672987e8da85ae0b108591ce395bb2c98b0020646bc2a62c5187b015099a7958
language: typescript
---
`packages/core/pvm-interpreter/ops/load-ops.ts` (lines 1–110)

```typescript
import type { ExtendedWitdthImmediateDecoder } from "../args-decoder/decoders/extended-with-immediate-decoder.js";
import type { ImmediateDecoder } from "../args-decoder/decoders/immediate-decoder.js";
import type { InstructionResult } from "../instruction-result.js";
import type { Memory } from "../memory/index.js";
import { tryAsMemoryIndex } from "../memory/memory-index.js";
import type { Registers } from "../registers.js";
import { Result } from "../result.js";
import { addWithOverflowU32 } from "./math-utils.js";

const REG_SIZE_BYTES = 8;

export class LoadOps {
  static new(regs: Registers, memory: Memory, instructionResult: InstructionResult) {
    return new LoadOps(regs, memory, instructionResult);
  }

  private constructor(
    private regs: Registers,
    private memory: Memory,
    private instructionResult: InstructionResult,
  ) {}

  loadImmediate(registerIndex: number, immediate: ImmediateDecoder) {
    this.regs.setU64(registerIndex, immediate.getU64());
  }

  loadImmediateU64(registerIndex: number, immediate: ExtendedWitdthImmediateDecoder) {
    this.regs.setU64(registerIndex, immediate.getValue());
  }

  private loadNumber(address: number, registerIndex: number, numberLength: 1 | 2 | 4 | 8) {
    const registerBytes = this.regs.getBytesAsLittleEndian(registerIndex, REG_SIZE_BYTES);
    const loadResult = this.memory.loadInto(registerBytes.subarray(0, numberLength), tryAsMemoryIndex(address));

    if (loadResult.isError) {
      if (loadResult.error.isAccessFault) {
        this.instructionResult.status = Result.FAULT_ACCESS;
      } else {
        this.instructionResult.status = Result.FAULT;
        this.instructionResult.exitParam = address;
      }

      return;
    }

    registerBytes.fill(0, numberLength);
  }

  private loadSignedNumber(address: number, registerIndex: number, numberLength: 1 | 2 | 4) {
    // load all bytes from register to correctly handle the sign.
    const registerBytes = this.regs.getBytesAsLittleEndian(registerIndex, REG_SIZE_BYTES);
    const loadResult = this.memory.loadInto(registerBytes.subarray(0, numberLength), tryAsMemoryIndex(address));

    if (loadResult.isError) {
      if (loadResult.error.isAccessFault) {
        this.instructionResult.status = Result.FAULT_ACCESS;
      } else {
        this.instructionResult.status = Result.FAULT;
        this.instructionResult.exitParam = address;
      }

      return;
    }

    const msb = registerBytes[numberLength - 1] & 0x80;
    if (msb > 0) {
      registerBytes.fill(0xff, numberLength);
    } else {
      registerBytes.fill(0x00, numberLength);
    }
  }

  loadU8(address: number, registerIndex: number) {
    this.loadNumber(address, registerIndex, 1);
  }

  loadU16(address: number, registerIndex: number) {
    this.loadNumber(address, registerIndex, 2);
  }

  loadU32(address: number, registerIndex: number) {
    this.loadNumber(address, registerIndex, 4);
  }

  loadU64(address: number, registerIndex: number) {
    this.loadNumber(address, registerIndex, 8);
  }

  loadI8(address: number, registerIndex: number) {
    this.loadSignedNumber(address, registerIndex, 1);
  }

  loadI16(address: number, registerIndex: number) {
    this.loadSignedNumber(address, registerIndex, 2);
  }

  loadI32(address: number, registerIndex: number) {
    this.loadSignedNumber(address, registerIndex, 4);
  }

  loadIndU8(firstRegisterIndex: number, secondRegisterIndex: number, immediateDecoder: ImmediateDecoder) {
    const address = addWithOverflowU32(this.regs.getLowerU32(secondRegisterIndex), immediateDecoder.getU32());
    this.loadNumber(address, firstRegisterIndex, 1);
  }

  loadIndU16(firstRegisterIndex: number, secondRegisterIndex: number, immediateDecoder: ImmediateDecoder) {
    const address = addWithOverflowU32(this.regs.getLowerU32(secondRegisterIndex), immediateDecoder.getU32());
    this.loadNumber(address, firstRegisterIndex, 2);
  }

```

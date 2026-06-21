---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/interpreter.ts#L1-L102
title: packages/core/pvm-interpreter/interpreter.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 4
content_sha: 422a534f8c37a1ea63241251d0a39f7e8e717f96dc3e0e88da62df8736551724
language: typescript
---
`packages/core/pvm-interpreter/interpreter.ts` (lines 1–102)

```typescript
import { Logger } from "@typeberry/logger";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import { type Gas, type IPvmInterpreter, Status, tryAsGas } from "@typeberry/pvm-interface";
import { ArgsDecoder } from "./args-decoder/args-decoder.js";
import { createResults } from "./args-decoder/args-decoding-results.js";
import { ArgumentType } from "./args-decoder/argument-type.js";
import { instructionArgumentTypeMap } from "./args-decoder/instruction-argument-type-map.js";
import { assemblify } from "./assemblify.js";
import { BasicBlocks } from "./basic-blocks/index.js";
import { gasCounter } from "./gas.js";
import { Instruction } from "./instruction.js";
import { instructionGasMap } from "./instruction-gas-map.js";
import { InstructionResult } from "./instruction-result.js";
import { Memory } from "./memory/index.js";
import { PAGE_SIZE } from "./memory/memory-consts.js";
import { alignToPageSize } from "./memory/memory-utils.js";
import { tryAsPageNumber } from "./memory/pages/page-utils.js";
import {
  BitOps,
  BitRotationOps,
  BooleanOps,
  BranchOps,
  DynamicJumpOps,
  HostCallOps,
  LoadOps,
  MathOps,
  MemoryOps,
  MoveOps,
  NoArgsOps,
  ShiftOps,
  StoreOps,
} from "./ops/index.js";
import {
  NoArgsDispatcher,
  OneImmDispatcher,
  OneOffsetDispatcher,
  OneRegOneExtImmDispatcher,
  OneRegOneImmDispatcher,
  OneRegOneImmOneOffsetDispatcher,
  OneRegTwoImmsDispatcher,
  ThreeRegsDispatcher,
  TwoImmsDispatcher,
  TwoRegsDispatcher,
  TwoRegsOneImmDispatcher,
  TwoRegsOneOffsetDispatcher,
  TwoRegsTwoImmsDispatcher,
} from "./ops-dispatchers/index.js";
import { Program } from "./program.js";
import { JumpTable } from "./program-decoder/jump-table.js";
import { Mask } from "./program-decoder/mask.js";
import { ProgramDecoder } from "./program-decoder/program-decoder.js";
import { Registers } from "./registers.js";
import { Result } from "./result.js";

type InterpreterOptions = {
  useSbrkGas?: boolean;
};

const logger = Logger.new(import.meta.filename, "pvm");

export class Interpreter implements IPvmInterpreter {
  private readonly useSbrkGas: boolean;
  readonly registers = Registers.empty();
  readonly memory = Memory.new();
  gas = gasCounter(tryAsGas(0));
  private code: Uint8Array = new Uint8Array();
  private mask = Mask.empty();
  private pc = 0;
  private argsDecoder: ArgsDecoder;
  private threeRegsDispatcher: ThreeRegsDispatcher;
  private twoRegsOneImmDispatcher: TwoRegsOneImmDispatcher;
  private twoRegsDispatcher: TwoRegsDispatcher;
  private oneRegOneImmOneOffsetDispatcher: OneRegOneImmOneOffsetDispatcher;
  private twoRegsOneOffsetDispatcher: TwoRegsOneOffsetDispatcher;
  private oneOffsetDispatcher: OneOffsetDispatcher;
  private oneRegOneImmDispatcher: OneRegOneImmDispatcher;
  private instructionResult = new InstructionResult();
  private twoImmsDispatcher: TwoImmsDispatcher;
  private oneRegTwoImmsDispatcher: OneRegTwoImmsDispatcher;
  private noArgsDispatcher: NoArgsDispatcher;
  private twoRegsTwoImmsDispatcher: TwoRegsTwoImmsDispatcher;
  private oneImmDispatcher: OneImmDispatcher;
  private oneRegOneExtImmDispatcher: OneRegOneExtImmDispatcher;
  private status = Status.OK;
  private argsDecodingResults = createResults();
  private basicBlocks: BasicBlocks;
  private jumpTable = JumpTable.empty();

  static new(options: InterpreterOptions = {}) {
    return new Interpreter(options);
  }

  private constructor({ useSbrkGas = false }: InterpreterOptions = {}) {
    this.useSbrkGas = useSbrkGas;
    this.argsDecoder = new ArgsDecoder();
    this.basicBlocks = new BasicBlocks();
    const mathOps = MathOps.new(this.registers);
    const shiftOps = ShiftOps.new(this.registers);
    const bitOps = BitOps.new(this.registers);
    const booleanOps = BooleanOps.new(this.registers);
    const moveOps = MoveOps.new(this.registers);
    const branchOps = BranchOps.new(this.registers, this.instructionResult, this.basicBlocks);
```

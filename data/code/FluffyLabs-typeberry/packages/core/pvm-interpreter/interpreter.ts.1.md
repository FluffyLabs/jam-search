---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/interpreter.ts#L99-L190
title: packages/core/pvm-interpreter/interpreter.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 4
content_sha: 3b31e9220c72a4c88206e7c71848837aac91b3e2bd56873fad7020896164d071
language: typescript
---
`packages/core/pvm-interpreter/interpreter.ts` (lines 99–190)

```typescript
    const bitOps = BitOps.new(this.registers);
    const booleanOps = BooleanOps.new(this.registers);
    const moveOps = MoveOps.new(this.registers);
    const branchOps = BranchOps.new(this.registers, this.instructionResult, this.basicBlocks);
    const loadOps = LoadOps.new(this.registers, this.memory, this.instructionResult);
    const storeOps = StoreOps.new(this.registers, this.memory, this.instructionResult);
    const noArgsOps = NoArgsOps.new(this.instructionResult);
    const dynamicJumpOps = DynamicJumpOps.new(this.registers, this.jumpTable, this.instructionResult, this.basicBlocks);
    const hostCallOps = HostCallOps.new(this.instructionResult);
    const memoryOps = MemoryOps.new(this.registers, this.memory, this.instructionResult);
    const bitRotationOps = BitRotationOps.new(this.registers);

    this.threeRegsDispatcher = new ThreeRegsDispatcher(mathOps, shiftOps, bitOps, booleanOps, moveOps, bitRotationOps);
    this.twoRegsOneImmDispatcher = new TwoRegsOneImmDispatcher(
      mathOps,
      shiftOps,
      bitOps,
      booleanOps,
      moveOps,
      storeOps,
      loadOps,
      bitRotationOps,
    );
    this.twoRegsDispatcher = new TwoRegsDispatcher(moveOps, memoryOps, bitOps, bitRotationOps);
    this.oneRegOneImmOneOffsetDispatcher = new OneRegOneImmOneOffsetDispatcher(branchOps, loadOps);
    this.twoRegsOneOffsetDispatcher = new TwoRegsOneOffsetDispatcher(branchOps);
    this.oneOffsetDispatcher = new OneOffsetDispatcher(branchOps);
    this.oneRegOneImmDispatcher = new OneRegOneImmDispatcher(loadOps, storeOps, dynamicJumpOps);
    this.twoImmsDispatcher = new TwoImmsDispatcher(storeOps);
    this.oneRegTwoImmsDispatcher = new OneRegTwoImmsDispatcher(storeOps);
    this.noArgsDispatcher = new NoArgsDispatcher(noArgsOps);
    this.twoRegsTwoImmsDispatcher = new TwoRegsTwoImmsDispatcher(loadOps, dynamicJumpOps);
    this.oneImmDispatcher = new OneImmDispatcher(hostCallOps);
    this.oneRegOneExtImmDispatcher = new OneRegOneExtImmDispatcher(loadOps);
  }

  resetJam(program: Uint8Array, args: Uint8Array, pc: number, gas: Gas, hasMetadata = true) {
    const p = Program.fromSpi(program, args, hasMetadata);
    this.resetGeneric(p.code, pc, gas, p.registers, p.memory);
  }

  resetGeneric(rawProgram: Uint8Array, pc: number, gas: Gas, maybeRegisters?: Registers, maybeMemory?: Memory) {
    const programDecoder = ProgramDecoder.new(rawProgram);
    this.code = programDecoder.getCode();
    this.mask = programDecoder.getMask();
    this.jumpTable.copyFrom(programDecoder.getJumpTable());

    this.pc = pc;
    this.gas = gasCounter(gas);
    this.status = Status.OK;
    this.argsDecoder.reset(this.code, this.mask);
    this.basicBlocks.reset(this.code, this.mask);
    this.instructionResult.reset();

    if (maybeRegisters !== undefined) {
      this.registers.copyFrom(maybeRegisters);
    } else {
      this.registers.reset();
    }

    if (maybeMemory !== undefined) {
      this.memory.copyFrom(maybeMemory);
    } else {
      this.memory.reset();
    }
  }

  dumpProgram() {
    return assemblify(this.code, this.mask);
  }

  runProgram() {
    while (this.nextStep() === Status.OK) {}
  }

  nextStep() {
    // we are being resumed from a host call, assume all good.
    if (this.status === Status.HOST) {
      this.status = Status.OK;
      this.pc = this.instructionResult.nextPc;
      this.instructionResult.reset();
    }

    /**
     * We have two options to handle an invalid instruction:
     * - change status to panic and quit program immediately,
     * - treat the invalid instruction as a regular trap.
     * The difference is that in the second case we don't need any additional condition and gas will be subtracted automagically so this option is implemented
     * Reference: https://graypaper.fluffylabs.dev/#/579bd12/251100251200
     */
    const currentInstruction = this.code[this.pc] ?? Instruction.TRAP;
    const isValidInstruction = Instruction[currentInstruction] !== undefined;
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/interpreter.ts#L187-L286
title: packages/core/pvm-interpreter/interpreter.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 4
content_sha: d7133e582b084038e394d53fb81ab10cb8931e8795075263de3c93627df685ea
language: typescript
---
`packages/core/pvm-interpreter/interpreter.ts` (lines 187–286)

```typescript
     * Reference: https://graypaper.fluffylabs.dev/#/579bd12/251100251200
     */
    const currentInstruction = this.code[this.pc] ?? Instruction.TRAP;
    const isValidInstruction = Instruction[currentInstruction] !== undefined;
    const gasCost = instructionGasMap[currentInstruction] ?? instructionGasMap[Instruction.TRAP];
    const underflow = this.gas.sub(gasCost);
    if (underflow) {
      this.status = Status.OOG;
      return this.status;
    }
    const argsType = instructionArgumentTypeMap[currentInstruction] ?? ArgumentType.NO_ARGUMENTS;
    const argsResult = this.argsDecodingResults[argsType];
    this.argsDecoder.fillArgs(this.pc, argsResult);

    logger.insane`[PC: ${this.pc}] ${Instruction[currentInstruction]}`;

    if (!isValidInstruction) {
      this.instructionResult.status = Result.PANIC;
    } else {
      this.instructionResult.nextPc = this.pc + argsResult.noOfBytesToSkip;

      switch (argsResult.type) {
        case ArgumentType.NO_ARGUMENTS:
          this.noArgsDispatcher.dispatch(currentInstruction);
          break;
        case ArgumentType.ONE_IMMEDIATE:
          this.oneImmDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.ONE_REGISTER_ONE_IMMEDIATE_ONE_OFFSET:
          this.oneRegOneImmOneOffsetDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.TWO_REGISTERS:
          if (this.useSbrkGas && currentInstruction === Instruction.SBRK) {
            const calculateSbrkCost = (length: number) => (alignToPageSize(length) / PAGE_SIZE) * 16;
            const underflow = this.gas.sub(
              tryAsGas(calculateSbrkCost(this.registers.getLowerU32(argsResult.firstRegisterIndex))),
            );
            if (underflow) {
              this.status = Status.OOG;
              return this.status;
            }
          }

          this.twoRegsDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.THREE_REGISTERS:
          this.threeRegsDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.TWO_REGISTERS_ONE_IMMEDIATE:
          this.twoRegsOneImmDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.TWO_REGISTERS_ONE_OFFSET:
          this.twoRegsOneOffsetDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.ONE_OFFSET:
          this.oneOffsetDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.ONE_REGISTER_ONE_IMMEDIATE:
          this.oneRegOneImmDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.TWO_IMMEDIATES:
          this.twoImmsDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.ONE_REGISTER_TWO_IMMEDIATES:
          this.oneRegTwoImmsDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.TWO_REGISTERS_TWO_IMMEDIATES:
          this.twoRegsTwoImmsDispatcher.dispatch(currentInstruction, argsResult);
          break;
        case ArgumentType.ONE_REGISTER_ONE_EXTENDED_WIDTH_IMMEDIATE:
          this.oneRegOneExtImmDispatcher.dispatch(currentInstruction, argsResult);
          break;
      }
    }

    if (this.instructionResult.status !== null) {
      switch (this.instructionResult.status) {
        case Result.FAULT:
          this.status = Status.FAULT;
          break;
        case Result.HALT:
          this.status = Status.HALT;
          break;
        case Result.PANIC:
        case Result.FAULT_ACCESS:
          this.status = Status.PANIC;
          break;
        case Result.HOST:
          this.status = Status.HOST;
          break;
      }
      logger.insane`[PC: ${this.pc}] Status: ${Result[this.instructionResult.status]}`;
      return this.status;
    }

    this.pc = this.instructionResult.nextPc;
    return this.status;
  }

  getPC() {
```

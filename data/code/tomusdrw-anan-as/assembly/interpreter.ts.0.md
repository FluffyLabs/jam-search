---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/interpreter.ts#L1-L137'
title: assembly/interpreter.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 2
content_sha: fa56d6f892bb507e1ec216c14ac7862b7f90381b7d16efdd71d55027bfc70e76
language: typescript
---
`assembly/interpreter.ts` (lines 1–137)

```typescript
import { Args } from "./arguments";
import { GasCounter, gasCounter } from "./gas";
import { INSTRUCTIONS, MISSING_INSTRUCTION } from "./instructions";
import { Outcome, OutcomeData, Result } from "./instructions/outcome";
import { RUN } from "./instructions-exe";
import { Memory, MemoryBuilder } from "./memory";
import { RESERVED_MEMORY } from "./memory-page";
import { portable } from "./portable";
import { BasicBlocks, decodeArguments, JumpTable, Program, ProgramCounter } from "./program";
import { Registers } from "./registers";

export enum Status {
  OK = -1,
  HALT = 0,
  PANIC = 1,
  FAULT = 2,
  HOST = 3,
  OOG = 4,
}

enum DjumpStatus {
  OK = 0,
  HALT = 1,
  PANIC = 2,
}

// @unmanaged
class DjumpResult {
  status: DjumpStatus = DjumpStatus.OK;
  newPc: ProgramCounter = 0;
}

// @unmanaged
class BranchResult {
  isOkay: boolean = false;
  newPc: u32 = 0;
}

export class Interpreter {
  public readonly program: Program;
  public readonly registers: Registers;
  public readonly memory: Memory;
  public readonly gas: GasCounter;
  // TODO [ToDr] consider making this just getters?
  public pc: u32;
  public status: Status;
  public exitCode: u32;
  public nextPc: u32;

  private djumpRes: DjumpResult = new DjumpResult();
  private argsRes: Args = new Args();
  private outcomeRes: OutcomeData = new OutcomeData();
  private branchRes: BranchResult = new BranchResult();

  constructor(program: Program, registers: Registers, memory: Memory = new MemoryBuilder().build(0)) {
    this.program = program;
    this.registers = registers;
    this.memory = memory;
    this.gas = gasCounter(i64(0));
    this.pc = 0;
    this.status = Status.OK;
    this.exitCode = 0;
    this.nextPc = 0;
  }

  nextSteps(nSteps: u32 = 1): boolean {
    // resuming after host call
    if (this.status === Status.HOST) {
      // let's assume all is good and move on :)
      this.status = Status.OK;
      // apply the nextPc, but don't stop, rather continue
      // executing right away.
      this.pc = this.nextPc;
      this.nextPc = -1;
    }

    if (this.status !== Status.OK) {
      return false;
    }

    // TODO [ToDr] Some weird pre-init step for the debugger?
    if (this.nextPc !== -1) {
      this.pc = this.nextPc;
      this.nextPc = -1;
      return true;
    }

    const code = this.program.code;
    const mask = this.program.mask;
    const gasCosts = this.program.gasCosts.codeAndGas;
    const basicBlocks = this.program.basicBlocks;
    const jumpTable = this.program.jumpTable;

    const argsRes = this.argsRes;
    const outcomeRes = this.outcomeRes;

    for (let i: u32 = 0; i < nSteps; i++) {
      // reset some stuff at start
      this.exitCode = 0;
      outcomeRes.result = Result.PANIC;
      outcomeRes.outcome = Outcome.Ok;

      const pc = this.pc;
      // check if we are at the right location
      if (!mask.isInstruction(pc)) {
        // TODO [ToDr] Potential edge case here?
        if (this.gas.sub(MISSING_INSTRUCTION.gas)) {
          this.status = Status.OOG;
        } else {
          this.status = Status.PANIC;
        }
        return false;
      }

      // check gas via pre-computed cost table (per-instruction or per-block)
      const codeAndGas = portable.staticArrayAt(gasCosts, pc);
      const instruction = codeAndGas & 0xff;
      const gasCost = codeAndGas >> 8;
      const iData = <i32>instruction < INSTRUCTIONS.length ? unchecked(INSTRUCTIONS[instruction]) : MISSING_INSTRUCTION;

      if (gasCost > 0 && this.gas.sub(gasCost)) {
        this.status = Status.OOG;
        return false;
      }

      if (iData === MISSING_INSTRUCTION) {
        this.status = Status.PANIC;
        return false;
      }

      // get args and invoke instruction
      const skipBytes = mask.skipBytesToNextInstruction(pc);
      const args = decodeArguments(argsRes, iData.kind, code, pc + 1, skipBytes);

      const exe = unchecked(RUN[instruction]);
      const outcome = exe(outcomeRes, args, this.registers, this.memory);

```

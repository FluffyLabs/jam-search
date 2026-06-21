---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/interpreter.ts#L133-L253
title: assembly/interpreter.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-06-15T09:40:01+02:00'
last_modified: '2026-06-15T09:40:01+02:00'
chunk_index: 1
chunk_total: 2
content_sha: ea14db4bb506c8b5556d1a7ead1099cf17c5a53250b770ecf51df1c4555bef36
language: typescript
---
`assembly/interpreter.ts` (lines 133–253)

```typescript
      const args = decodeArguments(argsRes, iData.kind, code, pc + 1, skipBytes);

      const exe = unchecked(RUN[instruction]);
      const outcome = exe(outcomeRes, args, this.registers, this.memory);

      // Fast path: Ok is the most common outcome (~70%+ of instructions)
      if (outcome.outcome === Outcome.Ok) {
        this.pc += 1 + skipBytes;
        continue;
      }

      switch (outcome.outcome) {
        case Outcome.StaticJump: {
          const branchResult = branch(this.branchRes, basicBlocks, pc, outcome.staticJump);
          if (!branchResult.isOkay) {
            this.status = Status.PANIC;
            return false;
          }

          this.pc = branchResult.newPc;
          continue;
        }
        case Outcome.DynamicJump: {
          const res = dJump(this.djumpRes, jumpTable, outcome.dJump);
          if (res.status === DjumpStatus.HALT) {
            this.status = Status.HALT;
            return false;
          }
          if (res.status === DjumpStatus.PANIC) {
            this.status = Status.PANIC;
            return false;
          }
          const branchResult = branch(this.branchRes, basicBlocks, res.newPc, 0);
          if (!branchResult.isOkay) {
            this.status = Status.PANIC;
            return false;
          }
          this.pc = branchResult.newPc;
          continue;
        }
        case Outcome.Result: {
          if (outcome.result === Result.HOST) {
            this.status = Status.HOST;
            this.exitCode = outcome.exitCode;
            // set the next PC after the host call is called.
            this.nextPc = this.pc + 1 + skipBytes;
            return false;
          }
          if (outcome.result === Result.FAULT) {
            // access to reserved memory should end with a panic.
            if (outcome.exitCode < RESERVED_MEMORY) {
              this.status = Status.PANIC;
            } else {
              this.status = Status.FAULT;
              this.exitCode = outcome.exitCode;
            }
            return false;
          }
          if (outcome.result === Result.FAULT_ACCESS) {
            this.status = Status.PANIC;
            // this.exitCode = outcome.exitCode;
            return false;
          }
          if (outcome.result === Result.PANIC) {
            this.status = Status.PANIC;
            this.exitCode = outcome.exitCode;
            return false;
          }

          throw new Error("Unknown result");
        }
      }
    }

    return true;
  }
}

function branch(r: BranchResult, basicBlocks: BasicBlocks, pc: u32, offset: i32): BranchResult {
  const newPc = pc + offset;
  if (basicBlocks.isStart(newPc)) {
    r.isOkay = true;
    r.newPc = newPc;
  } else {
    r.isOkay = false;
    r.newPc = 0;
  }
  return r;
}

const EXIT = 0xff_ff_00_00;
const JUMP_ALIGMENT_FACTOR = 2;

function dJump(r: DjumpResult, jumpTable: JumpTable, address: u32): DjumpResult {
  if (address === EXIT) {
    r.status = DjumpStatus.HALT;
    return r;
  }
  if (address === 0 || address % JUMP_ALIGMENT_FACTOR !== 0) {
    r.status = DjumpStatus.PANIC;
    return r;
  }

  const index = u32(address / JUMP_ALIGMENT_FACTOR) - 1;
  if (index >= <u32>jumpTable.jumps.length) {
    r.status = DjumpStatus.PANIC;
    return r;
  }

  const newPc: u64 = portable.staticArrayAt(jumpTable.jumps, index);
  if (newPc >= MAX_U32) {
    r.status = DjumpStatus.PANIC;
    return r;
  }

  r.status = DjumpStatus.OK;
  r.newPc = u32(newPc);
  return r;
}

const MAX_U32: u64 = u64(0x1_0000_0000);
```

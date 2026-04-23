---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/instructions/outcome.ts#L1-L79
title: assembly/instructions/outcome.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-22T10:07:05+01:00'
last_modified: '2026-04-22T10:07:05+01:00'
chunk_index: 0
chunk_total: 1
content_sha: a996ed6e13f69288619e3b1302ccdcb6b053148afdcdb4754c1584b24354460c
language: typescript
---
`assembly/instructions/outcome.ts` (lines 1–79)

```typescript
import { Args } from "../arguments";
import { MaybePageFault, Memory } from "../memory";
import { Registers } from "../registers";

export type InstructionRun = (o: OutcomeData, args: Args, registers: Registers, memory: Memory) => OutcomeData;

export enum Result {
  PANIC = 0,
  FAULT = 1,
  FAULT_ACCESS = 2,
  HOST = 3,
}

export enum Outcome {
  Ok = 0,
  StaticJump = 1,
  DynamicJump = 2,
  Result = 3,
}

export class OutcomeData {
  outcome: Outcome = Outcome.Ok;
  staticJump: i32 = 0;
  dJump: u32 = 0;
  result: Result = Result.PANIC;
  exitCode: u32 = 0;

  @inline
  static status(r: OutcomeData, result: Result): OutcomeData {
    r.outcome = Outcome.Result;
    r.result = result;
    return r;
  }

  @inline
  static staticJump(r: OutcomeData, offset: i32): OutcomeData {
    r.outcome = Outcome.StaticJump;
    r.staticJump = offset;
    return r;
  }

  @inline
  static dJump(r: OutcomeData, address: u32): OutcomeData {
    r.outcome = Outcome.DynamicJump;
    r.dJump = address;
    return r;
  }

  @inline
  static ok(r: OutcomeData): OutcomeData {
    // outcome is already pre-set to Ok by the interpreter loop
    return r;
  }

  @inline
  static panic(r: OutcomeData): OutcomeData {
    return OutcomeData.status(r, Result.PANIC);
  }

  @inline
  static hostCall(r: OutcomeData, id: u32): OutcomeData {
    r.outcome = Outcome.Result;
    r.result = Result.HOST;
    r.exitCode = id;
    return r;
  }

  @inline
  static okOrFault(r: OutcomeData, pageFault: MaybePageFault): OutcomeData {
    if (pageFault.isFault) {
      r.outcome = Outcome.Result;
      // not accessible memory does not result in `FAULT`, but rather goes straight to TRAP
      // yet in gas calculations we still subtract 1, unlike TRAP, but like FAULT.
      r.result = pageFault.isAccess ? Result.FAULT_ACCESS : Result.FAULT;
      r.exitCode = pageFault.fault;
    }
    return r;
  }
}
```

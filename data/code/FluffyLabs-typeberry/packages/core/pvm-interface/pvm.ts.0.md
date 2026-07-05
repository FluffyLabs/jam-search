---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interface/pvm.ts#L1-L34
title: packages/core/pvm-interface/pvm.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: f188786fdd136b1c7981d342c4cc5b0577604df6b28ca730f9dc7091930d7c09
language: typescript
---
`packages/core/pvm-interface/pvm.ts` (lines 1–34)

```typescript
import type { U32 } from "@typeberry/numbers";
import type { Gas, IGasCounter } from "./gas.js";
import type { IMemory } from "./memory.js";
import type { IRegisters } from "./registers.js";
import type { Status } from "./status.js";

export interface IPvmInterpreter {
  /** Manipulate gas. */
  readonly gas: IGasCounter;

  /** Manipulate registers. */
  readonly registers: IRegisters;

  /** Manipulate memory. */
  readonly memory: IMemory;

  /** Prepare SPI program to be executed. */
  resetJam(program: Uint8Array, args: Uint8Array, pc: number, gas: Gas): void;

  /** Prepare a generic (non-SPI) program to be executed. */
  resetGeneric(rawProgram: Uint8Array, pc: number, gas: Gas): void;

  /** Execute loaded program. */
  runProgram(): void;

  /** Get current Status. */
  getStatus(): Status;

  /** Get current Program Counter. */
  getPC(): number;

  /** Get exit args. Needed in case of HOST or FAULT. */
  getExitParam(): U32 | null;
}
```

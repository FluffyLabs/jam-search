---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/api-types.ts#L1-L53'
title: assembly/api-types.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1cf3611e067cbb66fe6393c7bbb9cd0c518805f8ef41f28f0c2493a9091185fb
language: typescript
---
`assembly/api-types.ts` (lines 1–53)

```typescript
/** We split out type definitions, because they can't be exported from WASM. */

import { Gas } from "./gas";
import { Status } from "./interpreter";
import { Memory } from "./memory";
import { Access } from "./memory-page";
import { Program } from "./program";
import { Registers } from "./registers";
export class InitialPage {
  address: u32 = 0;
  length: u32 = 0;
  access: Access = Access.None;
}

export class InitialChunk {
  address: u32 = 0;
  data: u8[] = [];
}

export class VmRunOptions {
  logs: boolean = false;
  dumpMemory: boolean = false;
}

export class VmInput {
  pc: u32 = 0;
  gas: Gas = u64(0);

  constructor(
    public readonly program: Program,
    public readonly memory: Memory,
    public readonly registers: Registers,
  ) {}
}

export class VmPause {
  status: Status = Status.OK;
  exitCode: u32 = 0;
  pc: u32 = 0;
  nextPc: u32 = 0;
  gas: Gas = u64(0);
  registers: u64[] = [];
}

export class VmOutput {
  status: Status = Status.OK;
  exitCode: u32 = 0;
  pc: u32 = 0;
  gas: Gas = u64(0);
  result: u8[] = [];
  registers: u64[] = [];
  memory: InitialChunk[] = [];
}
```

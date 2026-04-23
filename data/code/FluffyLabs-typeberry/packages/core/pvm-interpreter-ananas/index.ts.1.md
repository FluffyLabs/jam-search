---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter-ananas/index.ts#L142-L186
title: packages/core/pvm-interpreter-ananas/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 3a82a91a996123c5f751c573f2cea0d3839b5274b8cee450ccfd6c9ec9c9668e
language: typescript
---
`packages/core/pvm-interpreter-ananas/index.ts` (lines 142–186)

```typescript
  resetGeneric(program: Uint8Array, _pc: number, gas: Gas): void {
    const programArr = lowerBytes(program);
    const emptyRegisters = Array(13 * 8).fill(0);
    const pageMap = new Uint8Array();
    const chunks = new Uint8Array();
    this.gas.initialGas = gas;
    this.instance.resetGenericWithMemory(programArr, emptyRegisters, pageMap, chunks, BigInt(gas), false);
  }

  nextStep(): boolean {
    return this.instance.nextStep();
  }

  runProgram(): void {
    // NOTE Setting max value u32 in nNextSteps making ananas running until finished
    // without comming back and forth between JS <-> WASM
    while (this.instance.nSteps(INF_STEPS)) {}
  }

  getStatus(): Status {
    const status = this.instance.getStatus();
    if (status < 0) {
      return Status.OK;
    }
    check`${Status[status] !== undefined} Invalid status returned: ${status}`;
    return status;
  }

  getPC(): number {
    return this.instance.getProgramCounter();
  }

  getExitParam(): U32 | null {
    return tryAsU32(this.instance.getExitArg());
  }
}

/**  Convert `Uint8Array` to `number[]` */
function lowerBytes(data: Uint8Array): number[] {
  const r = new Array<number>(data.length);
  for (let i = 0; i < data.length; i++) {
    r[i] = data[i];
  }
  return r;
}
```

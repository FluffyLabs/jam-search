---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter-ananas/index.ts#L142-L198
title: packages/core/pvm-interpreter-ananas/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: a458a89cde22c228af991dba00f879007a8e049e9173bf6eb025dfcf97b02fba
language: typescript
---
`packages/core/pvm-interpreter-ananas/index.ts` (lines 142–198)

```typescript
    this.instance.resetJAM(programArr, pc, BigInt(gas), argsArr, true, USE_BLOCK_GAS, PAGES_TO_PREALLOCATE);
  }

  resetGeneric(program: Uint8Array, _pc: number, gas: Gas): void {
    const programArr = lowerBytes(program);
    const emptyRegisters = Array(13 * 8).fill(0);
    const pageMap = new Uint8Array();
    const chunks = new Uint8Array();
    this.gas.initialGas = gas;
    this.instance.resetGenericWithMemory(
      programArr,
      emptyRegisters,
      pageMap,
      chunks,
      BigInt(gas),
      false,
      USE_BLOCK_GAS,
      PAGES_TO_PREALLOCATE,
    );
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

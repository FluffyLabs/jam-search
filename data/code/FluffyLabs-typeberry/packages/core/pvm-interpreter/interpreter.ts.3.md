---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/interpreter.ts#L278-L329
title: packages/core/pvm-interpreter/interpreter.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 3
chunk_total: 4
content_sha: a4816b7f64260bc545cb623cf09b5b6789d3250da55435a40fccb981a268e0b6
language: typescript
---
`packages/core/pvm-interpreter/interpreter.ts` (lines 278–329)

```typescript
      logger.insane`[PC: ${this.pc}] Status: ${Result[this.instructionResult.status]}`;
      return this.status;
    }

    this.pc = this.instructionResult.nextPc;
    return this.status;
  }

  getPC() {
    return this.pc;
  }

  setNextPC(nextPc: number) {
    this.pc = nextPc;
  }

  getStatus() {
    return this.status;
  }

  getExitParam(): null | U32 {
    const p = this.instructionResult.exitParam;
    return p !== null ? tryAsU32(p) : p;
  }

  getMemoryPage(pageNumber: number): null | Uint8Array {
    return this.memory.getPageDump(tryAsPageNumber(pageNumber));
  }

  calculateBlockGasCost(): Map<string, number> {
    const codeLength = this.code.length;
    const blocks: Map<string, number> = new Map();
    let currentBlock = "0";
    let gasCost = 0;
    const getNextIstructionIndex = (index: number) => index + 1 + this.mask.getNoOfBytesToNextInstruction(index + 1);

    for (let index = 0; index < codeLength; index = getNextIstructionIndex(index)) {
      const instruction = this.code[index];
      if (this.basicBlocks.isBeginningOfBasicBlock(index)) {
        blocks.set(currentBlock, gasCost);
        currentBlock = index.toString();
        gasCost = 0;
      }

      gasCost += instructionGasMap[instruction];
    }

    blocks.set(currentBlock, gasCost);

    return blocks;
  }
}
```

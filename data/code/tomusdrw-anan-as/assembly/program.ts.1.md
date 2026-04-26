---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/program.ts#L113-L247'
title: assembly/program.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-04-24T09:46:09+02:00'
last_modified: '2026-04-24T09:46:09+02:00'
chunk_index: 1
chunk_total: 4
content_sha: 70cc01c41776893cea1a76890f61da43a9b24a3cb875a101207ca0d71b387ef8
language: typescript
---
`assembly/program.ts` (lines 113–247)

```typescript
   * reach the next instruction (i.e. `skip(i) + 1` from the GP).
   *
   * NOTE: we don't guarantee that `isInstruction()` will return true
   * for the new program counter, since `skip` function is bounded by
   * an upper limit of `24` bytes.
   */
  skipBytesToNextInstruction(i: u32): u32 {
    if (i + 1 < <u32>this.bytesToSkip.length) {
      return portable.staticArrayAt(this.bytesToSkip, i + 1);
    }

    return 0;
  }

  toString(): string {
    let v = "Mask[";
    for (let i = 0; i < this.bytesToSkip.length; i += 1) {
      v += `${this.bytesToSkip[i]}, `;
    }
    return `${v}]`;
  }
}

export class GasCosts {
  // Since code is just u8, we use the other 24 bytes to store the gas cost.
  readonly codeAndGas: StaticArray<u32>;

  constructor(code: Code, mask: Mask, blocks: BasicBlocks, useBlockGasCost: boolean) {
    const len = code.length;
    const costs = new StaticArray<u32>(len);
    for (let n: i32 = 0; n < len; n += 1) {
      const isInstructionInMask = mask.isInstruction(n);
      if (!isInstructionInMask) {
        costs[n] = code[n];
        continue;
      }

      const skipArgs = mask.skipBytesToNextInstruction(n);
      const iData = code[n] >= <u8>INSTRUCTIONS.length ? MISSING_INSTRUCTION : INSTRUCTIONS[code[n]];
      costs[n] = code[n] | (iData.gas << 8);
      n += skipArgs;
    }

    // sum up costs per block
    if (useBlockGasCost) {
      let previousStart: u32 = 0;
      let previousSum: u32 = 0;
      for (let n: i32 = 0; n < len; n += 1) {
        const currentGas = costs[n] >> 8;
        costs[n] = code[n]; // reset to just opcode (gas=0)
        if (blocks.isStart(n)) {
          costs[previousStart] = code[previousStart] | (previousSum << 8);
          previousSum = currentGas;
          previousStart = n;
        } else {
          previousSum += currentGas;
        }

        n += mask.skipBytesToNextInstruction(n);
      }
      // final assignment
      costs[previousStart] = code[previousStart] | (previousSum << 8);
    }

    this.codeAndGas = costs;
  }

  toString(): string {
    let v = "GasCosts[";
    for (let i = 0; i < this.codeAndGas.length; i += 1) {
      const gas = this.codeAndGas[i] >> 8;
      if (gas !== 0) {
        v += `${i} -> ${gas}, `;
      }
    }
    return `${v}]`;
  }
}

export enum BasicBlock {
  NONE = 0,
  START = 2,
  END = 4,
}

/**
 * https://graypaper.fluffylabs.dev/#/cc517d7/23fe0123fe01?v=0.6.5
 */
export class BasicBlocks {
  readonly isStartOrEnd: StaticArray<BasicBlock>;

  constructor(code: Code, mask: Mask) {
    const len = code.length;
    const isStartOrEnd = new StaticArray<BasicBlock>(len);
    if (len > 0) {
      isStartOrEnd[0] = BasicBlock.START;
    }
    for (let n: i32 = 0; n < len; n += 1) {
      // we only track end-blocks for instructions.
      const isInstructionInMask = mask.isInstruction(n);
      if (!isInstructionInMask) {
        continue;
      }

      const skipArgs = mask.skipBytesToNextInstruction(n);
      const iData = code[n] >= <u8>INSTRUCTIONS.length ? MISSING_INSTRUCTION : INSTRUCTIONS[code[n]];
      const isTerminating = iData.isTerminating;

      if (isTerminating) {
        // skip is always 0?
        const newBlockStart = n + 1 + skipArgs;
        // mark the beginning of the next block
        if (newBlockStart < len) {
          isStartOrEnd[newBlockStart] = BasicBlock.START;
        }
        // and mark current instruction as terminating
        isStartOrEnd[n] |= BasicBlock.END;
      }
    }
    this.isStartOrEnd = isStartOrEnd;
  }

  isStart(newPc: u32): boolean {
    if (newPc < <u32>this.isStartOrEnd.length) {
      return (portable.staticArrayAt(this.isStartOrEnd, newPc) & BasicBlock.START) > 0;
    }
    return false;
  }

  toString(): string {
    let v = "BasicBlocks[";
    for (let i = 0; i < this.isStartOrEnd.length; i += 1) {
      let t = "";
      const isStart = (this.isStartOrEnd[i] & BasicBlock.START) > 0;
      t += isStart ? "start" : "";
```

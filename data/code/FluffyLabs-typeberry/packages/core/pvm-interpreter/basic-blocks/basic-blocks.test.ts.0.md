---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/basic-blocks/basic-blocks.test.ts#L1-L106
title: packages/core/pvm-interpreter/basic-blocks/basic-blocks.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 2
content_sha: 8e2782440a0dd2066464b3709cf14a6b4ba25f3e2dcdba4b3eda53fef93c546c
language: typescript
---
`packages/core/pvm-interpreter/basic-blocks/basic-blocks.test.ts` (lines 1–106)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { BitVec } from "@typeberry/bytes";
import { Instruction } from "../instruction.js";
import { Mask } from "../program-decoder/mask.js";
import { BasicBlocks } from "./basic-blocks.js";

describe("BasicBlocks", () => {
  it("should return true for the first instruction even it is a termination block instruction", () => {
    const code = new Uint8Array([Instruction.TRAP]);
    const mask = Mask.new(BitVec.fromBlob(new Uint8Array([0b0000_0001]), code.length));
    const basicBlocks = new BasicBlocks();
    basicBlocks.reset(code, mask);
    const index = 0;

    const result = basicBlocks.isBeginningOfBasicBlock(index);

    assert.strictEqual(result, true);
  });

  it("should return true for the first instruction after a termination block instruction", () => {
    const code = new Uint8Array([Instruction.TRAP, Instruction.ADD_32, 5, 7]);
    const mask = Mask.new(BitVec.fromBlob(new Uint8Array([0b0000_0011]), code.length));
    const basicBlocks = new BasicBlocks();
    basicBlocks.reset(code, mask);
    const index = 1;

    const result = basicBlocks.isBeginningOfBasicBlock(index);

    assert.strictEqual(result, true);
  });

  it("should return false for the second instruction after a termination block instruction", () => {
    const code = new Uint8Array([Instruction.TRAP, Instruction.ADD_32, 5, 7, Instruction.SUB_32, 5, 7]);
    const mask = Mask.new(BitVec.fromBlob(new Uint8Array([0b0001_0011]), code.length));
    const basicBlocks = new BasicBlocks();
    basicBlocks.reset(code, mask);
    const index = 4;

    const result = basicBlocks.isBeginningOfBasicBlock(index);

    assert.strictEqual(result, false);
  });

  it("should return false for a termination block instruction that is not the first instruction in the program", () => {
    const code = new Uint8Array([Instruction.TRAP, Instruction.ADD_32, 5, 7, Instruction.TRAP]);
    const mask = Mask.new(BitVec.fromBlob(new Uint8Array([0b0001_0011]), code.length));
    const basicBlocks = new BasicBlocks();
    basicBlocks.reset(code, mask);
    const index = 4;

    const result = basicBlocks.isBeginningOfBasicBlock(index);

    assert.strictEqual(result, false);
  });

  it("should return true for a beginning of basic block instruction that is not the first instruction after a block termination instruction that has some args", () => {
    const code = new Uint8Array([Instruction.BRANCH_EQ, 135, 25, Instruction.ADD_32, 5, 7, Instruction.TRAP]);
    const mask = Mask.new(BitVec.fromBlob(new Uint8Array([0b0100_1001]), code.length));
    const basicBlocks = new BasicBlocks();
    basicBlocks.reset(code, mask);
    const index = 3;

    const result = basicBlocks.isBeginningOfBasicBlock(index);

    assert.strictEqual(result, true);
  });

  it("should return true for a termination block instruction that is the after a termination instruction", () => {
    const code = new Uint8Array([Instruction.TRAP, Instruction.TRAP]);
    const mask = Mask.new(BitVec.fromBlob(new Uint8Array([0b0000_0011]), code.length));
    const basicBlocks = new BasicBlocks();
    basicBlocks.reset(code, mask);
    const index = 1;

    const result = basicBlocks.isBeginningOfBasicBlock(index);

    assert.strictEqual(result, true);
  });

  it("should return false for a negative number", () => {
    const code = new Uint8Array([Instruction.TRAP, Instruction.TRAP]);
    const mask = Mask.new(BitVec.fromBlob(new Uint8Array([0b0000_0011]), code.length));
    const basicBlocks = new BasicBlocks();
    basicBlocks.reset(code, mask);
    const index = -1;

    const result = basicBlocks.isBeginningOfBasicBlock(index);

    assert.strictEqual(result, false);
  });

  it("should correctly detect basic blocks when distance between instructions is longer than 24", () => {
    const code = new Uint8Array([
      Instruction.TRAP,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
      0,
```

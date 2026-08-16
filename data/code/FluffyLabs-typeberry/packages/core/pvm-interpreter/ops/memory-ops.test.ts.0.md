---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/memory-ops.test.ts#L1-L67
title: packages/core/pvm-interpreter/ops/memory-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 5babd3d5132dcb044fab3e02855dc8ad85add83b16c7ecaea61fb5296a5d9b34
language: typescript
---
`packages/core/pvm-interpreter/ops/memory-ops.test.ts` (lines 1–67)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { MAX_MEMORY_INDEX } from "@typeberry/pvm-interface";
import { InstructionResult } from "../instruction-result.js";
import { Memory, MemoryBuilder } from "../memory/index.js";
import { PAGE_SIZE, RESERVED_NUMBER_OF_PAGES } from "../memory/memory-consts.js";
import { tryAsMemoryIndex, tryAsSbrkIndex } from "../memory/memory-index.js";
import { Registers } from "../registers.js";
import { MemoryOps } from "./memory-ops.js";

describe("MemoryOps", () => {
  function prepareData(pagesToAllocate: number, lengthRegisterValue = PAGE_SIZE) {
    const regs = Registers.empty();
    const memory = Memory.new();
    const instructionResult = new InstructionResult();
    const memoryOps = MemoryOps.new(regs, memory, instructionResult);
    const resultIndex = 1;
    const lengthIndex = 0;
    regs.setU32(lengthIndex, lengthRegisterValue);
    const expectedMemory = new MemoryBuilder()
      .setWriteablePages(
        tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE),
        tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + pagesToAllocate) * PAGE_SIZE),
      )
      .finalize(
        tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + pagesToAllocate) * PAGE_SIZE),
        tryAsSbrkIndex(MAX_MEMORY_INDEX),
      );
    return { regs, memory, expectedMemory, instructionResult, memoryOps, resultIndex, lengthIndex };
  }

  it("should allocate one memory page", () => {
    const pagesToAllocate = 1;
    const { memoryOps, regs, resultIndex, lengthIndex, memory, expectedMemory } = prepareData(pagesToAllocate);

    memoryOps.sbrk(lengthIndex, resultIndex);

    assert.deepEqual(regs.getLowerU32(resultIndex), RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
    assert.deepStrictEqual(memory, expectedMemory);
  });

  it("should allocate two memory pages", () => {
    const pagesToAllocate = 2;
    const { memoryOps, regs, resultIndex, lengthIndex, memory, expectedMemory } = prepareData(
      pagesToAllocate,
      2 * PAGE_SIZE,
    );

    memoryOps.sbrk(lengthIndex, resultIndex);

    assert.deepEqual(regs.getLowerU32(resultIndex), RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);
    assert.deepStrictEqual(memory, expectedMemory);
  });

  it("should allocate two memory pages one by one", () => {
    const pagesToAllocate = 2;
    const { memoryOps, regs, resultIndex, lengthIndex, memory, expectedMemory } = prepareData(pagesToAllocate);

    memoryOps.sbrk(lengthIndex, resultIndex);
    assert.deepEqual(regs.getLowerU32(resultIndex), RESERVED_NUMBER_OF_PAGES * PAGE_SIZE);

    memoryOps.sbrk(lengthIndex, resultIndex);

    assert.deepEqual(regs.getLowerU32(resultIndex), RESERVED_NUMBER_OF_PAGES * PAGE_SIZE + PAGE_SIZE);
    assert.deepStrictEqual(memory, expectedMemory);
  });
});
```

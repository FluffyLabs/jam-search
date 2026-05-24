---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/basic-blocks/basic-blocks.ts#L1-L25
title: packages/core/pvm-interpreter/basic-blocks/basic-blocks.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6a34a8d81144d17a2750874cbb32fdeb5905b4cfa29e8e251e9d9a7f45b99352
language: typescript
---
`packages/core/pvm-interpreter/basic-blocks/basic-blocks.ts` (lines 1–25)

```typescript
import type { Mask } from "../program-decoder/mask.js";
import { terminationInstructions } from "./is-termination-instruction.js";

export class BasicBlocks {
  private basicBlocks: Set<number> = new Set();

  reset(code: Uint8Array, mask: Mask) {
    this.basicBlocks.clear();
    this.basicBlocks.add(0);
    const codeLength = code.length;

    const isBasicBlockTermination = (index: number) =>
      mask.isInstruction(index) && terminationInstructions[code[index]];

    for (let i = 0; i < codeLength; i++) {
      if (mask.isInstruction(i) && isBasicBlockTermination(i)) {
        this.basicBlocks.add(i + 1 + mask.getNoOfBytesToNextInstruction(i + 1));
      }
    }
  }

  isBeginningOfBasicBlock(index: number) {
    return this.basicBlocks.has(index);
  }
}
```

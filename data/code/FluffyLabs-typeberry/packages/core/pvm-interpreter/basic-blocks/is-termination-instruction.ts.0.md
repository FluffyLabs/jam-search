---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/basic-blocks/is-termination-instruction.ts#L1-L36
title: packages/core/pvm-interpreter/basic-blocks/is-termination-instruction.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: df5fb9f22b88ade9c5f73b7a8167d42482a4560ac9838a7ff389bb2052a4cd99
language: typescript
---
`packages/core/pvm-interpreter/basic-blocks/is-termination-instruction.ts` (lines 1–36)

```typescript
import { HIGHEST_INSTRUCTION_NUMBER, Instruction } from "../instruction.js";

export const terminationInstructions = (() => {
  const terminationInstructions = new Array<boolean>(HIGHEST_INSTRUCTION_NUMBER + 1);

  terminationInstructions.fill(false);

  terminationInstructions[Instruction.TRAP] = true;
  terminationInstructions[Instruction.FALLTHROUGH] = true;

  terminationInstructions[Instruction.JUMP] = true;
  terminationInstructions[Instruction.JUMP_IND] = true;

  terminationInstructions[Instruction.LOAD_IMM_JUMP] = true;
  terminationInstructions[Instruction.LOAD_IMM_JUMP_IND] = true;

  terminationInstructions[Instruction.BRANCH_EQ] = true;
  terminationInstructions[Instruction.BRANCH_NE] = true;
  terminationInstructions[Instruction.BRANCH_GE_U] = true;
  terminationInstructions[Instruction.BRANCH_GE_S] = true;
  terminationInstructions[Instruction.BRANCH_LT_U] = true;
  terminationInstructions[Instruction.BRANCH_LT_S] = true;

  terminationInstructions[Instruction.BRANCH_EQ_IMM] = true;
  terminationInstructions[Instruction.BRANCH_NE_IMM] = true;
  terminationInstructions[Instruction.BRANCH_LT_U_IMM] = true;
  terminationInstructions[Instruction.BRANCH_LT_S_IMM] = true;
  terminationInstructions[Instruction.BRANCH_LE_U_IMM] = true;
  terminationInstructions[Instruction.BRANCH_LE_S_IMM] = true;
  terminationInstructions[Instruction.BRANCH_GE_U_IMM] = true;
  terminationInstructions[Instruction.BRANCH_GE_S_IMM] = true;
  terminationInstructions[Instruction.BRANCH_GT_U_IMM] = true;
  terminationInstructions[Instruction.BRANCH_GT_S_IMM] = true;

  return terminationInstructions;
})();
```

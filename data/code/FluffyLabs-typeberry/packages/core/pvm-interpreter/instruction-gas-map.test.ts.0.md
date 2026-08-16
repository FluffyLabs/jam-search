---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/instruction-gas-map.test.ts#L1-L17
title: packages/core/pvm-interpreter/instruction-gas-map.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 223a85b97331ee37c823eaa0b133d7ccbf66583640695c53682dd9954ee29e0b
language: typescript
---
`packages/core/pvm-interpreter/instruction-gas-map.test.ts` (lines 1–17)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { Instruction } from "./instruction.js";
import { instructionGasMap } from "./instruction-gas-map.js";

describe("instructionGasMap", () => {
  const instructions = Object.entries(Instruction).filter(
    (entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number",
  );

  for (const [name, instruction] of instructions) {
    it(`checks if instruction ${name} = ${instruction} is correctly mapped to gas value`, () => {
      const gasValue = instructionGasMap[instruction];
      assert.notEqual(null, gasValue);
    });
  }
});
```

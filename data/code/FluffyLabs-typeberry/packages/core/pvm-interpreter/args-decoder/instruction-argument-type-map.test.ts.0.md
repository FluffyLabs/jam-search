---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.test.ts#L1-L17
title: >-
  packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: fde29ddb17c757ad49ae6baba12396d2ea40a0dc2dffc6d980ffdb5215d61df5
language: typescript
---
`packages/core/pvm-interpreter/args-decoder/instruction-argument-type-map.test.ts` (lines 1–17)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { Instruction } from "../instruction.js";
import { instructionArgumentTypeMap } from "./instruction-argument-type-map.js";

describe("instructionArgumentTypeMap", () => {
  const instructions = Object.entries(Instruction).filter(
    (entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number",
  );

  for (const [name, instruction] of instructions) {
    it(`checks if instruction ${name} = ${instruction} is correctly mapped to arguments type`, () => {
      const argumentsType = instructionArgumentTypeMap[instruction];
      assert.notEqual(null, argumentsType);
    });
  }
});
```

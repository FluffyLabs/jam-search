---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/basic-blocks/is-termination-instruction.test.ts#L1-L17
title: packages/core/pvm-interpreter/basic-blocks/is-termination-instruction.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4689b4e93d9e5b167ede7c94ac5c90fa766065cbdda836eaf00a292f0c81cb2c
language: typescript
---
`packages/core/pvm-interpreter/basic-blocks/is-termination-instruction.test.ts` (lines 1–17)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { Instruction } from "../instruction.js";
import { terminationInstructions } from "./is-termination-instruction.js";

describe("terminationInstructions", () => {
  const instructions = Object.entries(Instruction).filter(
    (entry): entry is [string, number] => typeof entry[0] === "string" && typeof entry[1] === "number",
  );

  for (const [name, instruction] of instructions) {
    it(`should checks if instruction ${name} = ${instruction} is correctly mapped to boolean`, () => {
      const value = terminationInstructions[instruction];
      assert.notEqual(null, value);
    });
  }
});
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/no-args-ops.test.ts#L1-L31
title: packages/core/pvm-interpreter/ops/no-args-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2ff9a3968c7ab7ca49971cdd659bbb5b7816169d56e5e83ccc4abbd96881951a
language: typescript
---
`packages/core/pvm-interpreter/ops/no-args-ops.test.ts` (lines 1–31)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

import { InstructionResult } from "../instruction-result.js";
import { Result } from "../result.js";
import { NoArgsOps } from "./no-args-ops.js";

describe("NoArgsOps", () => {
  describe("trap", () => {
    it("should change status to panic", () => {
      const instructionResult = new InstructionResult();
      const noArgsOps = NoArgsOps.new(instructionResult);

      noArgsOps.trap();

      assert.strictEqual(instructionResult.status, Result.PANIC);
    });
  });

  describe("fallthrough", () => {
    it("should not change anything", () => {
      const instructionResult = new InstructionResult();
      const expectedInstructionResult = new InstructionResult();
      const noArgsOps = NoArgsOps.new(instructionResult);

      noArgsOps.fallthrough();

      assert.deepStrictEqual(instructionResult, expectedInstructionResult);
    });
  });
});
```

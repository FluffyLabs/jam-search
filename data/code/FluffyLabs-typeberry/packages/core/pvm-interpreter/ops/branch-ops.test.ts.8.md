---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/branch-ops.test.ts#L723-L783
title: packages/core/pvm-interpreter/ops/branch-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 8
chunk_total: 9
content_sha: 682ebbaca6bd0d5d5ced6f2114d0786b9d903237bede20ced9adc3df57847446
language: typescript
---
`packages/core/pvm-interpreter/ops/branch-ops.test.ts` (lines 723–783)

```typescript
      assert.strictEqual(instructionResult.status, Result.PANIC);
    });

    it("should not update status to PANIC (nextPc is not the beginning of basic block but condition is not met)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(-6n, -5n, 0);

      branchOps.branchGeSignedImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });
  });

  describe("branchGeSigned", () => {
    it("should update nextPc", () => {
      const nextPc = 0;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(-5n, -5n, 1);

      branchOps.branchGeSigned(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should not update nextPc (condition is not met)", () => {
      const nextPc = 0;
      const expectedNextPc = 1;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(-6n, -5n, 1);

      branchOps.branchGeSigned(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should update status to PANIC (nextPc is not the beginning of basic block)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(-6n, -7n, 0);

      branchOps.branchGeSigned(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, Result.PANIC);
    });

    it("should not update status to PANIC (nextPc is not the beginning of basic block but condition is not met)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(-6n, -5n, 0);

      branchOps.branchGeSigned(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });
  });
});
```

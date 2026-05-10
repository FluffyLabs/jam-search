---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/branch-ops.test.ts#L93-L187
title: packages/core/pvm-interpreter/ops/branch-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 9
content_sha: 08251fa659e30c7d9eb2b4dbe3320c576460b599f2e36b30b717e41d56cd0e99
language: typescript
---
`packages/core/pvm-interpreter/ops/branch-ops.test.ts` (lines 93–187)

```typescript
    it("should not update status to PANIC (nextPc is not the beginning of basic block but condition is not met)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(5n, 6n, 0);

      branchOps.branchEq(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });
  });

  describe("branchEqImmediate", () => {
    it("should update nextPc", () => {
      const nextPc = 0;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(5n, 5n, 1);

      branchOps.branchEqImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should not update nextPc (condition is not met)", () => {
      const nextPc = 0;
      const expectedNextPc = 1;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(5n, 6n, 1);

      branchOps.branchEqImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should update status to PANIC (nextPc is not the beginning of basic block)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(5n, 5n, 0);

      branchOps.branchEqImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, Result.PANIC);
    });

    it("should not update status to PANIC (nextPc is not the beginning of basic block but condition is not met)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(5n, 6n, 0);

      branchOps.branchEqImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });
  });

  describe("branchNe", () => {
    it("should update nextPc", () => {
      const nextPc = 0;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(6n, 5n, 1);

      branchOps.branchNe(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should not update nextPc (condition is not met)", () => {
      const nextPc = 0;
      const expectedNextPc = 1;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(6n, 6n, 1);

      branchOps.branchNe(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should update status to PANIC (nextPc is not the beginning of basic block)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, secondRegisterIndex } = prepareData(6n, 5n, 0);

      branchOps.branchNe(firstRegisterIndex, secondRegisterIndex, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, Result.PANIC);
    });

    it("should not update status to PANIC (nextPc is not the beginning of basic block but condition is not met)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
```

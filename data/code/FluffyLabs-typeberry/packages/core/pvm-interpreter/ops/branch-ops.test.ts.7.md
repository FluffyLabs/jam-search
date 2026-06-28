---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/branch-ops.test.ts#L634-L728
title: packages/core/pvm-interpreter/ops/branch-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 7
chunk_total: 9
content_sha: 17050674f4bc0fff3b4e38c1cf71cdbb96ccd6162e16ece89dfb3ab789accd3d
language: typescript
---
`packages/core/pvm-interpreter/ops/branch-ops.test.ts` (lines 634–728)

```typescript
    it("should not update status to PANIC (nextPc is not the beginning of basic block but condition is not met)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(-5n, -6n, 0);

      branchOps.branchLeSignedImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });
  });

  describe("branchGtSignedImmediate", () => {
    it("should update nextPc", () => {
      const nextPc = 0;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(-5n, -6n, 1);

      branchOps.branchGtSignedImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should not update nextPc (condition is not met)", () => {
      const nextPc = 0;
      const expectedNextPc = 1;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(-6n, -6n, 1);

      branchOps.branchGtSignedImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should update status to PANIC (nextPc is not the beginning of basic block)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(-5n, -6n, 0);

      branchOps.branchGtSignedImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, Result.PANIC);
    });

    it("should not update status to PANIC (nextPc is not the beginning of basic block but condition is not met)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(-6n, -6n, 0);

      branchOps.branchGtSignedImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });
  });

  describe("branchGeSignedImmediate", () => {
    it("should update nextPc", () => {
      const nextPc = 0;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(-6n, -6n, 1);

      branchOps.branchGeSignedImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should not update nextPc (condition is not met)", () => {
      const nextPc = 0;
      const expectedNextPc = 1;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(-6n, -5n, 1);

      branchOps.branchGeSignedImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, null);
    });

    it("should update status to PANIC (nextPc is not the beginning of basic block)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
      const { branchOps, instructionResult, firstRegisterIndex, immediate } = prepareData(-6n, -7n, 0);

      branchOps.branchGeSignedImmediate(firstRegisterIndex, immediate, nextPc);

      assert.strictEqual(instructionResult.nextPc, expectedNextPc);
      assert.strictEqual(instructionResult.status, Result.PANIC);
    });

    it("should not update status to PANIC (nextPc is not the beginning of basic block but condition is not met)", () => {
      const nextPc = 3;
      const expectedNextPc = 0;
```

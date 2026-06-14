---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/dynamic-jump-ops.test.ts#L86-L111
title: packages/core/pvm-interpreter/ops/dynamic-jump-ops.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: 6c7261e3509091b9c1dad3d6815ce405be349e89262ef5ba4f34f31e661ce45d
language: typescript
---
`packages/core/pvm-interpreter/ops/dynamic-jump-ops.test.ts` (lines 86–111)

```typescript
    const { dynamicJumpOps, instructionResult, registerIndex, immediate } = prepareData(4n, 5n);

    const address = dynamicJumpOps.caluclateJumpAddress(immediate, registerIndex);
    dynamicJumpOps.jumpInd(address);

    assert.strictEqual(instructionResult.status, Result.PANIC);
  });

  it("should change status to PANIC because destination is not an instrction", () => {
    const { dynamicJumpOps, instructionResult, registerIndex, immediate } = prepareData(3n, 5n);

    const address = dynamicJumpOps.caluclateJumpAddress(immediate, registerIndex);
    dynamicJumpOps.jumpInd(address);

    assert.strictEqual(instructionResult.status, Result.PANIC);
  });

  it("should change status to PANIC because destination is not an instruction that is the beginning of basic block", () => {
    const { dynamicJumpOps, instructionResult, registerIndex, immediate } = prepareData(3n, 5n);

    const address = dynamicJumpOps.caluclateJumpAddress(immediate, registerIndex);
    dynamicJumpOps.jumpInd(address);

    assert.strictEqual(instructionResult.status, Result.PANIC);
  });
});
```

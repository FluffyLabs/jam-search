---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.ts#L187-L206
title: packages/core/pvm-interpreter/ops/math-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 8000b4323be5ad7ded0e335d80db97561c80bd7bb77038084ea1de399f15acf7
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.ts` (lines 187–206)

```typescript
      this.regs.setU64(resultIndex, this.regs.getU64(firstIndex) % this.regs.getU64(secondIndex));
    }
  }

  max(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setI64(resultIndex, maxBigInt(this.regs.getI64(firstIndex), this.regs.getI64(secondIndex)));
  }

  maxU(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(resultIndex, maxBigInt(this.regs.getU64(firstIndex), this.regs.getU64(secondIndex)));
  }

  min(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setI64(resultIndex, minBigInt(this.regs.getI64(firstIndex), this.regs.getI64(secondIndex)));
  }

  minU(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setU64(resultIndex, minBigInt(this.regs.getU64(firstIndex), this.regs.getU64(secondIndex)));
  }
}
```

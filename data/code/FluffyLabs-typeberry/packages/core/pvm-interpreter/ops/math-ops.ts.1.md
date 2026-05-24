---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/math-ops.ts#L100-L194
title: packages/core/pvm-interpreter/ops/math-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 8f737d83c58b7e2c43fd79c9a6501f039294b57d4cda963e3c2714f700ddeefe
language: typescript
---
`packages/core/pvm-interpreter/ops/math-ops.ts` (lines 100–194)

```typescript
    this.regs.setU64(resultIndex, signExtend32To64(subU32(immediate.getU32(), this.regs.getLowerU32(firstIndex))));
  }

  negAddImmediateU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(resultIndex, subU64(immediate.getU64(), this.regs.getU64(firstIndex)));
  }

  divSignedU32(firstIndex: number, secondIndex: number, resultIndex: number) {
    if (this.regs.getLowerU32(secondIndex) === 0) {
      this.regs.setU64(resultIndex, 2n ** 64n - 1n);
    } else if (this.regs.getLowerI32(secondIndex) === -1 && this.regs.getLowerI32(firstIndex) === MIN_VALUE_I32) {
      this.regs.setU64(resultIndex, signExtend32To64(this.regs.getLowerU32(firstIndex)));
    } else {
      this.regs.setI64(
        resultIndex,
        signExtend32To64(~~(this.regs.getLowerI32(firstIndex) / this.regs.getLowerI32(secondIndex))),
      );
    }
  }

  divSignedU64(firstIndex: number, secondIndex: number, resultIndex: number) {
    if (this.regs.getU64(secondIndex) === 0n) {
      this.regs.setU64(resultIndex, 2n ** 64n - 1n);
    } else if (this.regs.getI64(secondIndex) === -1n && this.regs.getI64(firstIndex) === -(2n ** 63n)) {
      this.regs.setU64(resultIndex, this.regs.getU64(firstIndex));
    } else {
      this.regs.setI64(resultIndex, ~~(this.regs.getI64(firstIndex) / this.regs.getI64(secondIndex)));
    }
  }

  divUnsignedU32(firstIndex: number, secondIndex: number, resultIndex: number) {
    if (this.regs.getLowerU32(secondIndex) === 0) {
      this.regs.setU64(resultIndex, 2n ** 64n - 1n);
    } else {
      this.regs.setU64(
        resultIndex,
        signExtend32To64(~~(this.regs.getLowerU32(firstIndex) / this.regs.getLowerU32(secondIndex))),
      );
    }
  }

  divUnsignedU64(firstIndex: number, secondIndex: number, resultIndex: number) {
    if (this.regs.getU64(secondIndex) === 0n) {
      this.regs.setU64(resultIndex, 2n ** 64n - 1n);
    } else {
      this.regs.setU64(resultIndex, ~~(this.regs.getU64(firstIndex) / this.regs.getU64(secondIndex)));
    }
  }

  remSignedU32(firstIndex: number, secondIndex: number, resultIndex: number) {
    if (this.regs.getLowerU32(secondIndex) === 0) {
      this.regs.setU64(resultIndex, BigInt(this.regs.getLowerI32(firstIndex)));
    } else if (this.regs.getLowerI32(secondIndex) === -1 && this.regs.getLowerI32(firstIndex) === MIN_VALUE_I32) {
      this.regs.setU64(resultIndex, 0n);
    } else {
      this.regs.setI64(
        resultIndex,
        signExtend32To64(this.regs.getLowerI32(firstIndex) % this.regs.getLowerI32(secondIndex)),
      );
    }
  }

  remSignedU64(firstIndex: number, secondIndex: number, resultIndex: number) {
    if (this.regs.getU64(secondIndex) === 0n) {
      this.regs.setU64(resultIndex, this.regs.getU64(firstIndex));
    } else if (this.regs.getI64(secondIndex) === -1n && this.regs.getI64(firstIndex) === -(2n ** 63n)) {
      this.regs.setU64(resultIndex, 0n);
    } else {
      this.regs.setI64(resultIndex, this.regs.getI64(firstIndex) % this.regs.getI64(secondIndex));
    }
  }

  remUnsignedU32(firstIndex: number, secondIndex: number, resultIndex: number) {
    if (this.regs.getLowerU32(secondIndex) === 0) {
      this.regs.setU64(resultIndex, signExtend32To64(this.regs.getLowerU32(firstIndex)));
    } else {
      this.regs.setU64(
        resultIndex,
        signExtend32To64(this.regs.getLowerU32(firstIndex) % this.regs.getLowerU32(secondIndex)),
      );
    }
  }

  remUnsignedU64(firstIndex: number, secondIndex: number, resultIndex: number) {
    if (this.regs.getU64(secondIndex) === 0n) {
      this.regs.setU64(resultIndex, this.regs.getU64(firstIndex));
    } else {
      this.regs.setU64(resultIndex, this.regs.getU64(firstIndex) % this.regs.getU64(secondIndex));
    }
  }

  max(firstIndex: number, secondIndex: number, resultIndex: number) {
    this.regs.setI64(resultIndex, maxBigInt(this.regs.getI64(firstIndex), this.regs.getI64(secondIndex)));
  }

```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/shift-ops.ts#L85-L102
title: packages/core/pvm-interpreter/ops/shift-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 2
content_sha: 88b663f941a4e4a2d98ba5eba143a85f276085964723eeef0c5ce047e21355c7
language: typescript
---
`packages/core/pvm-interpreter/ops/shift-ops.ts` (lines 85–102)

```typescript
    this.regs.setU32(resultIndex, immediate.getU32() >>> (this.regs.getLowerU32(firstIndex) % MAX_SHIFT_U32));
  }

  shiftLogicalRightImmediateAlternativeU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setU64(
      resultIndex,
      unsignedRightShiftBigInt(immediate.getU64(), this.regs.getU64(firstIndex) % MAX_SHIFT_U64),
    );
  }

  shiftArithmeticRightImmediateAlternativeU32(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setI32(resultIndex, immediate.getU32() >> (this.regs.getLowerU32(firstIndex) % MAX_SHIFT_U32));
  }

  shiftArithmeticRightImmediateAlternativeU64(firstIndex: number, immediate: ImmediateDecoder, resultIndex: number) {
    this.regs.setI64(resultIndex, immediate.getI64() >> (this.regs.getU64(firstIndex) % MAX_SHIFT_U64));
  }
}
```

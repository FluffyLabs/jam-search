---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/ops/load-ops.ts#L106-L135
title: packages/core/pvm-interpreter/ops/load-ops.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 6583d7ec2fd92ecf8a960f63efb68053c8873ecf62b0bc8770dd9b456f8ca80f
language: typescript
---
`packages/core/pvm-interpreter/ops/load-ops.ts` (lines 106–135)

```typescript
  loadIndU16(firstRegisterIndex: number, secondRegisterIndex: number, immediateDecoder: ImmediateDecoder) {
    const address = addWithOverflowU32(this.regs.getLowerU32(secondRegisterIndex), immediateDecoder.getU32());
    this.loadNumber(address, firstRegisterIndex, 2);
  }

  loadIndU32(firstRegisterIndex: number, secondRegisterIndex: number, immediateDecoder: ImmediateDecoder) {
    const address = addWithOverflowU32(this.regs.getLowerU32(secondRegisterIndex), immediateDecoder.getU32());
    this.loadNumber(address, firstRegisterIndex, 4);
  }

  loadIndU64(firstRegisterIndex: number, secondRegisterIndex: number, immediateDecoder: ImmediateDecoder) {
    const address = addWithOverflowU32(this.regs.getLowerU32(secondRegisterIndex), immediateDecoder.getU32());
    this.loadNumber(address, firstRegisterIndex, 8);
  }

  loadIndI8(firstRegisterIndex: number, secondRegisterIndex: number, immediateDecoder: ImmediateDecoder) {
    const address = addWithOverflowU32(this.regs.getLowerU32(secondRegisterIndex), immediateDecoder.getU32());
    this.loadSignedNumber(address, firstRegisterIndex, 1);
  }

  loadIndI16(firstRegisterIndex: number, secondRegisterIndex: number, immediateDecoder: ImmediateDecoder) {
    const address = addWithOverflowU32(this.regs.getLowerU32(secondRegisterIndex), immediateDecoder.getU32());
    this.loadSignedNumber(address, firstRegisterIndex, 2);
  }

  loadIndI32(firstRegisterIndex: number, secondRegisterIndex: number, immediateDecoder: ImmediateDecoder) {
    const address = addWithOverflowU32(this.regs.getLowerU32(secondRegisterIndex), immediateDecoder.getU32());
    this.loadSignedNumber(address, firstRegisterIndex, 4);
  }
}
```

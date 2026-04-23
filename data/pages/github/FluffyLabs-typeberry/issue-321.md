---
type: page
url: 'https://github.com/FluffyLabs/typeberry/issues/321'
title: Reading memory in host calls should not wrap.
site: github.com/FluffyLabs/typeberry
created_at: '2025-04-04T19:09:11.000Z'
last_modified: '2025-04-04T19:09:11.000Z'
content_kind: issue
---

# Reading memory in host calls should not wrap.

## Issue by @tomusdrw

We currently use `regs.getU32` to just take lower bytes, every time we try to read from memory.
However, AFAIU in the current GP revision this isn't correct behavior, since we are not supposed to wrap the memory: https://github.com/gavofyork/graypaper/pull/272

I'd like to propose to first:
- [ ] Rename `Registers.getU32` to `Registers.getLowerU32` to emphasize the fact that upper bits are simply ignored (similarly we could rename `getI32`).
- [ ] Introduce new `HCRegisters` and `HCMemory` API for host calls (simpler and just for host calls):

```ts
interface HCRegisters {
  get(reg: RegNumber): U64;
  set(reg: RegNumber, val: U64);
}
interface HCMemory {
  writeFrom(data: Uint8Array, start: U64): Result<OK, PageFault | OOB>;
  readInto(data: Uint8Array, start: U64): Result<OK, PageFault | OOB>;
}
```

by having a distinct interface just for host calls it will be easier to avoid mistakes. Internally we would convert the `U64` to whatever is needed, but the host calls would not need to deal with `MemoryIndex` conversions or `U64 -> U32` stuff.



## Comment by @tomusdrw

Related: #309 - the PR updates the host calls to 0.6.4, but does not change the wrapping behavior of memory (i.e. using `registers.getU32`)

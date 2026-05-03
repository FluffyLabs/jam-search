---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/refine/nested-pvm.ts#L89-L183
title: sdk/jam/refine/nested-pvm.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 7c751916d68f70a4f63d687a6ddafc4e1b3fa5fa6c9338b98fe17f2befa8186f
language: typescript
---
`sdk/jam/refine/nested-pvm.ts` (lines 89–183)

```typescript
    const heapStart = 2 * SPI_SEGMENT_SIZE + alignToSegment(roLength);
    setupRegion(machine, heapStart, rwBytes, PageAccess.ReadWrite);

    const heapZerosStart = heapStart + alignToPage(rwLength);
    const heapZerosBytes = heapPages * SPI_PAGE_SIZE;
    if (heapZerosBytes > 0) {
      allocatePages(machine, heapZerosStart, heapZerosBytes, PageAccess.ReadWrite);
    }

    const stackLength = alignToPage(stackSize);
    if (stackLength > 0) {
      const stackStart = SPI_STACK_SEGMENT_END - stackLength;
      allocatePages(machine, stackStart, stackLength, PageAccess.ReadWrite);
    }

    if (args.length > 0) {
      setupRegion(machine, SPI_ARGS_SEGMENT_START, args, PageAccess.Read);
    }

    return ResultN.ok<NestedPvm, SpiError>(new NestedPvm(machine, io));
  }

  private lastExitArg: i64 = 0;

  private constructor(
    private readonly machine: Machine,
    private readonly io: InvokeIo,
  ) {}

  getRegister(index: u32): u64 {
    return this.io.getRegister(index);
  }

  setRegister(index: u32, value: u64): void {
    this.io.setRegister(index, value);
  }

  remainingGas(): u64 {
    return this.io.gas;
  }

  setGas(gas: u64): void {
    this.io.gas = gas;
  }

  getExitArg(): i64 {
    return this.lastExitArg;
  }

  invoke(): ExitReason {
    const outcome = this.machine.invoke(this.io);
    this.lastExitArg = outcome.r8;
    return outcome.reason;
  }

  peek(source: u32, dest: BytesBlob): ResultN<bool, OutOfBounds> {
    return this.machine.peek(source, dest);
  }

  poke(dest: u32, data: BytesBlob): ResultN<bool, OutOfBounds> {
    return this.machine.poke(dest, data);
  }

  expunge(): i64 {
    return this.machine.expunge();
  }
}

function alignToPage(size: u32): u32 {
  const mask: u32 = SPI_PAGE_SIZE - 1;
  return (size + mask) & ~mask;
}

function alignToSegment(size: u32): u32 {
  const mask: u32 = SPI_SEGMENT_SIZE - 1;
  return (size + mask) & ~mask;
}

/** Allocate pages covering [addr, addr + byteLen) with the given access. */
function allocatePages(machine: Machine, addr: u32, byteLen: u32, access: PageAccess): void {
  // addr is always page-aligned by construction (RO/RW/heap/stack/args start on page boundaries).
  const startPage = addr / SPI_PAGE_SIZE;
  const pageCount = alignToPage(byteLen) / SPI_PAGE_SIZE;
  machine.pages(startPage, pageCount, access);
}

/** Allocate a region at `addr`, then poke the initial bytes. */
function setupRegion(machine: Machine, addr: u32, data: BytesBlob, access: PageAccess): void {
  if (data.length === 0) return;
  allocatePages(machine, addr, u32(data.length), access);
  // We just allocated pages covering [addr, addr + data.length); poke into
  // those pages cannot OOB unless the host is broken or our arithmetic is.
  // Panic to surface the bug rather than silently corrupt inner-VM state.
  if (machine.poke(addr, data).isError) panic("SPI: poke OOB after allocatePages");
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/memory.test.ts#L196-L290
title: assembly/memory.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-29T16:20:56+02:00'
last_modified: '2026-05-29T16:20:56+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 445fdea7674640b46cf00df186c192b9632eafd5b2fa8e541939a2e13599bb8a
language: typescript
---
`assembly/memory.test.ts` (lines 196–290)

```typescript
  test("sbrk should fault when exceeding custom maxHeapPointer", (assert) => {
    const sbrkStart: u32 = RESERVED_MEMORY;
    const maxHeap: u32 = sbrkStart + 1000;
    const mem = new MemoryBuilder().build(sbrkStart, maxHeap);
    const fault = new MaybePageFault();

    const first = mem.sbrk(fault, 500);
    assert.isEqual(fault.isFault, false, "first sbrk within limit should not fault");
    assert.isEqual(first, u64(sbrkStart), "first sbrk should return start");

    const second = mem.sbrk(fault, 600);
    assert.isEqual(fault.isFault, true, "sbrk exceeding maxHeapPointer should fault");
    assert.isEqual(second, u64(sbrkStart + 500), "should return current address on fault");

    return assert;
  }),
  test("sbrk should allow allocation up to maxHeapPointer boundary", (assert) => {
    const sbrkStart: u32 = RESERVED_MEMORY;
    const maxHeap: u32 = sbrkStart + 1000;
    const mem = new MemoryBuilder().build(sbrkStart, maxHeap);
    const fault = new MaybePageFault();

    const result = mem.sbrk(fault, 1000);
    assert.isEqual(fault.isFault, false, "sbrk up to maxHeapPointer should not fault");
    assert.isEqual(result, u64(sbrkStart), "should return start address");

    mem.sbrk(fault, 1);
    assert.isEqual(fault.isFault, true, "sbrk beyond maxHeapPointer should fault");

    return assert;
  }),
  test("sbrk maxHeapPointer prevents heap from growing into stack region", (assert) => {
    const stackStart: u32 = 0xfe000000;
    const heapStart: u32 = stackStart - 300;
    const mem = new MemoryBuilder().build(heapStart, stackStart);
    const fault = new MaybePageFault();
    const maxHeapSize: u32 = stackStart - heapStart;

    mem.sbrk(fault, maxHeapSize - 100);
    assert.isEqual(fault.isFault, false, "allocation within limit should succeed");

    mem.sbrk(fault, 200);
    assert.isEqual(fault.isFault, true, "allocation into stack region should fault");

    return assert;
  }),
  test("getPagePointer returns 0 for missing page", (assert) => {
    const mem = new MemoryBuilder().build();
    const pageIndex: u32 = RESERVED_PAGES + 5;

    const ptr = mem.getPagePointer(pageIndex);

    assert.isEqual(ptr, <usize>0, "should return 0 for non-existent page");
    return assert;
  }),
  test("getPagePointer returns 0 for reserved (inaccessible) page", (assert) => {
    const mem = new MemoryBuilder().build();

    // Reserved pages (indices 0..RESERVED_PAGES-1) are never allocated, so pointer = 0.
    const ptr = mem.getPagePointer(0);

    assert.isEqual(ptr, <usize>0, "should return 0 for reserved page");
    return assert;
  }),
  test("getPagePointer returns non-zero pointer for read-accessible page", (assert) => {
    // Access.Write pages ARE readable (can(Access.Read) returns true for Write pages).
    // Access.None pages are not. Create a Read-only page and verify pointer is non-zero.
    const builder = new MemoryBuilder();
    const pageAddress: u32 = RESERVED_MEMORY;
    builder.setData(Access.Read, pageAddress, new Uint8Array(PAGE_SIZE));
    const mem = builder.build();

    const pageIndex: u32 = pageAddress >> PAGE_SIZE_SHIFT;
    const ptr = mem.getPagePointer(pageIndex);

    assert.isNotEqual(ptr, <usize>0, "should return non-zero pointer for readable page");
    return assert;
  }),
  test("getPagePointer returns non-zero pointer for writable page", (assert) => {
    const builder = new MemoryBuilder();
    const pageAddress: u32 = RESERVED_MEMORY;
    builder.setData(Access.Write, pageAddress, new Uint8Array(PAGE_SIZE));
    const mem = builder.build();

    const pageIndex: u32 = pageAddress >> PAGE_SIZE_SHIFT;
    const ptr = mem.getPagePointer(pageIndex);

    assert.isNotEqual(ptr, <usize>0, "should return non-zero pointer for writable page");
    return assert;
  }),
  test("getPagePointer data matches page content", (assert) => {
    const builder = new MemoryBuilder();
    const pageAddress: u32 = RESERVED_MEMORY;
    const data = new Uint8Array(PAGE_SIZE);
    data[0] = 0xde;
```

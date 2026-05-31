---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/memory.test.ts#L92-L201'
title: assembly/memory.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-29T16:20:56+02:00'
last_modified: '2026-05-29T16:20:56+02:00'
chunk_index: 1
chunk_total: 4
content_sha: bf74d806e95c6755b6b5a2e817039b8fa2f0cf48d9e2708f6dc0f7f15aef41ae
language: typescript
---
`assembly/memory.test.ts` (lines 92–201)

```typescript
    const mem = new MemoryBuilder().setData(Access.Read, RESERVED_MEMORY, new Uint8Array(0)).build();

    const out = new Uint8Array(0);

    // reserved pages
    mem.bytesRead(a, 0, out, 0);
    mem.bytesWrite(b, 0, out, 0);

    // not allocated
    mem.bytesRead(c, RESERVED_MEMORY + RESERVED_MEMORY, out, 0);
    mem.bytesRead(d, RESERVED_MEMORY + RESERVED_MEMORY, out, 0);

    // readable page
    mem.bytesWrite(e, RESERVED_MEMORY, out, 0);

    const assert = new Assert();
    assert.isEqual(a.isFault, false, "a.fault");
    assert.isEqual(b.isFault, false, "b.fault");
    assert.isEqual(c.isFault, false, "c.fault");
    assert.isEqual(d.isFault, false, "d.fault");
    assert.isEqual(e.isFault, false, "e.fault");
    return assert;
  }),
  test("should page fault when going beyond memory", (assert) => {
    const address = 2343629385;
    const length = 2145386496;

    const mem = new MemoryBuilder().setData(Access.Read, address, new Uint8Array(0)).build();
    const fault = new MaybePageFault();
    const res = mem.getMemory(fault, address, length);

    assert.isEqual(fault.isFault, true);
    assert.isEqual(res, null);

    return assert;
  }),
  test("should page fault when trying to allocate too much", (assert) => {
    const address = 16 * PAGE_SIZE;
    const length = 2145386496;

    const mem = new MemoryBuilder().setData(Access.Read, address, new Uint8Array(0)).build();
    const fault = new MaybePageFault();
    const res = mem.getMemory(fault, address, length);

    assert.isEqual(fault.isFault, true);
    assert.isEqual(res, null);

    return assert;
  }),
  test("should read memory succesfully", (assert) => {
    const address = 20 * PAGE_SIZE;
    const length = 1024;

    const mem = new MemoryBuilder().setData(Access.Read, address, new Uint8Array(4096)).build();
    const fault = new MaybePageFault();
    const res = mem.getMemory(fault, address, length);

    assert.isEqual(fault.fault, 0);
    assert.isEqual(fault.isFault, false);
    if (res !== null) {
      assert.isEqual(res.length, length);
    } else {
      assert.fail("Expected to read the memory successfully.");
    }

    return assert;
  }),
  test("sbrk should return current address when amount is 0", (assert) => {
    const sbrkStart: u32 = 0x20000;
    const mem = new MemoryBuilder().build(sbrkStart);
    const fault = new MaybePageFault();

    const result = mem.sbrk(fault, 0);

    assert.isEqual(fault.isFault, false, "should not fault");
    assert.isEqual(result, u64(sbrkStart), "should return current sbrk address");
    return assert;
  }),
  test("sbrk should allocate memory and return previous address", (assert) => {
    const sbrkStart: u32 = RESERVED_MEMORY;
    const mem = new MemoryBuilder().build(sbrkStart);
    const fault = new MaybePageFault();

    const first = mem.sbrk(fault, 1000);
    assert.isEqual(fault.isFault, false, "first sbrk should not fault");
    assert.isEqual(first, u64(sbrkStart), "first sbrk should return start");

    const second = mem.sbrk(fault, 500);
    assert.isEqual(fault.isFault, false, "second sbrk should not fault");
    assert.isEqual(second, u64(sbrkStart + 1000), "second sbrk should return incremented address");

    return assert;
  }),
  test("sbrk should fault when exceeding default maxHeapPointer (MEMORY_SIZE - 1)", (assert) => {
    const sbrkStart: u32 = u32(MAX_MEMORY_INDEX - 100);
    const mem = new MemoryBuilder().build(sbrkStart);
    const fault = new MaybePageFault();

    const result = mem.sbrk(fault, 200);

    assert.isEqual(fault.isFault, true, "should fault when exceeding memory limit");
    assert.isEqual(result, u64(sbrkStart), "should return current address on fault");
    return assert;
  }),
  test("sbrk should fault when exceeding custom maxHeapPointer", (assert) => {
    const sbrkStart: u32 = RESERVED_MEMORY;
    const maxHeap: u32 = sbrkStart + 1000;
    const mem = new MemoryBuilder().build(sbrkStart, maxHeap);
    const fault = new MaybePageFault();

```

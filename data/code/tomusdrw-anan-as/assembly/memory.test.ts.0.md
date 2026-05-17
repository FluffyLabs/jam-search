---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/assembly/memory.test.ts#L1-L99'
title: assembly/memory.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 0
chunk_total: 4
content_sha: 20a15c88ce9c6cdae7a39b5dc5e9aa95d88bc914f45e5443e1bbce8dfbdff665
language: typescript
---
`assembly/memory.test.ts` (lines 1–99)

```typescript
import { MaybePageFault, MemoryBuilder } from "./memory";
import { Access, PAGE_SIZE, PAGE_SIZE_SHIFT, RESERVED_MEMORY, RESERVED_PAGES } from "./memory-page";
import { Assert, Test, test } from "./test";

const MAX_MEMORY_INDEX: u32 = 0xffff_ffff;

export const TESTS: Test[] = [
  test("Show fail when accessing any of the initial 16 pages", () => {
    const aFault = new MaybePageFault();
    const bFault = new MaybePageFault();
    const mem = new MemoryBuilder().build();

    const a = mem.getI8(aFault, 0);
    const b = mem.getU64(bFault, RESERVED_MEMORY - 1);

    const assert = new Assert();
    assert.isEqual(aFault.isFault, true, "a.fault");
    assert.isEqual(aFault.isAccess, false, "a.access");
    assert.isEqual(aFault.fault, 0);
    assert.isEqual(bFault.isFault, true, "b.fault");
    assert.isEqual(bFault.isAccess, false, "b.access");
    assert.isEqual(bFault.fault, 61440);
    assert.isEqual(a, 0);
    assert.isEqual(b, 0);
    return assert;
  }),
  test("Show fail on missing page or invalid access", () => {
    const aFault = new MaybePageFault();
    const bFault = new MaybePageFault();
    const cFault = new MaybePageFault();
    const dFault = new MaybePageFault();

    const builder = new MemoryBuilder();
    builder.setData(Access.Read, RESERVED_MEMORY, new Uint8Array(10));
    const mem = builder.build();

    const a = mem.getU64(aFault, RESERVED_MEMORY);
    const b = mem.getU8(bFault, (RESERVED_PAGES + 1) << PAGE_SIZE_SHIFT);
    mem.setU8(cFault, RESERVED_MEMORY, 12);
    const d = mem.getU8(dFault, RESERVED_MEMORY);

    const assert = new Assert();
    assert.isEqual(aFault.isFault, false, "a.fault");
    assert.isEqual(aFault.isAccess, false, "a.access");
    assert.isEqual(a, 0);
    assert.isEqual(bFault.isFault, true, "b.fault");
    assert.isEqual(bFault.isAccess, false, "b.access");
    assert.isEqual(bFault.fault, 69632);
    assert.isEqual(b, 0);
    assert.isEqual(cFault.isFault, true, "c.fault");
    assert.isEqual(cFault.isAccess, true, "c.access");
    assert.isEqual(cFault.fault, 65536);
    assert.isEqual(d, 0);
    return assert;
  }),
  test("should read and write across pages", () => {
    const aFault = new MaybePageFault();
    const bFault = new MaybePageFault();
    const cFault = new MaybePageFault();
    const builder = new MemoryBuilder();
    builder.setData(Access.Write, RESERVED_MEMORY, new Uint8Array(1));
    builder.setData(Access.Write, (RESERVED_PAGES + 1) << PAGE_SIZE_SHIFT, new Uint8Array(1));
    const mem = builder.build();

    const out = new Uint8Array(16);
    const data = new Uint8Array(out.length);
    data.set([0xde, 0xad, 0xbe, 0xef], 0);

    mem.bytesWrite(aFault, RESERVED_MEMORY + PAGE_SIZE - 10, data, 0);
    mem.bytesRead(bFault, RESERVED_MEMORY + PAGE_SIZE - 9, out, 0);
    mem.bytesRead(cFault, RESERVED_MEMORY + PAGE_SIZE * 2, out, 0);

    const assert = new Assert();
    assert.isEqual(aFault.isFault, false, "a.fault");
    assert.isEqual(aFault.isAccess, false, "a.access");
    assert.isEqual(aFault.fault, 0, "a.fault");
    assert.isEqual(bFault.isFault, false, "b.fault");
    assert.isEqual(bFault.isAccess, false, "b.access");
    assert.isEqual(bFault.fault, 0, "b.fault");
    assert.isEqual(cFault.isFault, true, "c.fault");
    assert.isEqual(cFault.isAccess, false, "c.access");
    assert.isEqual(out.toString(), "173,190,239,0,0,0,0,0,0,0,0,0,0,0,0,0");
    assert.isEqual(data.toString(), "222,173,190,239,0,0,0,0,0,0,0,0,0,0,0,0");
    return assert;
  }),
  test("should allow 0-bytes reads and writes everywhere", () => {
    const a = new MaybePageFault();
    const b = new MaybePageFault();
    const c = new MaybePageFault();
    const d = new MaybePageFault();
    const e = new MaybePageFault();
    const mem = new MemoryBuilder().setData(Access.Read, RESERVED_MEMORY, new Uint8Array(0)).build();

    const out = new Uint8Array(0);

    // reserved pages
    mem.bytesRead(a, 0, out, 0);
    mem.bytesWrite(b, 0, out, 0);

```

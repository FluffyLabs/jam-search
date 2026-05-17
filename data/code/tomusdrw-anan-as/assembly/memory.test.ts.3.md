---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/anan-as/blob/main/assembly/memory.test.ts#L286-L306
title: assembly/memory.test.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-05-15T10:20:08+02:00'
last_modified: '2026-05-15T10:20:08+02:00'
chunk_index: 3
chunk_total: 4
content_sha: 949c72ccfd1678df01ebd104ecd39cf868ab3fa20250d9ea1c9726bb69a56b8c
language: typescript
---
`assembly/memory.test.ts` (lines 286–306)

```typescript
  test("getPagePointer data matches page content", (assert) => {
    const builder = new MemoryBuilder();
    const pageAddress: u32 = RESERVED_MEMORY;
    const data = new Uint8Array(PAGE_SIZE);
    data[0] = 0xde;
    data[1] = 0xad;
    data[PAGE_SIZE - 1] = 0xff;
    builder.setData(Access.Read, pageAddress, data);
    const mem = builder.build();

    const pageIndex: u32 = pageAddress >> PAGE_SIZE_SHIFT;
    const ptr = mem.getPagePointer(pageIndex);

    assert.isNotEqual(ptr, <usize>0, "pointer should be valid");
    // Read bytes directly via the pointer and compare.
    assert.isEqual(load<u8>(ptr + 0), <u8>0xde, "byte 0 should match");
    assert.isEqual(load<u8>(ptr + 1), <u8>0xad, "byte 1 should match");
    assert.isEqual(load<u8>(ptr + PAGE_SIZE - 1), <u8>0xff, "last byte should match");
    return assert;
  }),
];
```

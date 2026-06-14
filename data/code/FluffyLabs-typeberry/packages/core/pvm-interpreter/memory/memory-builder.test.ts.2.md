---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-builder.test.ts#L201-L215
title: packages/core/pvm-interpreter/memory/memory-builder.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 3
content_sha: a7bd7298ab9dc250ebe0b03bd965bad38d3a8d7bf8961292958c368af214a027
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-builder.test.ts` (lines 201–215)

```typescript
      const memory = builder
        .setWriteablePages(
          tryAsMemoryIndex(RESERVED_NUMBER_OF_PAGES * PAGE_SIZE),
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 1) * PAGE_SIZE),
        )
        .setData(address, data)
        .finalize(
          tryAsMemoryIndex((RESERVED_NUMBER_OF_PAGES + 2) * PAGE_SIZE),
          tryAsSbrkIndex((RESERVED_NUMBER_OF_PAGES + 4) * PAGE_SIZE),
        );

      assert.deepEqual(memory, expectedMemory);
    });
  });
});
```

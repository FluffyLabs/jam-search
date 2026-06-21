---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory-utils.test.ts#L117-L128
title: packages/core/pvm-interpreter/memory/memory-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: 42efb175ffae66b11f3de5b494ca81f01cc32191ef8968c02c3a7a8f0c8823d1
language: typescript
---
`packages/core/pvm-interpreter/memory/memory-utils.test.ts` (lines 117–128)

```typescript
    });

    it("should return a correct start index for the last page", () => {
      const lastMemoryIndex = tryAsMemoryIndex(MAX_MEMORY_INDEX);
      const pageNumber = getPageNumber(lastMemoryIndex);

      const startIndex = getStartPageIndexFromPageNumber(pageNumber);

      assert.strictEqual(startIndex, pageNumber * PAGE_SIZE);
    });
  });
});
```

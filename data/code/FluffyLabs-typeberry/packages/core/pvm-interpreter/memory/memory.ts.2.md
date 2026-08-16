---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-interpreter/memory/memory.ts#L211-L223
title: packages/core/pvm-interpreter/memory/memory.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 96e650de7bebbd5f8cced10155bb579996a8f360785b643bcce37af338d5f690
language: typescript
---
`packages/core/pvm-interpreter/memory/memory.ts` (lines 211–223)

```typescript
    this.sbrkIndex = newSbrkIndex;
    return currentVirtualSbrkIndex;
  }

  getPageDump(pageNumber: PageNumber) {
    const page = this.memory.get(pageNumber);
    return page?.getPageDump() ?? null;
  }

  getDirtyPages() {
    return this.memory.keys();
  }
}
```

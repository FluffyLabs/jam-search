---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/pvm-host-calls/host-call-memory.test.ts#L117-L133
title: packages/core/pvm-host-calls/host-call-memory.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: 68bf6e11fa6d82b90bbf7536d9685b7956b96b1fcdd1c313181b52f5da66f60d
language: typescript
---
`packages/core/pvm-host-calls/host-call-memory.test.ts` (lines 117–133)

```typescript
        Result.error({ address: tryAsU32(0) }, () => "Page fault: attempted to access reserved page 0"),
      );
    });

    it("should wrap address when exceeds MAX_MEMORY_INDEX and throw", () => {
      const address = tryAsU64(MAX_MEMORY_INDEX + 1);
      const result = new Uint8Array([1, 2, 3]);

      const res = hostCallMemory.loadInto(result, address);

      deepEqual(
        res,
        Result.error({ address: tryAsU32(0) }, () => "Page fault: attempted to access reserved page 0"),
      );
    });
  });
});
```

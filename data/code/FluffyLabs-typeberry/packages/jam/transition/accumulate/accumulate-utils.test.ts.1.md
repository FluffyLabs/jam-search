---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-utils.test.ts#L95-L103
title: packages/jam/transition/accumulate/accumulate-utils.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 2
content_sha: 9a12f21146e59a0749de5c4dadd05dfa7b4332758d4a6071c3c75bca794875a5
language: typescript
---
`packages/jam/transition/accumulate/accumulate-utils.test.ts` (lines 95–103)

```typescript
      const timeslot = tryAsTimeSlot(6);
      const expectedServiceId = tryAsServiceId(2596254713);

      const result = generateNextServiceId({ serviceId, entropy, timeslot }, tinyChainSpec, blake2b);

      assert.strictEqual(result, expectedServiceId);
    });
  });
});
```

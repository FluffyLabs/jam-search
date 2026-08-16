---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/in-core.ts#L208-L219
title: packages/jam/in-core/in-core.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 3
content_sha: cd25cb17137204b5882a0963997f3da26b485b72b5212c40a66c91d9e61079f1
language: typescript
---
`packages/jam/in-core/in-core.ts` (lines 208–219)

```typescript
        coreIndex,
        authorizerHash,
        authorizationGasUsed,
        authorizationOutput,
        segmentRootLookup,
        // safe to convert, since we know that number of work items is limited
        results: FixedSizeArray.new(results, tryAsU8(refineResults.length)),
      }),
      exports: asKnownSize(exports),
    };
  }
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/is-authorized.ts#L107-L114
title: packages/jam/in-core/is-authorized.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 2
content_sha: b2be0712b34f1dd7a06903ec69bfa5860aac5ae0e2509a3c5fd5bdc50bd8038a
language: typescript
---
`packages/jam/in-core/is-authorized.ts` (lines 107–114)

```typescript
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/1b81011b8401?v=0.7.2
    const authorizerHash = this.blake2b.hashBlobs<AuthorizerHash>([authCodeHash, authConfiguration]);
    const authorizationOutput = BytesBlob.blobFrom(execResult.memorySlice);
    const authorizationGasUsed = tryAsServiceGas(execResult.consumedGas);

    return Result.ok({ authorizerHash, authorizationGasUsed, authorizationOutput });
  }
}
```

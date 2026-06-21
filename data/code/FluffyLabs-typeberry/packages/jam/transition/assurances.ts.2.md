---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/assurances.ts#L204-L215
title: packages/jam/transition/assurances.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 2
chunk_total: 3
content_sha: 4a8e76be2cb7d9c6367c117b50bfe159fa3897f2d76d3f90fd4cf04e70d4ffcb
language: typescript
---
`packages/jam/transition/assurances.ts` (lines 204–215)

```typescript
      return Result.error(AssurancesError.InvalidSignature, () => `invalid signatures at ${invalidIndices.join(", ")}`);
    }

    return Result.ok(OK);
  }
}

const JAM_AVAILABLE = BytesBlob.blobFromString("jam_available").raw;

function signingPayload(blake2b: Blake2b, anchor: BytesBlob, blob: BytesBlob): BytesBlob {
  return BytesBlob.blobFromParts(JAM_AVAILABLE, blake2b.hashBytes(BytesBlob.blobFromParts(anchor.raw, blob.raw)).raw);
}
```

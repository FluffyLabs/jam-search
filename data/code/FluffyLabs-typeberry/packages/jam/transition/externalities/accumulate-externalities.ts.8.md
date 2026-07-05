---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/accumulate-externalities.ts#L775-L796
title: packages/jam/transition/externalities/accumulate-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 8
chunk_total: 9
content_sha: 03a030a95c0e95d638077c73914e113ac6bb28c50c4751125b8b3ae8134f769a
language: typescript
---
`packages/jam/transition/externalities/accumulate-externalities.ts` (lines 775–796)

```typescript
    if (res.isError) {
      return Result.error("full", res.details);
    }

    this.updatedState.updateStorage(this.currentServiceId, rawKey, data);

    return Result.ok(current === null ? null : current.length);
  }

  lookup(serviceId: ServiceId | null, hash: PreimageHash): BytesBlob | null {
    if (serviceId === null) {
      return null;
    }

    return this.updatedState.getPreimage(serviceId, hash);
  }
}

function bumpServiceId(serviceId: ServiceId): ServiceId {
  const mod = 2 ** 32 - MIN_PUBLIC_SERVICE_INDEX - 2 ** 8;
  return tryAsServiceId(MIN_PUBLIC_SERVICE_INDEX + ((serviceId - MIN_PUBLIC_SERVICE_INDEX + 42 + mod) % mod));
}
```

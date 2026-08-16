---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate-data.ts#L207-L219
title: packages/jam/transition/accumulate/accumulate-data.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 2
chunk_total: 3
content_sha: a20545fbd4561b8c4477784920038d10de9301335c179cf06d93137bfcc1f6d8
language: typescript
---
`packages/jam/transition/accumulate/accumulate-data.ts` (lines 207–219)

```typescript
  getGasLimit(serviceId: ServiceId): ServiceGas {
    return this.gasLimitByServiceId.get(serviceId) ?? tryAsServiceGas(0n);
  }

  /**
   * Returns a list of service ids that should be accumulated.
   *
   * https://graypaper.fluffylabs.dev/#/ab2cdbd/173803174a03?v=0.7.2
   */
  getServiceIds(): ServiceId[] {
    return this.serviceIds;
  }
}
```

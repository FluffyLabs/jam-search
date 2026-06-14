---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/in-core/refine.ts#L236-L260
title: packages/jam/in-core/refine.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 2
chunk_total: 3
content_sha: 975f133f991527d8793ffcdf9de091e3b1f13396176b805e1a3907949d648ed7
language: typescript
---
`packages/jam/in-core/refine.ts` (lines 236–260)

```typescript
    currentServiceId: ServiceId;
    lookupState: State;
    exportOffset: number;
    authorizerTrace: BytesBlob;
  }): RefineHostCallExternalities {
    const fetchExternalities = new RefineFetchExternalities(this.chainSpec, {
      packageData: args.packageFetchData,
      currentWorkItemIndex: args.currentWorkItemIndex,
      imports: args.imports,
      extrinsics: args.extrinsics,
      authorizerTrace: args.authorizerTrace,
    });
    const refine = RefineExternalitiesImpl.create({
      currentServiceId: args.currentServiceId,
      lookupState: args.lookupState,
      exportOffset: args.exportOffset,
      pvmBackend: this.pvmBackend,
    });

    return {
      fetchExternalities,
      refine,
    };
  }
}
```

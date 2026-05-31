---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/disputes/disputes.test.data2.ts#L190-L218
title: packages/jam/transition/disputes/disputes.test.data2.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 2
chunk_total: 3
content_sha: c135f2e082622be596b608e798c5c21125df0fb95000ae5f3eaf1f453fbba6f8
language: typescript
---
`packages/jam/transition/disputes/disputes.test.data2.ts` (lines 190–218)

```typescript
  return WorkReport.create({
    workPackageSpec,
    context,
    coreIndex: tryAsCoreIndex(coreIndex),
    authorizerHash: Bytes.zero(HASH_SIZE).asOpaque(),
    authorizationOutput: BytesBlob.parseBlob("0x030201"),
    segmentRootLookup: [],
    results: FixedSizeArray.new(
      [
        WorkResult.create({
          serviceId: tryAsServiceId(coreIndex),
          codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
          payloadHash: Bytes.zero(HASH_SIZE).asOpaque(),
          gas: tryAsServiceGas(42),
          result: WorkExecResult.ok(BytesBlob.parseBlob("0x010203")),
          load: WorkRefineLoad.create({
            gasUsed: tryAsServiceGas(0),
            importedSegments: tryAsU32(0),
            exportedSegments: tryAsU32(0),
            extrinsicSize: tryAsU32(0),
            extrinsicCount: tryAsU32(0),
          }),
        }),
      ],
      tryAsU8(1),
    ),
    authorizationGasUsed: tryAsServiceGas(0),
  });
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/accumulate/accumulate.test.ts#L335-L427
title: packages/jam/transition/accumulate/accumulate.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 4
chunk_total: 13
content_sha: 371f1b449fa1a0d7d76cd59606a8512247e22deafd197388ec9f259367b9830f
language: typescript
---
`packages/jam/transition/accumulate/accumulate.test.ts` (lines 335–427)

```typescript
  return services;
};

const createService = (serviceId: ServiceId, hash: OpaqueHash, blob: BytesBlob, info: TestServiceInfo) => {
  const preimages = HashDictionary.new<PreimageHash, PreimageItem>();
  preimages.set(hash.asOpaque(), PreimageItem.create({ hash: hash.asOpaque(), blob }));
  return InMemoryService.new(serviceId, {
    info: ServiceAccountInfo.create({
      accumulateMinGas: tryAsServiceGas(0n),
      codeHash: hash.asOpaque(),
      balance: tryAsU64(0),
      onTransferMinGas: tryAsServiceGas(0n),
      storageUtilisationBytes: tryAsU64(0),
      storageUtilisationCount: tryAsU32(0),
      gratisStorage: tryAsU64(0),
      created: tryAsTimeSlot(0),
      lastAccumulation: info.lastAccumulation ?? tryAsTimeSlot(0),
      parentService: tryAsServiceId(0),
    }),
    lookupHistory: HashDictionary.new(),
    preimages,
    storage: new Map(),
  });
};

const createPrivilegedServices = (spec: ChainSpec) =>
  PrivilegedServices.create({
    assigners: tryAsPerCore(new Array(spec.coresCount).fill(tryAsServiceId(0)), spec),
    manager: tryAsServiceId(0),
    delegator: tryAsServiceId(0),
    registrar: tryAsServiceId(0),
    autoAccumulateServices: new Map(),
  });

const createWorkReport = (
  workPackageHash: WorkPackageHash,
  prerequisites: WorkPackageHash[] = [],
  serviceId: ServiceId = tryAsServiceId(0),
) =>
  WorkReport.create({
    authorizationGasUsed: tryAsServiceGas(0n),
    authorizationOutput: BytesBlob.empty(),
    authorizerHash: Bytes.zero(HASH_SIZE).asOpaque(),
    context: RefineContext.create({
      anchor: Bytes.zero(HASH_SIZE).asOpaque(),
      beefyRoot: Bytes.zero(HASH_SIZE).asOpaque(),
      lookupAnchor: Bytes.zero(HASH_SIZE).asOpaque(),
      lookupAnchorSlot: tryAsTimeSlot(0),
      prerequisites,
      stateRoot: Bytes.zero(HASH_SIZE).asOpaque(),
    }),
    coreIndex: tryAsCoreIndex(0),
    results: FixedSizeArray.new(
      [
        WorkResult.create({
          codeHash: Bytes.zero(HASH_SIZE).asOpaque(),
          gas: tryAsServiceGas(10000),
          load: WorkRefineLoad.create({
            gasUsed: tryAsServiceGas(0),
            exportedSegments: tryAsU32(0),
            extrinsicCount: tryAsU32(0),
            extrinsicSize: tryAsU32(0),
            importedSegments: tryAsU32(0),
          }),
          payloadHash: Bytes.zero(HASH_SIZE).asOpaque(),
          result: WorkExecResult.ok(BytesBlob.empty()),
          serviceId,
        }),
      ],
      tryAsWorkItemsCount(1),
    ),
    segmentRootLookup: [],
    workPackageSpec: WorkPackageSpec.create({
      erasureRoot: Bytes.zero(HASH_SIZE).asOpaque(),
      exportsCount: tryAsU16(0),
      exportsRoot: Bytes.zero(HASH_SIZE).asOpaque(),
      hash: workPackageHash,
      length: tryAsU32(0),
    }),
  });

const createNotAccumulatedWorkReport = (
  workPackageHash: WorkPackageHash,
  prerequisites: WorkPackageHash[] = [],
  dependencies: WorkReportHash[] = [],
  serviceId: ServiceId = tryAsServiceId(0),
) =>
  NotYetAccumulatedReport.create({
    report: createWorkReport(workPackageHash, prerequisites, serviceId),
    dependencies: asKnownSize(dependencies),
  });

const preimageBlob = BytesBlob.parseBlob(
```

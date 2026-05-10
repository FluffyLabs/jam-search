---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/reports/test.utils.ts#L103-L220
title: packages/jam/transition/reports/test.utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 4
content_sha: 44f8d68b9050e09f5d871c0cc95629e1208e9bad822dbcf5a196a3d94bc67b6d
language: typescript
---
`packages/jam/transition/reports/test.utils.ts` (lines 103–220)

```typescript
          result: resultSize !== undefined ? WorkExecResult.ok(Bytes.fill(resultSize, 0)) : x.result,
          load: WorkRefineLoad.create({
            gasUsed: tryAsServiceGas(5),
            importedSegments: tryAsU32(0),
            exportedSegments: tryAsU32(0),
            extrinsicSize: tryAsU32(0),
            extrinsicCount: tryAsU32(0),
          }),
        }),
      ),
      report.results.fixedLength,
    ),
    authorizationGasUsed: tryAsServiceGas(1),
  });
}

export function guaranteesAsView(
  spec: ChainSpec,
  guarantees: readonly ReportGuarantee[],
  { disableCredentialsRangeCheck = false }: { disableCredentialsRangeCheck?: boolean } = {},
): GuaranteesExtrinsicView {
  if (disableCredentialsRangeCheck) {
    const fakeCodec = codecWithContext((context) =>
      codecKnownSizeArray(
        codec.Class(ReportGuarantee, {
          report: WorkReport.Codec,
          slot: codec.u32.asOpaque<TimeSlot>(),
          credentials: codecKnownSizeArray(Credential.Codec, {
            minLength: 0,
            maxLength: 5,
          }),
        }),
        {
          minLength: 0,
          maxLength: context.coresCount,
          typicalLength: context.coresCount,
        },
        GuaranteesExtrinsicBounds,
      ),
    );
    return reencodeAsView(fakeCodec, asOpaqueType(guarantees), spec);
  }

  return reencodeAsView(guaranteesExtrinsicCodec, asOpaqueType(guarantees), spec);
}

export async function newReports(options: Parameters<typeof newReportsState>[0] = {}) {
  const blake2b = await Blake2b.createHasher();
  const state = newReportsState(options);
  const headerChain: HeaderChain = {
    isAncestor() {
      return false;
    },
  };

  return new Reports(tinyChainSpec, blake2b, state, headerChain);
}

export function newCredential(index: number, signature?: Ed25519Signature) {
  return Credential.create({
    validatorIndex: tryAsValidatorIndex(index),
    signature: signature ?? Bytes.zero(ED25519_SIGNATURE_BYTES).asOpaque(),
  });
}

type ReportStateOptions = {
  withCoreAssignment?: boolean;
  services?: InMemoryState["services"];
  accumulationQueue?: NotYetAccumulatedReport[];
  recentlyAccumulated?: HashSet<WorkPackageHash>;
  reportedInRecentBlocks?: HashDictionary<WorkPackageHash, WorkPackageInfo>;
  clearAvailabilityOnZero?: boolean;
};

function newReportsState({
  withCoreAssignment = false,
  services = new Map(),
  accumulationQueue = [],
  recentlyAccumulated = HashSet.new(),
  reportedInRecentBlocks = HashDictionary.new(),
  clearAvailabilityOnZero = false,
}: ReportStateOptions = {}): ReportsState {
  const spec = tinyChainSpec;
  const coreAssignment = withCoreAssignment ? initialAssignment() : [null, null];
  if (clearAvailabilityOnZero) {
    coreAssignment[0] = null;
  }
  return InMemoryState.partial(spec, {
    accumulationQueue: tryAsPerEpochBlock(
      FixedSizeArray.fill((idx) => (idx === 0 ? accumulationQueue : []), spec.epochLength),
      spec,
    ),
    recentlyAccumulated: tryAsPerEpochBlock(
      FixedSizeArray.fill((idx) => (idx === 0 ? recentlyAccumulated : HashSet.new()), spec.epochLength),
      spec,
    ),
    availabilityAssignment: tryAsPerCore(coreAssignment, spec),
    entropy: ENTROPY,
    authPools: getAuthPools([1, 2, 3, 4], spec),
    recentBlocks: RecentBlocks.create({
      blocks: asKnownSize([
        {
          headerHash: Bytes.parseBytes(
            "0x168490e085497fcb6cbe3b220e2fa32456f30c1570412edd76ccb93be9254fef",
            HASH_SIZE,
          ).asOpaque(),
          accumulationResult: Bytes.parseBytes(
            "0x675f9e53123c83ddcdb2c1f5231f13646378aefc83837a4571d052ac80014837",
            HASH_SIZE,
          ).asOpaque(),
          postStateRoot: Bytes.zero(HASH_SIZE).asOpaque(),
          reported: reportedInRecentBlocks,
        },
        {
          headerHash: Bytes.parseBytes(
            "0xbed5792b7df998e5520dfbb8c91386cf2117b2c07b7837094c79d5c0b4de9de7",
            HASH_SIZE,
          ).asOpaque(),
```

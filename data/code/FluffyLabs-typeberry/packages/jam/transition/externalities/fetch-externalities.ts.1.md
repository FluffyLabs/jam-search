---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/transition/externalities/fetch-externalities.ts#L117-L189
title: packages/jam/transition/externalities/fetch-externalities.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 83d27d0d8a6ff81fb6015f6ae65aa04f9a9c680cc49dbca503203b56b41a35c8
language: typescript
---
`packages/jam/transition/externalities/fetch-externalities.ts` (lines 117–189)

```typescript
    W_E: tryAsU32(chainSpec.erasureCodedPieceSize),
    W_M: tryAsU32(W_M),
    W_P: tryAsU32(chainSpec.numberECPiecesPerSegment),
    W_R: tryAsU32(MAX_WORK_REPORT_SIZE_BYTES),
    W_T: tryAsU32(W_T),
    W_X: tryAsU32(W_X),
    Y: tryAsU32(chainSpec.contestLength),
  });

  encodedConstantsCache.set(chainSpec, encodedConsts);

  return encodedConsts;
}

/**
 * `S(w)` — work-item summary used by fetch in both the IsAuthorized
 * and Refine contexts.
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/31fc0231fc02?v=0.7.2
 */
const WORK_ITEM_SUMMARY_CODEC = codec.object({
  service: codec.u32.asOpaque<ServiceId>(),
  codeHash: codec.bytes(HASH_SIZE).asOpaque<CodeHash>(),
  refineGasLimit: codec.u64.asOpaque<ServiceGas>(),
  accumulateGasLimit: codec.u64.asOpaque<ServiceGas>(),
  exportCount: codec.u16,
  importSegmentsCount: codec.u16,
  extrinsicCount: codec.u16,
  payloadLength: codec.u32,
});
type WorkItemSummary = DescribedBy<typeof WORK_ITEM_SUMMARY_CODEC>;
type WorkItemSummaryView = DescribedBy<typeof WORK_ITEM_SUMMARY_CODEC.View>;

export function encodeWorkItemSummary(item: WorkItem): BytesBlob {
  return Encoder.encodeObject(WORK_ITEM_SUMMARY_CODEC, {
    service: item.service,
    codeHash: item.codeHash,
    refineGasLimit: item.refineGasLimit,
    accumulateGasLimit: item.accumulateGasLimit,
    exportCount: item.exportCount,
    importSegmentsCount: tryAsU16(item.importSegments.length),
    extrinsicCount: tryAsU16(item.extrinsic.length),
    payloadLength: tryAsU32(item.payload.length),
  });
}

/** Encoded work package data for fetch, shared between `IsAuthorized` and `Refine` fetchers. */
export type WorkPackageFetchData = {
  /** Lazy view over the encoded work package. */
  packageView: WorkPackageView;
  /** SequenceView over the concatenated S(w) summaries. */
  workItemSummaries: SequenceView<WorkItemSummary, WorkItemSummaryView>;
};

/** Eagerly build the per-package fetch views. */
export function buildWorkPackageFetchData(chainSpec: ChainSpec, workPackage: WorkPackage): WorkPackageFetchData {
  const packageView = reencodeAsView(WorkPackage.Codec, workPackage, chainSpec);

  const summariesBlob = BytesBlob.blobFromParts(workPackage.items.map((i) => encodeWorkItemSummary(i).raw));

  const workItemSummaries = new SequenceView(
    Decoder.fromBytesBlob(summariesBlob),
    WORK_ITEM_SUMMARY_CODEC,
    workPackage.items.length,
  );

  return { packageView, workItemSummaries };
}

/** Converts u64 value taken from a register into valid index of array of given `length`. */
export function u64ToArrayIndex(v: U64, len: number): number | null {
  return v < BigInt(len) ? Number(v) : null;
}
```

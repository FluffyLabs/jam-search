---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/work-item.ts#L119-L190
title: packages/jam/block/work-item.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 521229eaa112b6514422685736335002f48ee17cb9323413e6e1508954547525
language: typescript
---
`packages/jam/block/work-item.ts` (lines 119–190)

```typescript
 * Work Item which is a part of some work package.
 *
 * https://graypaper.fluffylabs.dev/#/ab2cdbd/1a86001a9100?v=0.7.2
 */
export class WorkItem extends WithDebug {
  static Codec = codec.Class(WorkItem, {
    service: codec.u32.asOpaque<ServiceId>(),
    codeHash: codec.bytes(HASH_SIZE).asOpaque<CodeHash>(),
    refineGasLimit: codec.u64.asOpaque<ServiceGas>(),
    accumulateGasLimit: codec.u64.asOpaque<ServiceGas>(),
    // TODO: [MaSo] It should be validated to not exceed W_X
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/1a0b011a1c01?v=0.7.2
    exportCount: codec.u16,
    payload: codec.blob,
    importSegments: codecKnownSizeArray(ImportSpec.Codec, {
      minLength: 0,
      maxLength: MAX_NUMBER_OF_IMPORTS_WP,
      typicalLength: MAX_NUMBER_OF_IMPORTS_WP,
    }),
    // TODO: [MaSo] It should be validated to not exceed T = 128
    // https://graypaper.fluffylabs.dev/#/ab2cdbd/1a0b011a1c01?v=0.7.2
    extrinsic: codec.sequenceVarLen(WorkItemExtrinsicSpec.Codec),
  });

  static create({
    service,
    codeHash,
    payload,
    refineGasLimit,
    accumulateGasLimit,
    importSegments,
    extrinsic,
    exportCount,
  }: CodecRecord<WorkItem>) {
    return new WorkItem(
      service,
      codeHash,
      payload,
      refineGasLimit,
      accumulateGasLimit,
      importSegments,
      extrinsic,
      exportCount,
    );
  }

  private constructor(
    /** `s`: related service */
    public readonly service: ServiceId,
    /**
     * `c`: code hash of the service at the time of reporting.
     *
     * preimage of that hash must be available from the perspective of the lookup
     * anchor block.
     */
    public readonly codeHash: CodeHash,
    /** `y`: payload blob */
    public readonly payload: BytesBlob,
    /** `g`: refine execution gas limit */
    public readonly refineGasLimit: ServiceGas,
    /** `a`: accumulate execution gas limit */
    public readonly accumulateGasLimit: ServiceGas,
    /** `i`: sequence of imported data segments, which identify a prior exported segment. */
    public readonly importSegments: KnownSizeArray<ImportSpec, `Less than ${typeof MAX_NUMBER_OF_IMPORTS_WP}`>,
    /** `x`: sequence of blob hashes and lengths to be introduced in this block */
    public readonly extrinsic: WorkItemExtrinsicSpec[],
    /** `e`: number of data segments exported by this work item. */
    public readonly exportCount: U16,
  ) {
    super();
  }
}
```

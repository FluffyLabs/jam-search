---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/work-result.ts#L104-L168
title: packages/jam/block/work-result.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: 67da907c322a7b36c5d6d944489716307f036f30e1c0ef3b2dda9d89109fbafc
language: typescript
---
`packages/jam/block/work-result.ts` (lines 104–168)

```typescript
    public readonly gasUsed: ServiceGas,
    /** `i`: number of segments imported from */
    public readonly importedSegments: U32,
    /** `x`: number of extrinsics used in computing the workload */
    public readonly extrinsicCount: U32,
    /** `z`: size of extrinsics used in computing the workload */
    public readonly extrinsicSize: U32,
    /** `e`: number of segments exported into */
    public readonly exportedSegments: U32,
  ) {
    super();
  }
}

/**
 * A result of execution of some work package.
 *
 * https://graypaper.fluffylabs.dev/#/68eaa1f/139501139501?v=0.6.4
 */
export class WorkResult {
  static Codec = codec.Class(WorkResult, {
    serviceId: codec.u32.asOpaque<ServiceId>(),
    codeHash: codec.bytes(HASH_SIZE).asOpaque<CodeHash>(),
    payloadHash: codec.bytes(HASH_SIZE),
    gas: codec.u64.asOpaque<ServiceGas>(),
    result: WorkExecResult.Codec,
    load: WorkRefineLoad.Codec,
  });

  static create({ serviceId, codeHash, payloadHash, gas, result, load }: CodecRecord<WorkResult>) {
    return new WorkResult(serviceId, codeHash, payloadHash, gas, result, load);
  }

  private constructor(
    /** `s`: Index of the service whose state is to be altered (refine already executed). */
    public readonly serviceId: ServiceId,
    /** `c`: Hash of the code of the service at the time of being reported. */
    public readonly codeHash: CodeHash,
    /**
     * `y`: Hash of the payload within the work item which was executed in the refine stage to give this result.
     *
     * It has no immediate relevance, but is something provided to the accumulation logic of the service.
     *
     * https://graypaper.fluffylabs.dev/#/579bd12/134701134701
     */
    public readonly payloadHash: OpaqueHash,
    /**
     * `g`: Gas prioritization ratio.
     *
     * Used when determining how much gas should be allocated to execute
     * of this item's accumulate.
     */
    public readonly gas: ServiceGas,
    /** `o`: The output or error of the execution of the code. */
    public readonly result: WorkExecResult,
    /**
     * `u, i, x, z, e`: fields describing the level of activity
     *                  which this workload imposed on the core in
     *                  bringing the output datum to bear.
     *
     * https://graypaper.fluffylabs.dev/#/68eaa1f/141300141500?v=0.6.4
     */
    public readonly load: WorkRefineLoad,
  ) {}
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/work-report.ts#L113-L125
title: packages/jam/block/work-report.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 1
chunk_total: 2
content_sha: e38f21a927a4e9c259b82e77f71f9c1f9a49ac91c12e9adcda7d4e26f762f532
language: typescript
---
`packages/jam/block/work-report.ts` (lines 113–125)

```typescript
    /** `l`: Segment-root lookup
     * In GP segment-root lookup is a dictionary but dictionary and var-len sequence are equal from codec perspective
     * https://graypaper.fluffylabs.dev/#/579bd12/13ab0013ad00
     */
    public readonly segmentRootLookup: readonly WorkPackageInfo[],
    /** `r`: The results of evaluation of each of the items in the work package. */
    public readonly results: FixedSizeArray<WorkResult, WorkItemsCount>,
    /** *`g`*: Gas used during authorization. */
    public readonly authorizationGasUsed: ServiceGas,
  ) {
    super();
  }
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/common.ts#L1-L20
title: packages/jam/state/common.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 0
chunk_total: 1
content_sha: 9a0a9c67e69b627ed9f4bc195d1095f578ae9f975d8045d28f6f65e6146cb076
language: typescript
---
`packages/jam/state/common.ts` (lines 1–20)

```typescript
import { codecKnownSizeArray, codecWithContext } from "@typeberry/block/codec-utils.js";
import type { Descriptor, SequenceView } from "@typeberry/codec";
import type { KnownSizeArray } from "@typeberry/collections";
import type { ChainSpec } from "@typeberry/config";
import { asOpaqueType, check } from "@typeberry/utils";

/** One entry of kind `T` for each core. */
export type PerCore<T> = KnownSizeArray<T, "number of cores">;
/** Check if given array has correct length before casting to the opaque type. */
export function tryAsPerCore<T>(array: T[], spec: ChainSpec): PerCore<T> {
  check`
    ${array.length === spec.coresCount}
    Invalid per-core array length. Expected ${spec.coresCount}, got: ${array.length}
  `;
  return asOpaqueType(array);
}
export const codecPerCore = <T, V>(val: Descriptor<T, V>): Descriptor<PerCore<T>, SequenceView<T, V>> =>
  codecWithContext((context) => {
    return codecKnownSizeArray(val, { fixedLength: context.coresCount });
  });
```

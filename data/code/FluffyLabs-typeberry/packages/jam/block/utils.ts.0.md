---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/block/utils.ts#L1-L13
title: packages/jam/block/utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 229ac8bfcc064213b531dbf923a8418fbb8cca521fc17d97b2f66a680dcdf700
language: typescript
---
`packages/jam/block/utils.ts` (lines 1–13)

```typescript
import { Decoder, type Descriptor, Encoder } from "@typeberry/codec";
import type { ChainSpec } from "@typeberry/config";

/**
 * Take an input data and re-encode that data as view.
 *
 * NOTE: this function should NEVER be used in any production code,
 * it's only a test helper.
 */
export function reencodeAsView<T, V>(codec: Descriptor<T, V>, object: T, chainSpec?: ChainSpec): V {
  const encoded = Encoder.encodeObject(codec, object, chainSpec);
  return Decoder.decodeObject(codec.View, encoded, chainSpec);
}
```

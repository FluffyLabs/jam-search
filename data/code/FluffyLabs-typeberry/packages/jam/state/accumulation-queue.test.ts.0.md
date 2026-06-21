---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/accumulation-queue.test.ts#L1-L21
title: packages/jam/state/accumulation-queue.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 2dd5021421c03d1feb5d4ebf1eab90b658e0abc3359ee5893ded04be3eb1f45b
language: typescript
---
`packages/jam/state/accumulation-queue.test.ts` (lines 1–21)

```typescript
import { describe, it } from "node:test";
import { reencodeAsView } from "@typeberry/block";
import { Bytes } from "@typeberry/bytes";
import { Decoder } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { deepEqual } from "@typeberry/utils";
import { accumulationQueueCodec } from "./accumulation-queue.js";

describe("Accumulation queue", () => {
  it("should decode empty accumulation queue view", () => {
    const spec = tinyChainSpec;
    const encoded = Bytes.zero(spec.epochLength);

    const decoded = Decoder.decodeObject(accumulationQueueCodec, encoded, spec);
    const decodedView = Decoder.decodeObject(accumulationQueueCodec.View, encoded, spec);
    const reencoded = reencodeAsView(accumulationQueueCodec, decoded, spec);

    deepEqual(decodedView.encoded(), encoded);
    deepEqual(reencoded.encoded(), encoded);
  });
});
```

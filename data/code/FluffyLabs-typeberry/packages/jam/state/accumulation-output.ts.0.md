---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/state/accumulation-output.ts#L1-L39
title: packages/jam/state/accumulation-output.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e9d8f97801d76b4badb5ccf366a57b230b706026e92234d9bf108cbb04b32492
language: typescript
---
`packages/jam/state/accumulation-output.ts` (lines 1–39)

```typescript
import type { ServiceId } from "@typeberry/block";
import { type CodecRecord, codec } from "@typeberry/codec";
import { HASH_SIZE, type KeccakHash } from "@typeberry/hash";
import { Ordering } from "@typeberry/ordering";

/**
 * Single service-indexed commitment to accumulation output
 *
 * https://graypaper.fluffylabs.dev/#/1c979cb/0f3c020f3e02?v=0.7.1
 */
export class AccumulationOutput {
  static Codec = codec.Class(AccumulationOutput, {
    serviceId: codec.u32.asOpaque<ServiceId>(),
    output: codec.bytes(HASH_SIZE),
  });

  static create(a: CodecRecord<AccumulationOutput>) {
    return new AccumulationOutput(a.serviceId, a.output);
  }

  private constructor(
    readonly serviceId: ServiceId,
    readonly output: KeccakHash,
  ) {}
}

export function accumulationOutputComparator(a: AccumulationOutput, b: AccumulationOutput) {
  const result = a.serviceId - b.serviceId;

  if (result < 0) {
    return Ordering.Less;
  }

  if (result > 0) {
    return Ordering.Greater;
  }

  return a.output.compare(b.output);
}
```

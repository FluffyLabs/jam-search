---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/core/codec/bytes32.ts#L1-L23'
title: sdk/core/codec/bytes32.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-15T23:42:49+02:00'
last_modified: '2026-05-15T23:42:49+02:00'
chunk_index: 0
chunk_total: 1
content_sha: c2b00af614ce8b09cb13a70eba4de13c5a635c16594b5d1380338e42a035bc41
language: typescript
---
`sdk/core/codec/bytes32.ts` (lines 1–23)

```typescript
import { Bytes32 } from "../bytes";
import { Result } from "../result";
import { DecodeError, Decoder, TryDecode } from "./decode";
import { Encoder, TryEncode } from "./encode";

/** Codec for Bytes32 (32-byte fixed-length hash). */
export class Bytes32Codec implements TryDecode<Bytes32>, TryEncode<Bytes32> {
  static create(): Bytes32Codec {
    return new Bytes32Codec();
  }

  private constructor() {}

  decode(d: Decoder): Result<Bytes32, DecodeError> {
    const v = d.bytes32();
    if (d.isError) return Result.err<Bytes32, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<Bytes32, DecodeError>(v);
  }

  encode(value: Bytes32, e: Encoder): void {
    e.bytes32(value);
  }
}
```

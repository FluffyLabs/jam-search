---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/as-lan/blob/main/sdk/jam/service.ts#L116-L182'
title: sdk/jam/service.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-05-28T15:07:03+02:00'
last_modified: '2026-05-28T15:07:03+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 7de1a9f89b823fc26b345e4715f6ee4828711e7715042998c92f026af65fd469
language: typescript
---
`sdk/jam/service.ts` (lines 116–182)

```typescript
// ─── Response ─────────────────────────────────────────────────────────

/**
 * Response from a refine or accumulate entry point.
 *
 * Encoding: result(u64 LE) + data(bytesVarLen)
 */
export class Response {
  static create(result: i64, data: BytesBlob): Response {
    return new Response(result, data);
  }

  private constructor(
    /** Ecalli result code. */
    public result: i64,
    /** Output data (may be empty). */
    public data: BytesBlob,
  ) {}

  /**
   * Encode a response and return it as a ptrAndLen-packed u64.
   * This is the primary way dispatch functions return results.
   */
  static with(ecalliResult: i64, data: BytesBlob | null = null): u64 {
    const bytes = data === null ? BytesBlob.empty() : data;
    const enc = Encoder.create(8 + 1 + bytes.raw.length);
    enc.u64(u64(ecalliResult));
    enc.bytesVarLen(bytes);
    return ptrAndLen(enc.finishRaw());
  }
}

export class ResponseCodec implements TryDecode<Response>, TryEncode<Response> {
  static create(): ResponseCodec {
    return new ResponseCodec();
  }
  private constructor() {}

  decode(d: Decoder): Result<Response, DecodeError> {
    const result = i64(d.u64());
    const data = d.bytesVarLen();
    if (d.isError) return Result.err<Response, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<Response, DecodeError>(Response.create(result, data));
  }

  encode(v: Response, e: Encoder): void {
    e.u64(u64(v.result));
    e.bytesVarLen(v.data);
  }
}

// ─── OptionalCodeHash ─────────────────────────────────────────────────

export class OptionalCodeHashCodec implements TryDecode<CodeHash | null>, TryEncode<CodeHash | null> {
  static create(bytes32: Bytes32Codec): OptionalCodeHashCodec {
    return new OptionalCodeHashCodec(bytes32);
  }
  private constructor(private readonly bytes32: Bytes32Codec) {}

  decode(d: Decoder): Result<CodeHash | null, DecodeError> {
    return d.optional<CodeHash>(this.bytes32);
  }

  encode(v: CodeHash | null, e: Encoder): void {
    e.optional<CodeHash>(this.bytes32, v);
  }
}
```

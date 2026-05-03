---
type: page
content_kind: code
url: >-
  https://github.com/tomusdrw/as-lan/blob/main/examples/library/assembly/storage.ts#L1-L49
title: examples/library/assembly/storage.ts
site: github.com/tomusdrw/as-lan
created_at: '2026-04-28T00:16:09+02:00'
last_modified: '2026-04-28T00:16:09+02:00'
chunk_index: 0
chunk_total: 1
content_sha: e73345900af0bf16870798cd143149b934ec1122c2bde8bced80c46b03ccd343
language: typescript
---
`examples/library/assembly/storage.ts` (lines 1–49)

```typescript
import { Bytes32, BytesBlob, DecodeError, Decoder, Encoder, Result, TryDecode, TryEncode } from "@fluffylabs/as-lan";

/** Storage value for a library mapping: preimage hash + its length. */
export class LibraryEntry {
  static create(hash: Bytes32, length: u32): LibraryEntry {
    return new LibraryEntry(hash, length);
  }

  private constructor(
    public readonly hash: Bytes32,
    public readonly length: u32,
  ) {}
}

export class LibraryEntryCodec implements TryDecode<LibraryEntry>, TryEncode<LibraryEntry> {
  static create(): LibraryEntryCodec {
    return new LibraryEntryCodec();
  }

  private constructor() {}

  encode(value: LibraryEntry, e: Encoder): void {
    e.bytesFixLen(value.hash.bytes);
    e.u32(value.length);
  }

  decode(d: Decoder): Result<LibraryEntry, DecodeError> {
    const hashBytes = d.bytesFixLen(32);
    if (d.isError) return Result.err<LibraryEntry, DecodeError>(DecodeError.MissingBytes);
    const hash = Bytes32.wrapUnchecked(hashBytes.raw);
    const length = d.u32();
    if (d.isError) return Result.err<LibraryEntry, DecodeError>(DecodeError.MissingBytes);
    return Result.ok<LibraryEntry, DecodeError>(LibraryEntry.create(hash, length));
  }
}

/** Build the storage key `"lib:<name>"` as ASCII bytes. */
export function libraryKey(name: string): BytesBlob {
  return BytesBlob.encodeAscii(`lib:${name}`);
}

/** Build the storage key `"lib:<name>"` when `name` is already an ASCII byte blob. */
export function libraryKeyFromBlob(name: BytesBlob): BytesBlob {
  const prefix = BytesBlob.encodeAscii("lib:");
  const e = Encoder.create(prefix.length + name.length);
  e.bytesFixLen(prefix);
  e.bytesFixLen(name);
  return e.finish();
}
```

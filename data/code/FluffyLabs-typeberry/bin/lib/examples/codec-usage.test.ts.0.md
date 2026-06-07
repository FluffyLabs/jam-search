---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/lib/examples/codec-usage.test.ts#L1-L25
title: bin/lib/examples/codec-usage.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1c39207fefe1b054e895074b7a41067ff3b11fb7d6101c158072963b4b3116d7
language: typescript
---
`bin/lib/examples/codec-usage.test.ts` (lines 1–25)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";

describe("Codec Examples", () => {
  it("should demonstrate JAM/GP encoding and decoding with simple types", async () => {
    // <!-- example:codec-basic -->
    const { codec, Encoder, Decoder } = await import("@typeberry/lib/codec");

    // Define a schema for fixed-size bytes
    const hashSchema = codec.bytes(32);

    // Create test data
    const { Bytes } = await import("@typeberry/lib/bytes");
    const testHash = Bytes.fill(32, 0x42);

    // Encode data
    const encoded = Encoder.encodeObject(hashSchema, testHash);

    // Decode data
    const decoded = Decoder.decodeObject(hashSchema, encoded);

    assert.deepStrictEqual(decoded, testHash);
    // <!-- /example:codec-basic -->
  });
});
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/codec/index.test.ts#L1-L95
title: packages/core/codec/index.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 641b94a8a6e7ca0038a77d6b27594fb56d839e0bbd44f16190e21cc41e140c73
language: typescript
---
`packages/core/codec/index.test.ts` (lines 1–95)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { BitVec, BytesBlob } from "@typeberry/bytes";
import { tryAsU8, tryAsU16, tryAsU32, tryAsU64 } from "@typeberry/numbers";
import { Decoder } from "./decoder.js";
import type { Descriptor } from "./descriptor.js";
import * as codec from "./descriptors.js";
import { Encoder } from "./encoder.js";
import { Skipper } from "./skip.js";

let seed = 1;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

describe("JAM encoder / decoder", () => {
  type Generator<T> = {
    generate: () => T;
    descriptor: Descriptor<T>;
  };

  function generator<T>(generate: () => T, descriptor: Descriptor<T>) {
    return {
      generate,
      descriptor,
    };
  }

  // biome-ignore lint/suspicious/noExplicitAny: I need to make sure that the generator output matches the type.
  const types: Generator<any>[] = [
    generator(() => tryAsU64(BigInt(Math.floor(random() * 2 ** 32)) ** 2n), codec.varU64),
    generator(() => tryAsU32(Math.floor(random() * 2 ** 32)), codec.varU32),
    generator(() => tryAsU64(BigInt(Math.floor(random() * 2 ** 32)) ** 2n), codec.u64),
    generator(() => tryAsU32(Math.floor(random() * 2 ** 32)), codec.u32),
    generator(() => Math.floor(random() * 2 ** 24), codec.u24),
    generator(() => tryAsU16(Math.floor(random() * 2 ** 16)), codec.u16),
    generator(() => tryAsU8(Math.floor(random() * 2 ** 8)), codec.u8),
    generator(() => BigInt(Math.floor(random() * 2 ** 32)) ** 2n - 2n ** 63n, codec.i64),
    generator(() => Math.floor(random() * 2 ** 32) - 2 ** 31, codec.i32),
    generator(() => Math.floor(random() * 2 ** 24) - 2 ** 23, codec.i24),
    generator(() => Math.floor(random() * 2 ** 16) - 2 ** 15, codec.i16),
    generator(() => Math.floor(random() * 2 ** 8) - 2 ** 7, codec.i8),

    generator(() => {
      let len = Math.floor(random() * 10_000);
      const res = new Uint8Array(len);
      while (--len >= 0) {
        res[len] = Math.floor(random() * 256);
      }
      return BytesBlob.blobFrom(res);
    }, codec.blob),

    generator(() => {
      let len = Math.floor(random() * 10_000);
      const vec = BitVec.empty(len);
      while (--len >= 0) {
        vec.setBit(len, random() > 0.5);
      }
      return vec;
    }, codec.bitVecVarLen),

    generator(() => {
      let len = 10;
      const vec = BitVec.empty(len);
      while (--len >= 0) {
        vec.setBit(len, random() > 0.5);
      }
      return vec;
    }, codec.bitVecFixLen(10)),
  ];

  for (const g of types) {
    const max = 100;
    for (let i = 0; i < max; i += 1) {
      it(`should run random tests for ${g.descriptor.name} (${i + 1} / ${max})`, () => {
        const encoder = Encoder.create();
        const expected = g.generate();
        g.descriptor.encode(encoder, expected);
        const encoded = encoder.viewResult();

        const decoder = Decoder.fromBytesBlob(encoded);
        // skipping
        const skip = Skipper.new(decoder.clone());
        g.descriptor.skip(skip);
        skip.decoder.finish();

        // decoding
        const result = g.descriptor.decode(decoder);
        decoder.finish();
        assert.deepStrictEqual(result, expected);
      });
    }
  }
});
```

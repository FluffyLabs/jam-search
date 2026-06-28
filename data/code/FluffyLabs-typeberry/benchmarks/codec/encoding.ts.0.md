---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/codec/encoding.ts#L1-L67
title: benchmarks/codec/encoding.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 8ce7510a187ac62bf2450f11a07fcddc5b14ca3dcda78a062e18dac982975873
language: typescript
---
`benchmarks/codec/encoding.ts` (lines 1–67)

```typescript
import assert from "node:assert";
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";

const inputEmpty = new ArrayBuffer(12);
const inputEncoded = new ArrayBuffer(12);
const view = new DataView(inputEncoded);
view.setInt32(0, -10, true);
view.setInt32(4, 0x42, true);
view.setInt32(8, 0xffff, true);

export default function run() {
  return suite(
    "Encoding numbers",

    add("manual encode", () => {
      const dest = new Uint8Array(inputEmpty);
      return () => {
        encode(-10, dest);
        encode(0x42, dest.subarray(4));
        encode(0xffff, dest.subarray(8));

        assert.deepStrictEqual(inputEmpty, inputEncoded);
      };
    }),

    add("int32array encode", () => {
      const dest = new Int32Array(inputEmpty);
      return () => {
        dest[0] = -10;
        dest[1] = 0x42;
        dest[2] = 0xffff;

        assert.deepStrictEqual(inputEmpty, inputEncoded);
      };
    }),

    add("dataview encode", () => {
      const dest = new DataView(inputEmpty);
      return () => {
        dest.setInt32(0, -10, true);
        dest.setInt32(4, 0x42, true);
        dest.setInt32(8, 0xffff, true);

        assert.deepStrictEqual(inputEmpty, inputEncoded);
      };
    }),

    cycle(),
    complete(),
    configure({}),
    ...save(import.meta.filename),
  );
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  run();
}

function encode(num: number, destination: Uint8Array) {
  let n = num < 0 ? 2 ** 32 + num : num;
  for (let i = 0; i < 4; i += 1) {
    const byte = n & 0xff;
    destination[i] = byte;
    n >>>= 8;
  }
}
```

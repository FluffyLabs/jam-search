---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/codec/decoding.ts#L1-L67
title: benchmarks/codec/decoding.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 90a4b756047f59135e2c343ff1128654753a5238a64bd0486bd6b018b7b50cf9
language: typescript
---
`benchmarks/codec/decoding.ts` (lines 1–67)

```typescript
import assert from "node:assert";
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";

const inputEncoded = new ArrayBuffer(12);
const view = new DataView(inputEncoded);
view.setInt32(0, -10, true);
view.setInt32(4, 0x42, true);
view.setInt32(8, 0xffff, true);

export default function run() {
  return suite(
    "Decoding numbers",

    add("manual decode", () => {
      const source = new Uint8Array(inputEncoded);
      return () => {
        const a = decode(source);
        const b = decode(source.subarray(4));
        const c = decode(source.subarray(8));

        assert.strictEqual(a, -10);
        assert.strictEqual(b, 0x42);
        assert.strictEqual(c, 0xffff);
      };
    }),

    add("int32array decode", () => {
      const source = new Int32Array(inputEncoded);
      return () => {
        const a = source[0];
        const b = source[1];
        const c = source[2];

        assert.strictEqual(a, -10);
        assert.strictEqual(b, 0x42);
        assert.strictEqual(c, 0xffff);
      };
    }),

    add("dataview decode", () => {
      const source = new DataView(inputEncoded);
      return () => {
        const a = source.getInt32(0, true);
        const b = source.getInt32(4, true);
        const c = source.getInt32(8, true);

        assert.strictEqual(a, -10);
        assert.strictEqual(b, 0x42);
        assert.strictEqual(c, 0xffff);
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

function decode(source: Uint8Array) {
  return source[0] + (source[1] << 8) + (source[2] << 16) + (source[3] << 24);
}
```

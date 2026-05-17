---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/math/mul_overflow.ts#L1-L32
title: benchmarks/math/mul_overflow.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 86ac1be537cbe8bb36cff7809c71476a408a35f0ffdeacae49c63859f3d7e68f
language: typescript
---
`benchmarks/math/mul_overflow.ts` (lines 1–32)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";

const a = 0xffffff12 >>> 0;
const b = 0x34123412 >>> 0;

const MAX_U32 = 2 ** 32;

export default function run() {
  return suite(
    "Wrapping Multiplication",

    add("multiply and bring back to u32", () => {
      const c1 = (a * b) >>> 0;
      return c1;
    }),

    add("multiply and take modulus", () => {
      const c1 = (a * b) % MAX_U32;
      return c1;
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
```

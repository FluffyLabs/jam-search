---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/math/add_one_overflow.ts#L1-L32
title: benchmarks/math/add_one_overflow.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 1
content_sha: d27600a5f01cdbbdc2d3f9831407636f353bebd2d57334630314536435f4a2b6
language: typescript
---
`benchmarks/math/add_one_overflow.ts` (lines 1–32)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";

const a = 0xff_ff_ff_ff >>> 0;
const ONE = 1 >>> 0;

const MAX_U32 = 2 ** 32;
// the purpose of this benchmark is to find the fastest option to calculate the next page number
export default function run() {
  return suite(
    "Wrapping add one (incrementation)",

    add("add and take modulus", () => {
      const c1 = (a + ONE) % MAX_U32;
      return c1;
    }),

    add("condition before calculation", () => {
      const c1 = a === MAX_U32 ? 0 : a + ONE;
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

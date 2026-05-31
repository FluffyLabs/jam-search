---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/codec/bigint.decode.ts#L1-L42
title: benchmarks/codec/bigint.decode.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 1f0d6fbf29e3fd78f8cb4bb7cfa793eff9c5015e069ca25af924185d873a7387
language: typescript
---
`benchmarks/codec/bigint.decode.ts` (lines 1–42)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";

class U64 {
  constructor(
    public upper = 0,
    public lower = 0,
  ) {}

  isEqualTo(other: U64) {
    return this.upper === other.upper && this.lower === other.lower;
  }
}

const input = new ArrayBuffer(8);
const view = new DataView(input);
view.setBigUint64(0, 2n ** 60n, true);

export default function run() {
  return suite(
    "BigInt decoding",

    add("decode custom", () => {
      const lower = view.getUint32(0);
      const upper = view.getUint32(4);
      return new U64(upper, lower);
    }),

    add("decode bigint", () => {
      return view.getBigUint64(0, true);
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

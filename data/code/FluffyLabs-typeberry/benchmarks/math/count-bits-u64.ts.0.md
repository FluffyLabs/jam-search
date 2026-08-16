---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/math/count-bits-u64.ts#L1-L49
title: benchmarks/math/count-bits-u64.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 2914d1a9b3c1f62e4411ccfbc34b2683e1d0697139344988f785578546ffc72f
language: typescript
---
`benchmarks/math/count-bits-u64.ts` (lines 1–49)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";

const randomU64 =
  (BigInt(Math.floor(Math.random() * 0x100000000)) << 32n) | BigInt(Math.floor(Math.random() * 0x100000000));

function countBits64Magic(val: bigint) {
  let x = val; // Ensure the input is treated as a BigInt
  x = x - ((x >> 1n) & 0x5555555555555555n); // Subtract pairs of bits
  x = (x & 0x3333333333333333n) + ((x >> 2n) & 0x3333333333333333n); // Sum groups of 4 bits
  x = (x + (x >> 4n)) & 0x0f0f0f0f0f0f0f0fn; // Sum groups of 8 bits
  x = x + (x >> 8n); // Sum groups of 16 bits
  x = x + (x >> 16n); // Sum groups of 32 bits
  x = x + (x >> 32n); // Sum groups of 64 bits
  return Number(x & 0x7fn); // Mask and return result as a regular number (0–64)
}

export function countBits64(val: bigint): number {
  let count = 0;
  let value = val;
  while (value !== 0n) {
    value &= value - 1n; // Clear the lowest set bit
    count++;
  }
  return count;
}

export default function run() {
  return suite(
    "Countings 1s in a u64 number",

    add("standard method", () => {
      return countBits64(randomU64);
    }),

    add("magic", () => {
      return countBits64Magic(randomU64);
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

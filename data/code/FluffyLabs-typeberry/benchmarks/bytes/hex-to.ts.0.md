---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/bytes/hex-to.ts#L1-L45
title: benchmarks/bytes/hex-to.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 670874b1a10fce9599bea00cd3fa70e88eeefeeb4538e651af0dec217b6901ee
language: typescript
---
`benchmarks/bytes/hex-to.ts` (lines 1–45)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";

const CODE_OF_0 = "0".charCodeAt(0);
const CODE_OF_a = "a".charCodeAt(0);

const size = 256;
const data: number[] = [];
for (let i = 0; i < size; i += 1) {
  data.push(i);
}

function byteToHexString(byte: number): string {
  const nibbleToString = (n: number) => {
    if (n > 9) {
      return String.fromCharCode(n + CODE_OF_a - 10);
    }
    return String.fromCharCode(n + CODE_OF_0);
  };

  return `${nibbleToString(byte >>> 4)}${nibbleToString(byte & 0xf)}`;
}

export default function run() {
  return suite(
    "Bytes / into hex",

    add("number toString + padding", () => {
      return data.map((byte) => byte.toString(16).padStart(2, "0"));
    }),

    add("manual", () => {
      return data.map((byte) => byteToHexString(byte));
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

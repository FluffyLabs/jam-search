---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/math/switch.ts#L1-L42
title: benchmarks/math/switch.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: b531a09a7203951000f76e57defdcf26e94df69ba7d72afdbaa1c51fe136c007
language: typescript
---
`benchmarks/math/switch.ts` (lines 1–42)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";

const x: number = 1;

export default function run() {
  return suite(
    "Switch vs if",

    add("switch", () => {
      switch (x) {
        case 0:
          return 15;
        case 1:
          return 5;
        default:
          return null;
      }
    }),

    add("if", () => {
      if (x === 0) {
        return 15;
      }

      if (x === 1) {
        return 5;
      }

      return null;
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

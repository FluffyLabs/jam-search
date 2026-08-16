---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/collections/map-set.ts#L1-L57
title: benchmarks/collections/map-set.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 4731af841cd6b2792da9905116e7bd4bccdf9c407737d8ba782e5eefd7fd598f
language: typescript
---
`benchmarks/collections/map-set.ts` (lines 1–57)

```typescript
import { pathToFileURL } from "node:url";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";

const NO_OF_UPDATES = 1000;

export default function run() {
  return suite(
    "Map: 2 gets and conditional set vs 1 get and 1 set ",

    add("2 gets + conditional set", () => {
      const key = 0;
      const initialValue = { counter: 0 };
      const map = new Map<number, typeof initialValue>();

      function conditionalSet(i: number) {
        const value = map.get(key) ?? initialValue;
        value.counter += i;
        if (!map.has(key)) {
          map.set(key, value);
        }
      }

      return () => {
        for (let k = 0; k < NO_OF_UPDATES; k += 1) {
          conditionalSet(k);
        }
      };
    }),

    add("1 get 1 set", () => {
      const key = 0;
      const initialValue = { counter: 0 };
      const map = new Map<number, typeof initialValue>();

      function unconditionalSet(i: number) {
        const value = map.get(key) ?? initialValue;
        value.counter += i;
        map.set(key, value);
      }

      return () => {
        for (let k = 0; k < NO_OF_UPDATES; k += 1) {
          unconditionalSet(k);
        }
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
```

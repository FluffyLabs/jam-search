---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/benchmarks/logger/index.ts#L1-L48
title: benchmarks/logger/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: be7c971b1b2979593c6a87135fb5038f6b017746fa707a8c0ca2c8851995a916
language: typescript
---
`benchmarks/logger/index.ts` (lines 1–48)

```typescript
import { pathToFileURL } from "node:url";
import util from "node:util";
import { add, complete, configure, cycle, save, suite } from "@typeberry/benchmark/setup.js";

class SomeClass {
  constructor(
    public value: number,
    public name: string,
  ) {}
}

/**
 * Since console.log is mostly just the `util.format` + access to stdout,
 * we overwrite it here to avoid spamming the console while running benchmarks.
 */
const logs: string[] = [];
function fakeConsoleLog(...args: unknown[]) {
  // biome-ignore lint/style/useTemplate: We want to be as close to the console.log impl as possible.
  logs.push(util.format.apply(null, args) + "\n");
}

export default function run() {
  return suite(
    "Logger",

    add("console.log with string concat", () => {
      const obj = new SomeClass(5, "hello world!");
      return () => {
        fakeConsoleLog(`[${obj.name}] has reached value ${obj.value}`);
      };
    }),

    add("console.log with args", () => {
      const obj = new SomeClass(5, "hello world!");
      return () => {
        fakeConsoleLog(obj.name, " has reached value ", obj.value);
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

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/misc/benchmark/setup.ts#L1-L36
title: packages/misc/benchmark/setup.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 48d8301c92132d0f559b0e2ac8d680d289e2a86b913244835ad2ef439de1f79d
language: typescript
---
`packages/misc/benchmark/setup.ts` (lines 1–36)

```typescript
export { add, complete, cycle, suite } from "benny";

import * as path from "node:path";
import { configure as rawConfigure, save as rawSave } from "benny";
import type { Config } from "benny/lib/internal/common-types.js";

export const DIST_DIR = path.resolve(`${import.meta.dirname}/../../../dist`);
export const BENCHMARKS_DIR = path.resolve(`${import.meta.dirname}/../../../benchmarks`);
export const OUTPUT_DIR_NAME = "output";
export const EXPECTED_DIR_NAME = "expected";

export function configure(obj: Config) {
  obj.minDisplayPrecision ??= 2;
  return rawConfigure(obj);
}

export function save(benchmarkPath: string) {
  const testPath = path.parse(benchmarkPath);
  const testSuite = path.basename(testPath.dir);
  const defaultParams = {
    file: testPath.name,
    folder: `${BENCHMARKS_DIR}/${testSuite}/${OUTPUT_DIR_NAME}`,
  };
  return [
    rawSave({
      ...defaultParams,
      details: false,
      format: "json",
    }),
    rawSave({
      ...defaultParams,
      details: true,
      format: "chart.html",
    }),
  ];
}
```

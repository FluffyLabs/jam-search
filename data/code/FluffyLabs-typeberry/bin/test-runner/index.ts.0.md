---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/index.ts#L1-L36
title: bin/test-runner/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 5f9fd775b306fb89a6126b2054c967ab62836c48a092a2fd294780e0f590b33b
language: typescript
---
`bin/test-runner/index.ts` (lines 1–36)

```typescript
import fs from "node:fs";
import { run } from "node:test";
import { spec } from "node:test/reporters";
import { Reporter } from "./reporter.js";

const distDir = `${import.meta.dirname}/../../dist`;
try {
  fs.mkdirSync(distDir);
} catch {
  // ignore
}

const suiteToRun = process.argv[2];
if (suiteToRun === undefined) {
  throw new Error("Provide 1 argument with a suite filename to run.");
}

const stream = run({
  files: [`${import.meta.dirname}/${suiteToRun}`],
  argv: process.argv.slice(3),
  timeout: 25 * 60 * 1000,
  concurrency: true,
}).on("test:fail", () => {
  process.exitCode = 1;
});

stream.compose(new spec()).pipe(process.stdout);

const reporter = Reporter.new(suiteToRun);
const fileStream = fs.createWriteStream(`${distDir}/${suiteToRun.replace(".ts", "")}.txt`, { flags: "a" });
stream
  .compose(reporter)
  .on("end", () => {
    reporter.finalize(fileStream);
  })
  .pipe(fileStream);
```

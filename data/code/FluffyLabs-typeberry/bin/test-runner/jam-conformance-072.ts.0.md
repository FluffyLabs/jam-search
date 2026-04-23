---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/jam-conformance-072.ts#L1-L19
title: bin/test-runner/jam-conformance-072.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: afaf001ed054df42d1eda8fa028a8a0a5138ae89a99b0df9b6ff00fddee65738
language: typescript
---
`bin/test-runner/jam-conformance-072.ts` (lines 1–19)

```typescript
import { logger, main, parseArgs } from "./common.js";
import { runners } from "./w3f/runners.js";

main(runners, "test-vectors/jam-conformance/fuzz-reports/0.7.2/traces", {
  ...parseArgs(process.argv.slice(2)),
  patterns: [".json"],
  ignored: [
    // genesis file is unparsable
    "genesis.json",

    // Block should be rejected?
    "1766565819_2010/00000225.json",
  ],
})
  .then((r) => logger.log`${r}`)
  .catch((e) => {
    logger.error`${e}`;
    process.exit(-1);
  });
```

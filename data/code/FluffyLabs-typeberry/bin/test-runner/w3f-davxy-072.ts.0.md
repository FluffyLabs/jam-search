---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/w3f-davxy-072.ts#L1-L20
title: bin/test-runner/w3f-davxy-072.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 8156d815d580564181481e61f8e551047f22a94b3eea53620ccc55eead9c89dc
language: typescript
---
`bin/test-runner/w3f-davxy-072.ts` (lines 1–20)

```typescript
import { logger, main, parseArgs } from "./common.js";
import { runners } from "./w3f/runners.js";

main(runners, "test-vectors/w3f-davxy_072", {
  ...parseArgs(process.argv.slice(2)),
  patterns: [".json"],
  accepted: {
    ".json": ["traces", "codec", "stf"],
  },
  ignored: [
    "genesis.json",
    "reports/tiny/report_with_no_results-1.json", // WorkItemsCount: Expected '1 <= count <= 16' got 0
    "reports/full/report_with_no_results-1.json", // WorkItemsCount: Expected '1 <= count <= 16' got 0
  ],
})
  .then((r) => logger.log`${r}`)
  .catch((e) => {
    logger.error`${e}`;
    process.exit(-1);
  });
```

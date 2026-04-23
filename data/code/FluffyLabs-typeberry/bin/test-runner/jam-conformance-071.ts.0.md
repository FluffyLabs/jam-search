---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/jam-conformance-071.ts#L1-L21
title: bin/test-runner/jam-conformance-071.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 09b7581c73ef5cde745c5fccb4902fd7ada0d6e970a20e6847f43a80093b51c9
language: typescript
---
`bin/test-runner/jam-conformance-071.ts` (lines 1–21)

```typescript
import { logger, main, parseArgs } from "./common.js";
import { runners } from "./w3f/runners.js";

main(runners, "test-vectors/jam-conformance/fuzz-reports/0.7.1/traces", {
  ...parseArgs(process.argv.slice(2)),
  patterns: [".json"],
  ignored: [
    // genesis file is unparsable
    "genesis.json",

    // unrecognized test cases
    // no timeslot in pre-state - valid behavior
    "1763371531/00000042.json",
    "1763489287/00000872.json",
  ],
})
  .then((r) => logger.log`${r}`)
  .catch((e) => {
    logger.error`${e}`;
    process.exit(-1);
  });
```

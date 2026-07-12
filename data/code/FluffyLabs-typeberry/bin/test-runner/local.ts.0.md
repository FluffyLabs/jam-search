---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/local.ts#L1-L20
title: bin/test-runner/local.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bd48b566c9b71de395a165d33b86a6de3430e5aa6036e57f55cb282ddc62649d
language: typescript
---
`bin/test-runner/local.ts` (lines 1–20)

```typescript
import { logger, main, parseArgs } from "./common.js";
import { runners } from "./w3f/runners.js";

// Runs test vectors committed in-repo under `test-vectors-local/`.
// Unlike the other suites, these are not fetched from an external submodule,
// so they can act as a permanent, must-pass regression gate (e.g. captured
// fuzzer traces). Drop `StateTransition` vectors under `test-vectors-local/traces/`.
main(runners, "test-vectors-local", {
  ...parseArgs(process.argv.slice(2)),
  accepted: {
    ".bin": ["traces"],
    ".json": ["traces"],
  },
  ignored: ["genesis.bin", "genesis.json"],
})
  .then((r) => logger.log`${r}`)
  .catch((e) => {
    logger.error`${e}`;
    process.exit(-1);
  });
```

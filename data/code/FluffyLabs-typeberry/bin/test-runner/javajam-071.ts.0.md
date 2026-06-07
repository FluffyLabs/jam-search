---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/bin/test-runner/javajam-071.ts#L1-L24
title: bin/test-runner/javajam-071.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: b4d88c967e2f0f46d3242db73bfb8b8757905fdacb9ad3df096ff22b11866cb0
language: typescript
---
`bin/test-runner/javajam-071.ts` (lines 1–24)

```typescript
import { StateTransition } from "@typeberry/state-vectors";
import { logger, main, parseArgs, runner, SelectedPvm } from "./common.js";
import { runStateTransition } from "./state-transition/state-transition.js";

const runners = [
  runner("state_transition", runStateTransition)
    .fromJson(StateTransition.fromJson)
    .fromBin(StateTransition.Codec)
    .withVariants([SelectedPvm.Ananas, SelectedPvm.Builtin]),
].map((x) => x.build());

main(runners, "test-vectors/javajam_071", {
  ...parseArgs(process.argv.slice(2)),
  patterns: [".json"],
  accepted: {
    ".json": ["stf/state_transitions/"],
  },
  ignored: ["testnetKeys.json", "stf/blocks/", "erasure_coding/"],
})
  .then((r) => logger.log`${r}`)
  .catch((e) => {
    logger.error`${e}`;
    process.exit(-1);
  });
```

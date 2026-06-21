---
type: page
content_kind: code
url: 'https://github.com/FluffyLabs/typeberry/blob/main/bin/convert/index.ts#L1-L26'
title: bin/convert/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: 32fb485db5e772e38bea80d36a2bd879615ec6c9de16251b52f05cc1087e5841
language: typescript
---
`bin/convert/index.ts` (lines 1–26)

```typescript
// biome-ignore-all lint/suspicious/noConsole: bin file

import { Level, Logger } from "@typeberry/logger";
import { workspacePathFix } from "@typeberry/utils";
import { type Arguments, HELP, parseArgs } from "./args.js";
import { main } from "./main.js";

Logger.configureAll(process.env.JAM_LOG ?? "", Level.LOG);
const withRelPath = workspacePathFix(`${import.meta.dirname}/../..`);

let args: Arguments;

try {
  args = parseArgs(process.argv.slice(2), withRelPath);
} catch (e) {
  console.error(`\n${e}\n`);
  console.info(HELP);
  process.exit(1);
}

try {
  main(args, withRelPath);
} catch (e) {
  console.error(`${e}`);
  process.exit(-1);
}
```

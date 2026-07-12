---
type: page
content_kind: code
url: 'https://github.com/tomusdrw/anan-as/blob/main/test/test-trace-replay.ts#L1-L25'
title: test/test-trace-replay.ts
site: github.com/tomusdrw/anan-as
created_at: '2026-07-10T09:46:52Z'
last_modified: '2026-07-10T09:46:52Z'
chunk_index: 0
chunk_total: 1
content_sha: 60dd7e477cffa53652c2da0c7c990ad94be75a7dec65f95259ae4b8ed4de4f13
language: typescript
---
`test/test-trace-replay.ts` (lines 1–25)

```typescript
#!/usr/bin/env node

import * as assert from "node:assert";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { replayTraceFile } from "../bin/src/trace-replay.js";
import { HasMetadata } from "../build/release.js";

const fixture = fileURLToPath(new URL("./fixtures/io-trace-output.log", import.meta.url));

if (!existsSync(fixture)) {
  throw new Error(`fixture not found: ${fixture}`);
}

const summary = replayTraceFile(fixture, {
  logs: false,
  hasMetadata: HasMetadata.Yes,
  verify: true,
});

console.log(summary);

assert.ok(summary.ecalliCount > 0, "Expected at least one ecalli entry");
assert.strictEqual(summary.termination.type, "HALT");
assert.ok(summary.success, "Expected successful re-execution");
```

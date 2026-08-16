---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/importer/bootstrap-main.ts#L1-L15
title: packages/workers/importer/bootstrap-main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: bc5417fe3f5562418051b4e08e1bcab511bad8b9e5591d67a37dca4471ab3fe1
language: typescript
---
`packages/workers/importer/bootstrap-main.ts` (lines 1–15)

```typescript
import { Telemetry } from "@typeberry/telemetry";
import { initWorker } from "@typeberry/workers-api-node";
import { main } from "./main.js";
import { ImporterConfig, protocol } from "./protocol.js";

const { config, comms } = await initWorker(protocol, ImporterConfig.Codec);
// Initialize OpenTelemetry for this worker
const sdk = Telemetry.initialize({
  nodeName: config.nodeName,
  worker: "importer",
});
await main(config, comms);
await sdk?.close();
// forcefully exit importer
process.exit(0);
```

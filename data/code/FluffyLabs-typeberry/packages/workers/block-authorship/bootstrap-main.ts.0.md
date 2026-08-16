---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/block-authorship/bootstrap-main.ts#L1-L22
title: packages/workers/block-authorship/bootstrap-main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 6bc046d6703e89ef7d1bc751a0cc561b00c921fe5ff911a1323ef3d69f755ca4
language: typescript
---
`packages/workers/block-authorship/bootstrap-main.ts` (lines 1–22)

```typescript
import { AUTHORSHIP_NETWORK_PORT, protocol as networkProtocol } from "@typeberry/comms-authorship-network";
import { Telemetry } from "@typeberry/telemetry";
import { Channel } from "@typeberry/workers-api";
import { initWorker } from "@typeberry/workers-api-node";
import { main } from "./main.js";
import { BlockAuthorshipConfig, protocol as mainProtocol } from "./protocol.js";

const { config, comms } = await initWorker(mainProtocol, BlockAuthorshipConfig.Codec);

// Initialize OpenTelemetry for this worker
const tele = Telemetry.initialize({
  worker: "generator",
  nodeName: config.nodeName,
});

const port = config.ports.get(AUTHORSHIP_NETWORK_PORT);
if (port === undefined) {
  throw new Error("Network port not found in config");
}
const networkingComms = Channel.tx(networkProtocol, port);
await main(config, comms, networkingComms);
await tele?.close();
```

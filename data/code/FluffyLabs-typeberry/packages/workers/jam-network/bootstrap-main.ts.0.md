---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/jam-network/bootstrap-main.ts#L1-L23
title: packages/workers/jam-network/bootstrap-main.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 9e7e60c6925296435ce2501de980b6cb74a6b25079bf9b24a12c38d187d7976c
language: typescript
---
`packages/workers/jam-network/bootstrap-main.ts` (lines 1–23)

```typescript
import { AUTHORSHIP_NETWORK_PORT, protocol as authorshipProtocol } from "@typeberry/comms-authorship-network";
import { Telemetry } from "@typeberry/telemetry";
import { Channel } from "@typeberry/workers-api";
import { initWorker } from "@typeberry/workers-api-node";
import { main } from "./main.js";
import { protocol as mainProtocol, NetworkingConfig } from "./protocol.js";

const { config, comms } = await initWorker(mainProtocol, NetworkingConfig.Codec);

// Initialize OpenTelemetry for this worker
const tele = Telemetry.initialize({
  nodeName: config.nodeName,
  worker: "network",
});

const port = config.ports.get(AUTHORSHIP_NETWORK_PORT);
if (port === undefined) {
  throw new Error("Authorship network port not found in config");
}

const networkingComms = Channel.rx(authorshipProtocol, port);
await main(config, comms, networkingComms);
await tele?.close();
```

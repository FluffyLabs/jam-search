---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/protocol.ts#L1-L32
title: packages/workers/api/protocol.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 91f9364b0b52f61538d67d37ffc84507cad62a84499f80f2333f1809e881a58f
language: typescript
---
`packages/workers/api/protocol.ts` (lines 1–32)

```typescript
import { Channel } from "./channel.js";
import { DirectPort } from "./port.js";
import type { Api, Internal, LousyProtocol, MessagesList } from "./types.js";

export function createProtocol<To, From>(
  name: string,
  {
    toWorker,
    fromWorker,
  }: {
    toWorker: To & MessagesList<To>;
    fromWorker: From & MessagesList<From>;
  },
): LousyProtocol<To, From> {
  return { name, toWorker, fromWorker };
}

export function startSameThread<To, From>(
  protocol: LousyProtocol<To, From>,
): {
  api: Api<LousyProtocol<To, From>>;
  internal: Internal<LousyProtocol<To, From>>;
} {
  const [txPort, rxPort] = DirectPort.pair();
  const api = Channel.tx(protocol, txPort);
  const internal = Channel.rx(protocol, rxPort);

  return {
    api,
    internal,
  };
}
```

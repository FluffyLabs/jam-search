---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/quic-utils.ts#L1-L19
title: packages/core/networking/quic-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 40a89361c4b4e62a3d001701fa2d1ffc8f467f3e351929277079f70fd1bb9f2b
language: typescript
---
`packages/core/networking/quic-utils.ts` (lines 1–19)

```typescript
import type { QUICClient, QUICConnection, QUICServer, QUICStream } from "@matrixai/quic";
import { Logger } from "@typeberry/logger";

const logger = Logger.new(import.meta.filename, "net");

export function addEventListener<T extends Event>(
  target: QUICServer | QUICClient | QUICConnection | QUICStream,
  // biome-ignore lint/suspicious/noExplicitAny: any is used here to match all possible event constructors.
  clazz: { new (...args: any[]): T },
  callback: (ev: T) => void | Promise<void>,
) {
  target.addEventListener(clazz.name, async (ev: T) => {
    try {
      await callback(ev);
    } catch (e) {
      logger.error`Unhandled exception in ${clazz.name} event handler: ${e}`;
    }
  });
}
```

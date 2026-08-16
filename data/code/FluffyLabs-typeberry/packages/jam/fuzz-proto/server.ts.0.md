---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/server.ts#L1-L19
title: packages/jam/fuzz-proto/server.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 67eefbb8bc9329250ebe08c6799cf1c9865523734c6aef99ea39c37469e6a41a
language: typescript
---
`packages/jam/fuzz-proto/server.ts` (lines 1–19)

```typescript
import type { BytesBlob } from "@typeberry/bytes";

/** A per-client handler of incoming socket messages. */
export interface IpcHandler {
  /** New data on the socket received. */
  onSocketMessage(msg: Uint8Array): Promise<void>;

  /** Socket closed or errored. */
  onClose(reason: { error?: Error }): void;
}

/** Sending data abstraction on a socket. */
export interface IpcSender {
  /** Write given data to the outgoing socket. */
  send(data: BytesBlob): void;

  /** Close the socket. */
  close(): void;
}
```

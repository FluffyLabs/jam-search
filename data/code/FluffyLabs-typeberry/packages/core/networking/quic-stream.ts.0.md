---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/quic-stream.ts#L1-L47
title: packages/core/networking/quic-stream.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 0
chunk_total: 1
content_sha: e2404000fce12f1258c5c47b9935a7f12087b03c99f7f8496c6c0ca79adb21ad
language: typescript
---
`packages/core/networking/quic-stream.ts` (lines 1–47)

```typescript
import { errors, events, type QUICStream } from "@matrixai/quic";
import { type Stream, type StreamErrorCallback, StreamErrorKind } from "./peers.js";
import { addEventListener } from "./quic-utils.js";

/** `QUICStream` adapter for our `Stream` API. */
export class QuicStream implements Stream {
  static new(stream: QUICStream) {
    return new QuicStream(stream);
  }

  private constructor(public readonly stream: QUICStream) {}

  get streamId() {
    return this.stream.streamId;
  }

  get readable() {
    return this.stream.readable;
  }

  get writable() {
    return this.stream.writable;
  }

  addOnError(onError: StreamErrorCallback): void {
    addEventListener(this.stream, events.EventQUICStreamError, (e) => {
      const isLocalClose =
        e.detail instanceof errors.ErrorQUICStreamLocalRead ||
        e.detail instanceof errors.ErrorQUICStreamLocalWrite ||
        e.detail instanceof errors.ErrorQUICConnectionLocal;

      const isRemoteClose = e.detail instanceof errors.ErrorQUICConnectionPeer;

      const kind = isLocalClose
        ? StreamErrorKind.LocalClose
        : isRemoteClose
          ? StreamErrorKind.RemoteClose
          : StreamErrorKind.Exception;

      onError(e.detail, kind);
    });
  }

  destroy(): Promise<void> {
    return this.stream.destroy();
  }
}
```

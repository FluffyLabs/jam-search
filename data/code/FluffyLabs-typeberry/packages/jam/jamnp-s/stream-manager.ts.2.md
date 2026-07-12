---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/stream-manager.ts#L229-L304
title: packages/jam/jamnp-s/stream-manager.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 726bbb663a1ac9b0ece6cfec386e43e5f54d14feca53a1e27218d125e62a13e1
language: typescript
---
`packages/jam/jamnp-s/stream-manager.ts` (lines 229–304)

```typescript
class QuicStreamSender implements StreamMessageSender {
  private bufferedLength = 0;
  private bufferedData: { data: BytesBlob; addPrefix: boolean }[] = [];
  private currentWriterPromise: Promise<void> | null = null;

  static new(streamId: StreamId, internal: Stream, onError: StreamErrorCallback) {
    return new QuicStreamSender(streamId, internal, onError);
  }

  private constructor(
    public readonly streamId: StreamId,
    private readonly internal: Stream,
    private readonly onError: StreamErrorCallback,
  ) {}

  /** Send given piece of data to the other end. */
  bufferAndSend(data: BytesBlob, prefixWithLength = true): boolean {
    if (this.bufferedLength > MAX_OUTGOING_BUFFER_BYTES) {
      return false;
    }
    this.bufferedData.push({ data, addPrefix: prefixWithLength });
    this.bufferedLength += data.length;
    // some other async task already has a lock, so it will keep writing.
    if (this.currentWriterPromise !== null) {
      return true;
    }
    // let's start an async task to write the buffer
    this.currentWriterPromise = handleAsyncErrors(
      async () => {
        const writer = this.internal.writable.getWriter();
        try {
          for (;;) {
            const chunk = this.bufferedData.shift();
            if (chunk === undefined) {
              return;
            }
            const { data, addPrefix } = chunk;
            logger.trace`🚰 <-- [${this.streamId}] write: ${data}`;
            if (addPrefix) {
              await writer.write(encodeMessageLength(data.raw));
            }
            await writer.write(data.raw);
            this.bufferedLength -= data.length;
          }
        } finally {
          writer.releaseLock();
          this.currentWriterPromise = null;
        }
      },
      (e) => this.onError(e, StreamErrorKind.Exception),
    );
    return true;
  }

  close(): void {
    handleAsyncErrors(
      async () => {
        logger.trace`🚰 <-- [${this.streamId}] closing`;
        if (this.currentWriterPromise !== null) {
          await this.currentWriterPromise;
        }
        await this.internal.writable.close();
      },
      (e) => this.onError(e, StreamErrorKind.Exception),
    );
  }

  /**
   * Wait for the data to finish writing.
   *
   * Usually should not be used, but may be useful for tests sometimes.
   */
  flush(): Promise<void> {
    return this.currentWriterPromise ?? Promise.resolve();
  }
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/stream-manager.ts#L117-L233
title: packages/jam/jamnp-s/stream-manager.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 1
chunk_total: 3
content_sha: c8fce8287daa99d028ba474be7ff0eae1a1559781f1931a2a5e2bd216fdc1513
language: typescript
---
`packages/jam/jamnp-s/stream-manager.ts` (lines 117–233)

```typescript
      bytes = BytesBlob.blobFrom(data.value !== undefined ? data.value : new Uint8Array());
      logger.trace`🚰 --> [${peer.id}:${streamId}] Initial data: ${bytes}`;
    } finally {
      reader.releaseLock();
    }

    if (bytes.raw.length < 1) {
      throw new Error(`Expected 1-byte stream identifier, got: ${bytes}`);
    }

    // stream kind
    const kind = tryAsStreamKind(bytes.raw[0]);
    const handler = this.incomingHandlers.get(kind);
    if (handler === undefined) {
      throw new Error(`Unsupported stream kind: ${kind}`);
    }

    logger.log`🚰 --> [${peer.id}:${stream.streamId}] Stream identified as: ${kind}`;

    this.registerStream(peer, handler, stream, BytesBlob.blobFrom(bytes.raw.subarray(1)));
  }

  private registerStream(peer: Peer, handler: StreamHandler, stream: Stream, initialData: BytesBlob): QuicStreamSender {
    const quicStreamId = tryAsU32(stream.streamId);
    const streamId = tryAsStreamId(`${peer.id}:${quicStreamId}`);

    // NOTE: `onError` callback may be called multiple times.
    const onError = (e: unknown, kind: StreamErrorKind) => {
      this.streams.delete(streamId);
      this.backgroundTasks.delete(streamId);

      if (kind === StreamErrorKind.Exception) {
        logger.error`🚰 --- [${streamId}] Stream error: ${e}. Disconnecting peer.`;
      }

      if (kind !== StreamErrorKind.LocalClose) {
        // whenever we have an error, we are going to inform the handler
        // and close the stream,
        handler.onClose(streamId, true);
        // but also disconnect from the peer.
        peer.disconnect();
      }
    };

    stream.addOnError(onError);

    const quicStream = QuicStreamSender.new(streamId, stream, onError);
    this.streams.set(streamId, {
      handler,
      streamSender: quicStream,
      peer,
    });

    // when we start reading the stream, there might be some data there already,
    // so we need to make sure that the stream is fully initialized.
    const readStreamPromise = handleAsyncErrors(
      () => readStreamForever(peer, handler, quicStream, initialData, stream.readable.getReader()),
      (e) => onError(e, StreamErrorKind.Exception),
    );

    // there could be an error already during the first read, so
    // only insert the background task when it's still active.
    if (this.streams.has(streamId)) {
      this.backgroundTasks.set(streamId, readStreamPromise);
    }

    return quicStream;
  }
}

async function readStreamForever(
  peer: Peer,
  handler: StreamHandler,
  quicStream: QuicStreamSender,
  initialData: BytesBlob,
  reader: ReadableStreamDefaultReader<Uint8Array>,
) {
  // finally start listening for more data.
  let bytes = initialData;
  let isDone = false;
  const callback = handleMessageFragmentation(
    (data) => {
      const bytes = BytesBlob.blobFrom(new Uint8Array(data));
      logger.trace`🚰 --> [${quicStream.streamId}] ${bytes}`;
      handler.onStreamMessage(quicStream, bytes);
    },
    () => {
      logger.error`🚰 --> [${quicStream.streamId}] got too much data. Disconnecting.`;
      peer.disconnect();
    },
  );

  for (;;) {
    // TODO [ToDr] We are going to read messages from the socket as fast as we can,
    // yet it doesn't mean we are able to handle them as fast. This should rather
    // be a promise, so that we can make back pressure here.
    callback(bytes.raw);

    if (isDone) {
      logger.log`🚰 --> [${quicStream.streamId}] remote finished.`;
      return;
    }

    // await for more data
    const data = await reader.read();
    isDone = data.done;
    bytes = BytesBlob.blobFrom(data.value !== undefined ? data.value : new Uint8Array());
  }
}

const MAX_OUTGOING_BUFFER_BYTES = 16384;

class QuicStreamSender implements StreamMessageSender {
  private bufferedLength = 0;
  private bufferedData: { data: BytesBlob; addPrefix: boolean }[] = [];
  private currentWriterPromise: Promise<void> | null = null;

```

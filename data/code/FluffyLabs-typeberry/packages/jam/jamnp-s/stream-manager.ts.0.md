---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/stream-manager.ts#L1-L123
title: packages/jam/jamnp-s/stream-manager.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 3
content_sha: c8a4d72d72044a47fcf76c58a76bcfe94a66af7d29bed6f3e81e8283891f7842
language: typescript
---
`packages/jam/jamnp-s/stream-manager.ts` (lines 1–123)

```typescript
import type { ReadableStreamDefaultReader } from "node:stream/web";
import { BytesBlob } from "@typeberry/bytes";
import { Logger } from "@typeberry/logger";
import {
  encodeMessageLength,
  handleMessageFragmentation,
  type Peer,
  type PeerId,
  type Stream,
  type StreamErrorCallback,
  StreamErrorKind,
} from "@typeberry/networking";
import { tryAsU32 } from "@typeberry/numbers";
import type { OK } from "@typeberry/utils";
import {
  type StreamHandler,
  type StreamId,
  type StreamKind,
  type StreamKindOf,
  type StreamMessageSender,
  tryAsStreamId,
  tryAsStreamKind,
} from "./protocol/stream.js";
import { handleAsyncErrors } from "./utils.js";

const logger = Logger.new(import.meta.filename, "stream");

export class StreamManager {
  /** A map of handlers for incoming stream kinds. */
  private readonly incomingHandlers: Map<StreamKind, StreamHandler> = new Map();
  /** A map of handlers for outgoing stream kinds. */
  private readonly outgoingHandlers: Map<StreamKind, StreamHandler> = new Map();

  /** A collection of open streams, peers and their handlers. */
  private readonly streams: Map<
    StreamId,
    {
      handler: StreamHandler;
      streamSender: QuicStreamSender;
      peer: Peer;
    }
  > = new Map();

  /** Promises for stream background tasks (reading data). */
  private readonly backgroundTasks: Map<StreamId, Promise<void>> = new Map();

  /** Add supported incoming handlers. */
  registerIncomingHandlers(...handlers: StreamHandler[]) {
    for (const handler of handlers) {
      this.incomingHandlers.set(handler.kind, handler);
    }
  }

  /** Add supported outgoing handlers. */
  registerOutgoingHandlers(...handlers: StreamHandler[]) {
    for (const handler of handlers) {
      this.outgoingHandlers.set(handler.kind, handler);
    }
  }

  /** Get peer associated with a stream. */
  getPeer(streamId: StreamId): Peer | null {
    return this.streams.get(streamId)?.peer ?? null;
  }

  /** Wait until all of the streams are closed. */
  async waitForFinish() {
    for (const task of this.backgroundTasks.values()) {
      await task;
    }
  }

  /** Attempt to find an already open stream of given kind. */
  withStreamOfKind<THandler extends StreamHandler>(
    peerId: PeerId,
    kind: StreamKindOf<THandler>,
    work: (handler: THandler, sender: QuicStreamSender) => OK,
  ): void {
    // TODO [ToDr] That might not be super performant, perhaps we should
    // maintain a mapping of Peer->open streams as well?
    for (const streamData of this.streams.values()) {
      if (streamData.handler.kind === kind && streamData.peer.id === peerId) {
        work(streamData.handler as THandler, streamData.streamSender);
        return;
      }
    }
  }

  /** Open a new stream of given kind, with the peer given. */
  withNewStream<THandler extends StreamHandler>(
    peer: Peer,
    kind: StreamKindOf<THandler>,
    work: (handler: THandler, sender: QuicStreamSender) => OK,
  ): void {
    const handler = this.outgoingHandlers.get(kind);
    if (handler === undefined) {
      throw new Error(`Unsupported outgoing stream kind: ${kind}`);
    }

    const stream = peer.openStream();
    const quicStream = this.registerStream(peer, handler, stream, BytesBlob.empty());
    // send the initial byte with stream kind
    quicStream.bufferAndSend(BytesBlob.blobFromNumbers([kind]), false);

    work(handler as THandler, quicStream);
  }

  /** Handle an incoming stream. */
  async onIncomingStream(peer: Peer, stream: Stream) {
    const { readable, streamId } = stream;
    const reader = readable.getReader();

    let bytes = BytesBlob.empty();
    try {
      // We expect a one-byte identifier first.
      const data = await reader.read();
      bytes = BytesBlob.blobFrom(data.value !== undefined ? data.value : new Uint8Array());
      logger.trace`🚰 --> [${peer.id}:${streamId}] Initial data: ${bytes}`;
    } finally {
      reader.releaseLock();
    }

    if (bytes.raw.length < 1) {
```

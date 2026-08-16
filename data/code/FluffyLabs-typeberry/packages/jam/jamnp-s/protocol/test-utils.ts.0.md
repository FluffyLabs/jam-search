---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/test-utils.ts#L1-L133
title: packages/jam/jamnp-s/protocol/test-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 657dc03be4a94a727b424cbf4c202b3ac9de6b62df91c30da7b60e749628bb5e
language: typescript
---
`packages/jam/jamnp-s/protocol/test-utils.ts` (lines 1–133)

```typescript
import type { BytesBlob } from "@typeberry/bytes";
import type { PeerId } from "@typeberry/networking";
import type { OK } from "@typeberry/utils";
import {
  type StreamHandler,
  type StreamId,
  type StreamKind,
  type StreamKindOf,
  type StreamMessageSender,
  tryAsStreamId,
} from "./stream.js";

const TEST_PEER_ID = "test-peer" as PeerId;

let nextTestStreamCounter = 0;

function nextTestStreamId(): StreamId {
  return tryAsStreamId(`${TEST_PEER_ID}:${nextTestStreamCounter++}`);
}

export class TestStreamSender implements StreamMessageSender {
  public readonly onSend: (data: BytesBlob) => void;
  public readonly onCloseCallback: () => void;

  constructor(
    public readonly streamId: StreamId,
    {
      onSend,
      onClose = () => {},
    }: {
      onSend: (data: BytesBlob) => void;
      onClose?: () => void;
    },
  ) {
    this.onSend = onSend;
    this.onCloseCallback = onClose;
  }

  bufferAndSend(data: BytesBlob): boolean {
    setImmediate(() => {
      this.onSend(data);
    });
    return true;
  }

  close(): void {
    setImmediate(() => {
      this.onCloseCallback();
    });
  }
}

/** We keep it low for the tests to run fast. */
const SIMULATED_STREAM_TIMEOUT_MS = 50;

export class TestMessageHandler {
  private readonly persistentStreams: Map<StreamKind, [StreamHandler, StreamMessageSender]> = new Map();
  private readonly registeredHandlers: Map<StreamKind, StreamHandler> = new Map();

  public readonly openStreams: Map<StreamId, [StreamHandler, StreamMessageSender]> = new Map();

  constructor(
    private readonly newStream: (id: StreamId, kind: StreamKind, onClose: () => void) => StreamMessageSender,
  ) {}

  registerHandlers(...handlers: StreamHandler[]) {
    for (const handler of handlers) {
      this.registeredHandlers.set(handler.kind, handler);
    }
  }

  streamReceive(id: StreamId, data: BytesBlob): void {
    const receiver = this.openStreams.get(id);
    if (receiver === undefined) {
      throw new Error(`Received data on a non-existent stream: ${id}. Data: ${data}.`);
    }

    receiver[0].onStreamMessage(receiver[1], data);
  }

  withStreamOfKind<THandler extends StreamHandler>(
    streamKind: StreamKindOf<THandler>,
    work: (handler: THandler, sender: StreamMessageSender) => OK,
  ): void {
    const handler = this.persistentStreams.get(streamKind);
    if (handler === undefined) {
      throw new Error(`Expected persistent stream not open! ${streamKind}`);
    }

    work(handler[0] as THandler, handler[1]);
  }

  withNewStream<THandler extends StreamHandler>(
    streamKind: StreamKindOf<THandler>,
    work: (handler: THandler, sender: StreamMessageSender) => OK,
  ): void {
    const streamId = nextTestStreamId();

    // since we are picking a non-existing stream id, there is no way of
    // conflicting here, so the `[handler, stream]` will be fresh.
    const [handler, stream] = this.createStreamIfNotPresent(streamId, streamKind);
    work(handler as THandler, stream);
  }

  /**
   * Open a receiving stream.
   *
   * This is meant to simulate newly incoming stream that is opened by the other party.
   */
  receiveStreamOpen(id: StreamId, kind: StreamKind) {
    // NOTE this method can be called again even if the stream exists
    // and it should be a no-op.
    this.createStreamIfNotPresent(id, kind);
  }

  /**
   * Close a receiving stream.
   *
   * This is called when the other end wants to terminate the stream cleanly.
   * Indicates that there is no more messages being sent on the stream.
   *
   * Otherwise if we close the stream on our end, it will be removed
   * regardless of this method being called after `SIMULATED_STREAM_TIMEOUT_MS`.
   */
  receiveStreamClose(id: StreamId) {
    const stream = this.openStreams.get(id);
    if (stream === undefined) {
      return;
    }
    this.openStreams.delete(id);
    stream[0].onClose(id, false);
  }

```

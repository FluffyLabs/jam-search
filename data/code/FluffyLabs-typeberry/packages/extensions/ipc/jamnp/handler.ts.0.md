---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/extensions/ipc/jamnp/handler.ts#L1-L120
title: packages/extensions/ipc/jamnp/handler.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 85fe305f73e527961bd7a071ee26f47d23b02a37515a0abad2f8d791af8b54a8
language: typescript
---
`packages/extensions/ipc/jamnp/handler.ts` (lines 1–120)

```typescript
import { BytesBlob } from "@typeberry/bytes";
import { Decoder, Encoder } from "@typeberry/codec";
import type { IpcHandler } from "@typeberry/fuzz-proto";
import {
  type StreamHandler,
  type StreamId,
  type StreamKind,
  type StreamKindOf,
  type StreamMessageSender,
  tryAsStreamId,
} from "@typeberry/jamnp-s";
import { Logger } from "@typeberry/logger";
import type { PeerId } from "@typeberry/networking";
import { assertNever } from "@typeberry/utils";
import type { IpcSender } from "../server.js";
import { type IpcStreamId, NewStream, StreamEnvelope, StreamEnvelopeType } from "./stream.js";

const IPC_PEER_ID = "ipc-peer" as PeerId;

/** Construct a protocol-level StreamId from an IPC-level numeric stream ID. */
function toStreamId(ipcStreamId: IpcStreamId): StreamId {
  return tryAsStreamId(`${IPC_PEER_ID}:${ipcStreamId}`);
}

export type ResponseHandler = (err: Error | null, response?: BytesBlob) => void;

const logger = Logger.new(import.meta.filename, "ext-ipc-jamnp");

type OnEnd = {
  finished: boolean;
  listen: Promise<void>;
  resolve: () => void;
  reject: (error: Error) => void;
};

export class JamnpIpcHandler implements IpcHandler {
  /** already initiated streams */
  private readonly streams: Map<IpcStreamId, StreamHandler> = new Map();
  /** streams awaiting confirmation from the other side. */
  private readonly pendingStreams: Map<IpcStreamId, boolean> = new Map();
  /** a collection of handlers for particular stream kind */
  private readonly streamHandlers: Map<StreamKind, StreamHandler> = new Map();
  /** termination promise + resolvers */
  private readonly onEnd: OnEnd;

  static new(sender: IpcSender) {
    return new JamnpIpcHandler(sender);
  }

  private constructor(private readonly sender: IpcSender) {
    let resolve = () => {};
    let reject = (_error: Error) => {};
    const listen = new Promise<void>((res, rej) => {
      resolve = res;
      reject = rej;
    });
    this.onEnd = {
      finished: false,
      listen,
      resolve,
      reject,
    };
  }

  /** Register stream handlers. */
  registerStreamHandlers(...handlers: StreamHandler[]) {
    for (const handler of handlers) {
      this.streamHandlers.set(handler.kind, handler);
    }
  }

  /** Re-use an existing stream of given kind if present. */
  withStreamOfKind<THandler extends StreamHandler>(
    streamKind: StreamKindOf<THandler>,
    work: (handler: THandler, sender: EnvelopeSender) => void,
  ): void {
    // find first stream id with given kind
    for (const [ipcStreamId, handler] of this.streams.entries()) {
      if (handler.kind === streamKind) {
        work(handler as THandler, EnvelopeSender.new(ipcStreamId, this.sender));
        return;
      }
    }
    throw new Error(`Missing handler for ${streamKind}!`);
  }

  /** Open a new stream of given kind. */
  withNewStream<THandler extends StreamHandler>(
    kind: StreamKindOf<THandler>,
    work: (handler: THandler, sender: EnvelopeSender) => void,
  ): void {
    const handler = this.streamHandlers.get(kind);
    if (handler === undefined) {
      throw new Error(`Stream with unregistered handler of kind: ${kind} was requested to be opened.`);
    }

    // pick a stream id
    const getRandomIpcStreamId = () => Math.floor(Math.random() * 2 ** 32) as IpcStreamId;
    const streams = this.streams;
    const ipcStreamId = (function findStreamId() {
      const s = getRandomIpcStreamId();
      if (!streams.has(s)) {
        return s;
      }
      return findStreamId();
    })();

    // register the stream
    this.streams.set(ipcStreamId, handler);
    this.pendingStreams.set(ipcStreamId, true);

    const sender = EnvelopeSender.new(ipcStreamId, this.sender);
    sender.open(NewStream.create({ streamByte: kind }));

    work(handler as THandler, sender);
  }

  /** Handle incoming message on that socket. */
  async onSocketMessage(msg: Uint8Array): Promise<void> {
    // decode the message as `StreamEnvelope`
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/testing.ts#L1-L136
title: packages/core/networking/testing.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 2
content_sha: 3295cf9f68efb566610df36487085ad9abcba4feecc028dc2ed83dc8f37179f9
language: typescript
---
`packages/core/networking/testing.ts` (lines 1–136)

```typescript
import { type ReadableStream, WritableStream } from "node:stream/web";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { ED25519_KEY_BYTES, type Ed25519Key } from "@typeberry/crypto";
import { Logger } from "@typeberry/logger";
import { asOpaqueType, OK } from "@typeberry/utils";
import type { DialOptions, Network } from "./network.js";
import {
  type Peer,
  type PeerAddress,
  type PeerId,
  PeersManagement,
  type Stream,
  type StreamCallback,
  type StreamErrorCallback,
} from "./peers.js";

const logger = Logger.new(import.meta.filename, "test:net");

/**
 * Stream implementation that allows manual control over
 * received and sent bytes.
 */
export class TestManualStream implements Stream {
  readonly writable: WritableStream;
  readonly readable: ReadableStream;

  readonly _writtenData: Uint8Array[] = [];
  readonly _incomingData: WritableStream;
  private readonly _onError: StreamErrorCallback[] = [];

  constructor(public readonly streamId: number) {
    // simulate incoming data stream
    const { writable, readable } = new TransformStream();
    this.readable = readable;
    this._incomingData = writable;

    // intercept outgoing data
    const _writtenData = this._writtenData;
    this.writable = new WritableStream({
      write(chunk) {
        _writtenData.push(chunk);
      },
    });
  }

  addOnError(onError: StreamErrorCallback): void {
    this._onError.push(onError);
  }

  async destroy(): Promise<void> {
    await this.writable.abort("destroying");
  }

  _simulateIncomingData(kindData: Uint8Array) {
    const writer = this._incomingData.getWriter();
    writer.write(kindData);
    writer.releaseLock();
  }
}

export class TestDuplexStream implements Stream {
  static pair(id: number) {
    const id1 = id;
    const id2 = id + 1_000_000;

    const { writable: w1, readable: r1 } = new TransformStream({
      transform(chunk, ctrl) {
        logger.trace`[${id}] <-- [${id2}] ${BytesBlob.blobFrom(chunk)}`;
        ctrl.enqueue(chunk);
      },
    });
    const { writable: w2, readable: r2 } = new TransformStream({
      transform(chunk, ctrl) {
        logger.trace`[${id}] --> [${id2}] ${BytesBlob.blobFrom(chunk)}`;
        ctrl.enqueue(chunk);
      },
    });

    return [new TestDuplexStream(id1, r1, w2), new TestDuplexStream(id2, r2, w1)] as const;
  }

  _onError: StreamErrorCallback[] = [];

  addOnError(onError: StreamErrorCallback): void {
    this._onError.push(onError);
  }

  constructor(
    public readonly streamId: number,
    public readonly readable: ReadableStream,
    public readonly writable: WritableStream,
  ) {}

  async destroy(): Promise<void> {}
}

/**
 * A representation of some remote peer, that's actually
 * coupled with another instance of `TestPeer`.
 *
 * This allows us to have two peers connected together,
 * so that when one opens a stream, the other one
 * receives a callback about new stream being opened, etc.
 */
export class TestPeer implements Peer {
  static pairUp(a: TestPeer, b: TestPeer) {
    a._otherPeer = b;
    b._otherPeer = a;

    return [a, b] as const;
  }

  private readonly _onIncomingStreams: StreamCallback[] = [];
  private _otherPeer: TestPeer | null = null;

  constructor(
    public _streamId: number,
    public readonly connectionId: string,
    public readonly address: PeerAddress,
    public readonly id: PeerId,
    public readonly key: Ed25519Key,
  ) {
    this.addOnIncomingStream((stream) => {
      logger.log`[${this.id}] incoming stream: ${stream.streamId}: ${this._onIncomingStreams.length} listeners`;
      return OK;
    });
  }

  addOnIncomingStream(streamCallback: StreamCallback): void {
    this._onIncomingStreams.push(streamCallback);
  }

  openStream(): Stream {
    const streamId = this._streamId++;
    const [txStream, rxStream] = TestDuplexStream.pair(streamId);
    logger.log`[peer:${this.id}] --> [peer:${this._otherPeer?.id}] opening streams ${txStream.streamId} -> ${rxStream.streamId}`;
```

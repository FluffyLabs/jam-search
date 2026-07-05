---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/stream-manager.test.ts#L1-L118
title: packages/jam/jamnp-s/stream-manager.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 0
chunk_total: 3
content_sha: 8a7341c89874aef6b2a9ba63e3f95ae27dce25f29c47bf2eb4649913606f5db0
language: typescript
---
`packages/jam/jamnp-s/stream-manager.test.ts` (lines 1–118)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import type { BytesBlob } from "@typeberry/bytes";
import { createDisconnectedPeer, TestManualStream } from "@typeberry/networking/testing.js";
import { OK } from "@typeberry/utils";
import {
  type StreamHandler,
  type StreamId,
  type StreamKind,
  type StreamMessageSender,
  tryAsStreamId,
} from "./protocol/stream.js";
import { StreamManager } from "./stream-manager.js";

// Test StreamHandler implementation
class TestStreamHandler implements StreamHandler {
  messages: Array<{ streamSender: StreamMessageSender; message: BytesBlob }> = [];
  closeCalls: Array<{ streamId: StreamId; isError: boolean }> = [];

  constructor(public readonly kind: StreamKind) {}

  onStreamMessage(streamSender: StreamMessageSender, message: BytesBlob): void {
    this.messages.push({ streamSender, message });
  }

  onClose(streamId: StreamId, isError: boolean): void {
    this.closeCalls.push({ streamId, isError });
  }
}

function createTestHandler(kind: StreamKind): TestStreamHandler {
  return new TestStreamHandler(kind);
}

describe("StreamManager", () => {
  describe("stream management", () => {
    it("should return null for unknown stream ID", () => {
      const manager = new StreamManager();
      const peer = manager.getPeer(tryAsStreamId("peer1:123"));

      assert.strictEqual(peer, null);
    });

    it("should open new stream and call work function", async () => {
      const manager = new StreamManager();
      const peer = createDisconnectedPeer("peer1");
      const handler = createTestHandler(1 as StreamKind);
      manager.registerOutgoingHandlers(handler);

      let workCalled = false;
      let senderFlush: Promise<void> = Promise.resolve();
      manager.withNewStream(peer, 1 as StreamKind, (h, sender) => {
        workCalled = true;
        assert.strictEqual(h, handler);
        assert.strictEqual(typeof sender.streamId, "string");
        senderFlush = sender.flush();
        return OK;
      });

      assert.strictEqual(workCalled, true);
      assert.strictEqual(peer._openedStreams.length, 1);

      await senderFlush;
      // Check that stream kind was sent
      const stream = peer._openedStreams[0];
      const written = stream._writtenData;
      assert.strictEqual(written.length, 1);
      assert.deepStrictEqual(written[0], new Uint8Array([1]));
    });

    it("should throw error for unsupported outgoing stream kind", () => {
      const manager = new StreamManager();
      const peer = createDisconnectedPeer("peer1");

      assert.throws(() => {
        manager.withNewStream(peer, 99 as StreamKind, () => OK);
      }, /Unsupported outgoing stream kind: 99/);
    });

    it("should find existing stream of given kind", () => {
      const manager = new StreamManager();
      const peer = createDisconnectedPeer("peer1");
      const handler = createTestHandler(1 as StreamKind);
      manager.registerOutgoingHandlers(handler);

      // Open a stream first
      manager.withNewStream(peer, 1 as StreamKind, () => OK);

      // Now try to find it
      let foundStream = false;
      manager.withStreamOfKind(peer.id, 1 as StreamKind, (h) => {
        foundStream = true;
        assert.strictEqual(h, handler);
        return OK;
      });

      assert.strictEqual(foundStream, true);
    });

    it("should not call work function if stream kind not found", () => {
      const manager = new StreamManager();
      const peer = createDisconnectedPeer("peer1");

      let workCalled = false;
      manager.withStreamOfKind(peer.id, 1 as StreamKind, () => {
        workCalled = true;
        return OK;
      });

      assert.strictEqual(workCalled, false);
    });
  });

  describe("incoming streams", () => {
    it("should handle incoming stream with valid kind", async () => {
      const manager = new StreamManager();
      const peerId = "peer1";
      const peer = createDisconnectedPeer(peerId);
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/stream-manager.test.ts#L114-L222
title: packages/jam/jamnp-s/stream-manager.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 1
chunk_total: 3
content_sha: 6bfeb89f06899f4391de4f3507ad8860214053aeb435495a0d4573e382a066a7
language: typescript
---
`packages/jam/jamnp-s/stream-manager.test.ts` (lines 114–222)

```typescript
  describe("incoming streams", () => {
    it("should handle incoming stream with valid kind", async () => {
      const manager = new StreamManager();
      const peerId = "peer1";
      const peer = createDisconnectedPeer(peerId);
      const handler = createTestHandler(1 as StreamKind);
      manager.registerIncomingHandlers(handler);
      const quicStreamId = 42;

      const stream = new TestManualStream(quicStreamId);

      // Simulate incoming stream with kind byte
      const kindData = new Uint8Array([1, 0x41, 0x42]); // kind=1, followed by some data
      stream._simulateIncomingData(kindData);
      stream._incomingData.close();

      await manager.onIncomingStream(peer, stream);

      // Check that peer is tracked
      const retrievedPeer = manager.getPeer(tryAsStreamId(`${peerId}:${quicStreamId}`));
      assert.strictEqual(retrievedPeer, peer);
    });

    it("should throw error for stream without kind byte", async () => {
      const manager = new StreamManager();
      const peer = createDisconnectedPeer("peer1");
      const stream = new TestManualStream(42);

      // Simulate empty stream
      stream._incomingData.close();

      await assert.rejects(() => manager.onIncomingStream(peer, stream), /Expected 1-byte stream identifier/);
    });

    it("should throw error for unsupported incoming stream kind", async () => {
      const manager = new StreamManager();
      const peer = createDisconnectedPeer("peer2");
      const stream = new TestManualStream(42);

      // Simulate incoming stream with unsupported kind
      stream._simulateIncomingData(new Uint8Array([99])); // unsupported kind
      stream._incomingData.close();

      await assert.rejects(() => manager.onIncomingStream(peer, stream), /Unsupported stream kind: 99/);
    });
  });

  describe("message handling", () => {
    it("should handle fragmented messages", async () => {
      const manager = new StreamManager();
      const peer = createDisconnectedPeer("peer3");
      const handler = createTestHandler(1 as StreamKind);
      manager.registerIncomingHandlers(handler);

      const stream = new TestManualStream(42);

      // Send initial kind byte
      stream._simulateIncomingData(new Uint8Array([1]));

      // Start handling the stream
      const handlePromise = manager.onIncomingStream(peer, stream);

      // Send a complete message with length prefix
      const message = new Uint8Array([0x41, 0x42, 0x43]);
      const lengthPrefix = new Uint8Array([3, 0, 0, 0]); // length = 3
      stream._simulateIncomingData(new Uint8Array([...lengthPrefix, ...message]));

      // Close the stream
      stream._incomingData.close();

      await handlePromise;
      await manager.waitForFinish();

      // Check that handler received the message
      assert.strictEqual(handler.messages.length, 1);
      assert.deepStrictEqual(handler.messages[0].message.raw, message);
    });
  });

  describe("error handling", () => {
    it("should handle stream errors and disconnect peer", async () => {
      const manager = new StreamManager();
      const peer = createDisconnectedPeer("peer2");
      const handler = createTestHandler(1 as StreamKind);
      manager.registerIncomingHandlers(handler);

      const stream = new TestManualStream(42);

      // Send initial kind byte
      stream._simulateIncomingData(new Uint8Array([1]));

      // Start handling the stream
      await manager.onIncomingStream(peer, stream);

      // Simulate stream error
      await stream._incomingData.abort(new Error("Test error"));

      // Check that peer was disconnected
      assert.strictEqual(peer._disconnectCalled, true);

      // Check that handler's onClose was called with error=true
      assert.strictEqual(handler.closeCalls.length, 1);
      assert.strictEqual(handler.closeCalls[0].isError, true);
    });
  });

  describe("lifecycle", () => {
    it("should wait for all streams to finish", async () => {
      const manager = new StreamManager();
```

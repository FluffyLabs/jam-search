---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/handler.test.ts#L330-L449
title: packages/jam/fuzz-proto/v1/handler.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 3
chunk_total: 5
content_sha: ae6283537ed22ea8f839f418addc2875f482f131115a8710c962f3864489cc6c
language: typescript
---
`packages/jam/fuzz-proto/v1/handler.test.ts` (lines 330–449)

```typescript
        type: MessageType.State,
        value: keyValues,
      };

      const fuzzTarget = FuzzTarget.new(mockMessageHandler, mockSender, spec);
      await completeHandshake(mockMessageHandler, mockSender, fuzzTarget);
      mockSender._sentData = []; // Clear handshake response

      const testMessage = encode(incomingMessage);

      await fuzzTarget.onSocketMessage(testMessage);

      assert.strictEqual(mockSender._closeCalled, 1);
      assert.strictEqual(mockSender._sentData.length, 0);
    });

    it("should close connection when receiving unexpected Error message", async () => {
      const mockMessageHandler = new MockV1MessageHandler();
      const mockSender = new MockSender();

      const error = ErrorMessage.create({ message: "test error" });

      const incomingMessage: Message = {
        type: MessageType.Error,
        value: error,
      };

      const fuzzTarget = FuzzTarget.new(mockMessageHandler, mockSender, spec);
      await completeHandshake(mockMessageHandler, mockSender, fuzzTarget);
      mockSender._sentData = []; // Clear handshake response

      const testMessage = encode(incomingMessage);

      await fuzzTarget.onSocketMessage(testMessage);

      assert.strictEqual(mockSender._closeCalled, 1);
      assert.strictEqual(mockSender._sentData.length, 0);
    });
  });

  describe("error handling", () => {
    it("should handle decoding error gracefully", async () => {
      const mockMessageHandler = new MockV1MessageHandler();
      const mockSender = new MockSender();

      const fuzzTarget = FuzzTarget.new(mockMessageHandler, mockSender, spec);

      // Create malformed message with valid length prefix but invalid data
      const malformedMessage = new Uint8Array(8);
      const dataView = new DataView(malformedMessage.buffer);
      dataView.setUint32(0, 4, true); // Claim 4 bytes
      malformedMessage.set([99, 1, 2, 3], 4); // Invalid message type 99

      await fuzzTarget.onSocketMessage(malformedMessage);

      assert.strictEqual(mockSender._closeCalled, 1);

      // Verify no handler methods were called
      assert.strictEqual(mockMessageHandler.getPeerInfo.mock.callCount(), 0);
      assert.strictEqual(mockMessageHandler.initialize.mock.callCount(), 0);
      assert.strictEqual(mockMessageHandler.importBlock.mock.callCount(), 0);
      assert.strictEqual(mockMessageHandler.getSerializedState.mock.callCount(), 0);
    });
  });

  // Helper methods
  function encode(message: Message): Uint8Array {
    return Encoder.encodeObject(messageCodec, message, spec).raw;
  }

  function decodeMessage(data: BytesBlob): Message {
    return Decoder.decodeObject(messageCodec, data, spec);
  }

  async function completeHandshake(
    mockMessageHandler: MockV1MessageHandler,
    mockSender: MockSender,
    fuzzTarget?: FuzzTarget,
  ): Promise<FuzzTarget> {
    const target = fuzzTarget ?? FuzzTarget.new(mockMessageHandler, mockSender, spec);

    const inputPeerInfo = PeerInfo.create({
      fuzzVersion: tryAsU8(1),
      features: tryAsU32(Features.Ancestry),
      appVersion: Version.create({
        major: tryAsU8(1),
        minor: tryAsU8(0),
        patch: tryAsU8(0),
      }),
      jamVersion: Version.create({
        major: tryAsU8(0),
        minor: tryAsU8(7),
        patch: tryAsU8(0),
      }),
      name: "test-fuzzer",
    });

    const responsePeerInfo = PeerInfo.create({
      fuzzVersion: tryAsU8(1),
      features: tryAsU32(Features.Ancestry),
      appVersion: Version.create({
        major: tryAsU8(1),
        minor: tryAsU8(0),
        patch: tryAsU8(0),
      }),
      jamVersion: Version.create({
        major: tryAsU8(0),
        minor: tryAsU8(7),
        patch: tryAsU8(0),
      }),
      name: "test-target",
    });

    mockMessageHandler.getPeerInfo.mock.mockImplementation(async () => responsePeerInfo);

    const handshakeMessage: Message = {
      type: MessageType.PeerInfo,
      value: inputPeerInfo,
    };

```

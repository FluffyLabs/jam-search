---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/handler.test.ts#L226-L335
title: packages/jam/fuzz-proto/v1/handler.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 5
content_sha: 32ca73b5cb903d1c0e0f20a00a15cf729ac1e66b1895140ebd2ba3a27ad72177
language: typescript
---
`packages/jam/fuzz-proto/v1/handler.test.ts` (lines 226–335)

```typescript
      mockMessageHandler.importBlock.mock.mockImplementation(async () =>
        Result.error(expectedError, () => "Test: ImportBlock error"),
      );

      const fuzzTarget = FuzzTarget.new(mockMessageHandler, mockSender, spec);
      await completeHandshake(mockMessageHandler, mockSender, fuzzTarget);
      mockSender._sentData = []; // Clear handshake response

      const testMessage = encode(incomingMessage);

      await fuzzTarget.onSocketMessage(testMessage);

      assert.strictEqual(mockMessageHandler.importBlock.mock.callCount(), 1);

      assert.strictEqual(mockSender._sentData.length, 1);
      const sentMessage = decodeMessage(mockSender._sentData[0]);
      assert.deepStrictEqual(sentMessage, expectedResponse);
      assert.strictEqual(mockSender._closeCalled, 0);
    });
  });

  describe("GetState message", () => {
    it("should handle GetState message and respond with State", async () => {
      const mockMessageHandler = new MockV1MessageHandler();
      const mockSender = new MockSender();

      const headerHash = Bytes.fill(32, 0xab).asOpaque<HeaderHash>();
      const keyValues = [
        KeyValue.create({
          key: Bytes.fill(31, 0x01),
          value: BytesBlob.parseBlob("0x1111"),
        }),
        KeyValue.create({
          key: Bytes.fill(31, 0x02),
          value: BytesBlob.parseBlob("0x2222"),
        }),
      ];

      const incomingMessage: Message = {
        type: MessageType.GetState,
        value: headerHash,
      };

      const expectedResponse: Message = {
        type: MessageType.State,
        value: keyValues,
      };

      mockMessageHandler.getSerializedState.mock.mockImplementation(async () => keyValues);

      const fuzzTarget = FuzzTarget.new(mockMessageHandler, mockSender, spec);
      await completeHandshake(mockMessageHandler, mockSender, fuzzTarget);
      mockSender._sentData = []; // Clear handshake response

      const testMessage = encode(incomingMessage);

      await fuzzTarget.onSocketMessage(testMessage);

      assert.strictEqual(mockMessageHandler.getSerializedState.mock.callCount(), 1);
      assert.deepStrictEqual(mockMessageHandler.getSerializedState.mock.calls[0].arguments, [headerHash]);

      assert.strictEqual(mockSender._sentData.length, 1);
      const sentMessage = decodeMessage(mockSender._sentData[0]);
      assert.deepStrictEqual(sentMessage, expectedResponse);
      assert.strictEqual(mockSender._closeCalled, 0);
    });
  });

  describe("unexpected messages", () => {
    it("should close connection when receiving unexpected StateRoot message", async () => {
      const mockMessageHandler = new MockV1MessageHandler();
      const mockSender = new MockSender();

      const stateRoot = Bytes.fill(32, 0xcd).asOpaque<StateRootHash>();

      const incomingMessage: Message = {
        type: MessageType.StateRoot,
        value: stateRoot,
      };

      const fuzzTarget = FuzzTarget.new(mockMessageHandler, mockSender, spec);
      await completeHandshake(mockMessageHandler, mockSender, fuzzTarget);
      mockSender._sentData = []; // Clear handshake response

      const testMessage = encode(incomingMessage);

      await fuzzTarget.onSocketMessage(testMessage);

      assert.strictEqual(mockSender._closeCalled, 1);
      assert.strictEqual(mockSender._sentData.length, 0);
    });

    it("should close connection when receiving unexpected State message", async () => {
      const mockMessageHandler = new MockV1MessageHandler();
      const mockSender = new MockSender();

      const keyValues = [
        KeyValue.create({
          key: Bytes.fill(31, 0x01),
          value: BytesBlob.parseBlob("0x1111"),
        }),
      ];

      const incomingMessage: Message = {
        type: MessageType.State,
        value: keyValues,
      };

      const fuzzTarget = FuzzTarget.new(mockMessageHandler, mockSender, spec);
      await completeHandshake(mockMessageHandler, mockSender, fuzzTarget);
```

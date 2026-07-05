---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/handler.test.ts#L115-L230
title: packages/jam/fuzz-proto/v1/handler.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 5
content_sha: 889aeb4eeed2a699d17c339934d532efb1c3d61360558b907d1d571fb959c5c3
language: typescript
---
`packages/jam/fuzz-proto/v1/handler.test.ts` (lines 115–230)

```typescript
      const mockMessageHandler = new MockV1MessageHandler();
      const mockSender = new MockSender();

      // Complete handshake first
      await completeHandshake(mockMessageHandler, mockSender);

      const header = testBlockView().header.materialize();
      const keyvals = [
        KeyValue.create({
          key: Bytes.fill(31, 0x01),
          value: BytesBlob.parseBlob("0x1111"),
        }),
      ];
      const ancestry = [
        AncestryItem.create({
          slot: tryAsTimeSlot(42),
          headerHash: Bytes.fill(32, 0xaa).asOpaque<HeaderHash>(),
        }),
      ];

      const initialize = Initialize.create({
        header,
        keyvals,
        ancestry,
      });

      const expectedStateRoot = Bytes.fill(32, 0xef).asOpaque<StateRootHash>();

      const incomingMessage: Message = {
        type: MessageType.Initialize,
        value: initialize,
      };

      const expectedResponse: Message = {
        type: MessageType.StateRoot,
        value: expectedStateRoot,
      };

      mockMessageHandler.initialize.mock.mockImplementation(async () => expectedStateRoot);

      const fuzzTarget = FuzzTarget.new(mockMessageHandler, mockSender, spec);
      await completeHandshake(mockMessageHandler, mockSender, fuzzTarget);
      mockSender._sentData = []; // Clear handshake response

      const testMessage = encode(incomingMessage);

      await fuzzTarget.onSocketMessage(testMessage);

      assert.strictEqual(mockMessageHandler.initialize.mock.callCount(), 1);
      assert.deepStrictEqual(mockMessageHandler.initialize.mock.calls[0].arguments, [initialize]);

      assert.strictEqual(mockSender._sentData.length, 1);
      const sentMessage = decodeMessage(mockSender._sentData[0]);
      assert.deepStrictEqual(sentMessage, expectedResponse);
      assert.strictEqual(mockSender._closeCalled, 0);
    });
  });

  describe("ImportBlock message", () => {
    it("should handle ImportBlock message and respond with StateRoot", async () => {
      const mockMessageHandler = new MockV1MessageHandler();
      const mockSender = new MockSender();

      const testBlock = testBlockView();
      const expectedStateRoot = Bytes.fill(32, 0xef).asOpaque<StateRootHash>();

      const incomingMessage: Message = {
        type: MessageType.ImportBlock,
        value: testBlock,
      };

      const expectedResponse: Message = {
        type: MessageType.StateRoot,
        value: expectedStateRoot,
      };

      mockMessageHandler.importBlock.mock.mockImplementation(async () => Result.ok(expectedStateRoot));

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

    it("should handle ImportBlock error and respond with Error", async () => {
      const mockMessageHandler = new MockV1MessageHandler();
      const mockSender = new MockSender();

      const testBlock = testBlockView();
      const expectedError = ErrorMessage.create({ message: "test error" });

      const incomingMessage: Message = {
        type: MessageType.ImportBlock,
        value: testBlock,
      };

      const expectedResponse: Message = {
        type: MessageType.Error,
        value: expectedError,
      };

      mockMessageHandler.importBlock.mock.mockImplementation(async () =>
        Result.error(expectedError, () => "Test: ImportBlock error"),
      );

      const fuzzTarget = FuzzTarget.new(mockMessageHandler, mockSender, spec);
```

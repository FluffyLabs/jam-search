---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/types.test.ts#L339-L456
title: packages/jam/fuzz-proto/v1/types.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 3
chunk_total: 4
content_sha: afc1104128ee03892509cc6ca462c2a032159da64552c022c9a5916fc3ab23bc
language: typescript
---
`packages/jam/fuzz-proto/v1/types.test.ts` (lines 339–456)

```typescript
      assert.strictEqual(decoded.type, MessageType.StateRoot);
      if (decoded.type !== MessageType.StateRoot) {
        assert.fail();
      }
      assert.deepStrictEqual(decoded.value, stateRoot);

      // Expected encoding from spec example:
      // 0x024559342d3a32a8cbc3c46399a80753abff8bf785aa9d6f623e0de045ba6701fe
      const expectedStateRoot = Bytes.parseBytes(
        "0x4559342d3a32a8cbc3c46399a80753abff8bf785aa9d6f623e0de045ba6701fe",
        HASH_SIZE,
      ).asOpaque<StateRootHash>();
      const expectedMessage: MessageData = {
        type: MessageType.StateRoot,
        value: expectedStateRoot,
      };

      const expectedEncoded = Encoder.encodeObject(messageCodec, expectedMessage, spec);
      const expectedHex = "0x024559342d3a32a8cbc3c46399a80753abff8bf785aa9d6f623e0de045ba6701fe";

      assert.strictEqual(expectedEncoded.toString(), expectedHex);
    });

    it("should encode and decode Initialize message", () => {
      const header = testBlockView().header.materialize();
      const keyvals = [
        KeyValue.create({
          key: Bytes.fill(31, 0x33),
          value: BytesBlob.parseBlob("0xffeedd"),
        }),
      ];
      const ancestry: AncestryItem[] = [];

      const initialize = Initialize.create({
        header,
        keyvals,
        ancestry,
      });

      const message: MessageData = {
        type: MessageType.Initialize,
        value: initialize,
      };

      const encoded = Encoder.encodeObject(messageCodec, message, spec);
      const decoded = Decoder.decodeObject(messageCodec, encoded, spec);

      assert.strictEqual(decoded.type, MessageType.Initialize);
      if (decoded.type !== MessageType.Initialize) {
        assert.fail();
      }
      assert.deepStrictEqual(decoded.value.header, header);
      assert.strictEqual(decoded.value.keyvals.length, 1);
      assert.strictEqual(decoded.value.ancestry.length, 0);
    });

    it("should encode and decode Error message", () => {
      const error = ErrorMessage.create({ message: "test error" });

      const message: MessageData = {
        type: MessageType.Error,
        value: error,
      };

      const encoded = Encoder.encodeObject(messageCodec, message, spec);
      const decoded = Decoder.decodeObject(messageCodec, encoded, spec);

      assert.strictEqual(decoded.type, MessageType.Error);
      if (decoded.type !== MessageType.Error) {
        assert.fail();
      }
      assert.ok(decoded.value instanceof ErrorMessage);
    });

    it("should handle message type encoding consistency", () => {
      const error = ErrorMessage.create({ message: "test error" });
      const message: MessageData = {
        type: MessageType.Error,
        value: error,
      };

      const encoded = Encoder.encodeObject(messageCodec, message, spec);

      // First byte should be the message type (255 for Error)
      assert.strictEqual(encoded.raw[0], 255);
    });

    it("should encode different message types with correct tags", () => {
      // Test Initialize message type tag
      const header = testBlockView().header.materialize();
      const initialize = Initialize.create({
        header,
        keyvals: [],
        ancestry: [],
      });

      const initializeMessage: MessageData = {
        type: MessageType.Initialize,
        value: initialize,
      };

      const initializeEncoded = Encoder.encodeObject(messageCodec, initializeMessage, spec);
      // First byte should be 1 for Initialize message type
      assert.strictEqual(initializeEncoded.raw[0], 1);

      // Test ImportBlock message type tag
      const block = testBlockView();
      const importBlockMessage: MessageData = {
        type: MessageType.ImportBlock,
        value: block,
      };

      const importBlockEncoded = Encoder.encodeObject(messageCodec, importBlockMessage, spec);
      // First byte should be 3 for ImportBlock message type
      assert.strictEqual(importBlockEncoded.raw[0], 3);
    });
  });
});
```

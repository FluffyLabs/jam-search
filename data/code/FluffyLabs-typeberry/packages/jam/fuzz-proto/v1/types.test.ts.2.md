---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/types.test.ts#L231-L345
title: packages/jam/fuzz-proto/v1/types.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 2
chunk_total: 4
content_sha: 231f992ce3f8d9a7468dd4b4bd70bc1288681250e9dde5fef8fa2bd0591a6034
language: typescript
---
`packages/jam/fuzz-proto/v1/types.test.ts` (lines 231–345)

```typescript
  describe("Initialize", () => {
    it("should encode and decode initialize message", () => {
      const header = testBlockView().header.materialize();
      const keyvals = [
        KeyValue.create({
          key: Bytes.fill(31, 0x11),
          value: BytesBlob.parseBlob("0xaabbcc"),
        }),
      ];
      const ancestry = [
        AncestryItem.create({
          slot: tryAsTimeSlot(42),
          headerHash: Bytes.fill(32, 0xcc).asOpaque<HeaderHash>(),
        }),
      ];

      const initialize = Initialize.create({
        header,
        keyvals,
        ancestry,
      });

      const encoded = Encoder.encodeObject(Initialize.Codec, initialize, spec);
      const decoded = Decoder.decodeObject(Initialize.Codec, encoded, spec);

      assert.deepStrictEqual(decoded.header, header);
      assert.strictEqual(decoded.keyvals.length, 1);
      assert.deepStrictEqual(decoded.keyvals[0].key, keyvals[0].key);
      assert.deepStrictEqual(decoded.keyvals[0].value, keyvals[0].value);
      assert.strictEqual(decoded.ancestry.length, 1);
      assert.strictEqual(decoded.ancestry[0].slot, 42);
    });
  });

  describe("ErrorMessage", () => {
    it("should encode and decode error message", () => {
      const error = ErrorMessage.create({ message: "error" });

      const encoded = Encoder.encodeObject(ErrorMessage.Codec, error, spec);
      const decoded = Decoder.decodeObject(ErrorMessage.Codec, encoded, spec);

      assert.ok(decoded instanceof ErrorMessage);
      assert.strictEqual(encoded.toString(), "0x056572726f72");
    });
  });

  describe("Message", () => {
    it("should encode and decode PeerInfo message", () => {
      const peerInfo = PeerInfo.create({
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
        name: "test-peer",
      });

      const message: MessageData = {
        type: MessageType.PeerInfo,
        value: peerInfo,
      };

      const encoded = Encoder.encodeObject(messageCodec, message, spec);
      const decoded = Decoder.decodeObject(messageCodec, encoded, spec);

      assert.strictEqual(decoded.type, MessageType.PeerInfo);
      if (decoded.type !== MessageType.PeerInfo) {
        assert.fail();
      }
      assert.strictEqual(decoded.value.name, "test-peer");
      assert.strictEqual(decoded.value.fuzzVersion, 1);
      assert.strictEqual(decoded.value.features, Features.Ancestry);
    });

    it("should encode and decode StateRoot message", () => {
      const stateRoot = Bytes.fill(32, 0xcd).asOpaque<StateRootHash>();

      const message: MessageData = {
        type: MessageType.StateRoot,
        value: stateRoot,
      };

      const encoded = Encoder.encodeObject(messageCodec, message, spec);
      const decoded = Decoder.decodeObject(messageCodec, encoded, spec);

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

```

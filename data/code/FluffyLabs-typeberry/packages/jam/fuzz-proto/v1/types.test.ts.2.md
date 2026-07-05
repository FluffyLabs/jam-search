---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/types.test.ts#L230-L345
title: packages/jam/fuzz-proto/v1/types.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 4
content_sha: 4473673b498dc87d621c34345053d8609299b413e4e4a1e2dc902d6851fce754
language: typescript
---
`packages/jam/fuzz-proto/v1/types.test.ts` (lines 230–345)

```typescript
      assert.strictEqual(decoded.length, 2);
      assert.strictEqual(decoded[0].slot, 100);
      assert.strictEqual(decoded[1].slot, 101);
      assert.deepStrictEqual(decoded[0].headerHash, Bytes.fill(32, 0x01).asOpaque<HeaderHash>());
      assert.deepStrictEqual(decoded[1].headerHash, Bytes.fill(32, 0x02).asOpaque<HeaderHash>());
    });

    it("should handle empty ancestry", () => {
      const ancestry: AncestryItem[] = [];

      const encoded = Encoder.encodeObject(ancestryCodec, ancestry, spec);
      const decoded = Decoder.decodeObject(ancestryCodec, encoded, spec);

      assert.strictEqual(decoded.length, 0);
    });
  });

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
```

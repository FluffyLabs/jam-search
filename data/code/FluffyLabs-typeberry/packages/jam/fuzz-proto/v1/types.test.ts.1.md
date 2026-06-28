---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/types.test.ts#L122-L233
title: packages/jam/fuzz-proto/v1/types.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 1
chunk_total: 4
content_sha: 7c9b0ea1cc9478e191a1f6b44c79582a486e62e28c0387e84c9ecb83bb1a400c
language: typescript
---
`packages/jam/fuzz-proto/v1/types.test.ts` (lines 122–233)

```typescript
      //   "jam_version": { "major": 0, "minor": 1, "patch": 23 },
      //   "app_version": { "major": 0, "minor": 7, "patch": 0 },
      //   "name": "fuzzer"
      // }
      // Expected: 0x0001020000000001170007000666757a7a6572

      const peerInfo = PeerInfo.create({
        fuzzVersion: tryAsU8(1),
        features: tryAsU32(Features.Fork),
        jamVersion: Version.create({
          major: tryAsU8(0),
          minor: tryAsU8(1),
          patch: tryAsU8(23),
        }),
        appVersion: Version.create({
          major: tryAsU8(0),
          minor: tryAsU8(7),
          patch: tryAsU8(0),
        }),
        name: "fuzzer",
      });

      const encoded = Encoder.encodeObject(PeerInfo.Codec, peerInfo, spec);
      const expectedHex = "0x01020000000001170007000666757a7a6572";

      assert.strictEqual(encoded.toString(), expectedHex);
    });
  });

  describe("KeyValue", () => {
    it("should encode and decode key-value pairs", () => {
      const key = Bytes.fill(31, 0x42);
      const value = BytesBlob.parseBlob("0xdeadbeef");

      const keyValue = KeyValue.create({ key, value });

      const encoded = Encoder.encodeObject(KeyValue.Codec, keyValue, spec);
      const decoded = Decoder.decodeObject(KeyValue.Codec, encoded, spec);

      assert.deepStrictEqual(decoded.key, key);
      assert.deepStrictEqual(decoded.value, value);
    });
  });

  describe("State", () => {
    it("should encode and decode state as sequence of key-value pairs", () => {
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

      const encoded = Encoder.encodeObject(stateCodec, keyValues, spec);
      const decoded = Decoder.decodeObject(stateCodec, encoded, spec);

      assert.strictEqual(decoded.length, 2);
      assert.deepStrictEqual(decoded[0].key, keyValues[0].key);
      assert.deepStrictEqual(decoded[0].value, keyValues[0].value);
      assert.deepStrictEqual(decoded[1].key, keyValues[1].key);
      assert.deepStrictEqual(decoded[1].value, keyValues[1].value);
    });

    it("should handle empty state", () => {
      const keyValues: KeyValue[] = [];

      const encoded = Encoder.encodeObject(stateCodec, keyValues, spec);
      const decoded = Decoder.decodeObject(stateCodec, encoded, spec);

      assert.strictEqual(decoded.length, 0);
    });
  });

  describe("AncestryItem", () => {
    it("should encode and decode ancestry item", () => {
      const ancestryItem = AncestryItem.create({
        slot: tryAsTimeSlot(12345),
        headerHash: Bytes.fill(32, 0xab).asOpaque<HeaderHash>(),
      });

      const encoded = Encoder.encodeObject(AncestryItem.Codec, ancestryItem, spec);
      const decoded = Decoder.decodeObject(AncestryItem.Codec, encoded, spec);

      assert.strictEqual(decoded.slot, 12345);
      assert.deepStrictEqual(decoded.headerHash, Bytes.fill(32, 0xab).asOpaque<HeaderHash>());
    });
  });

  describe("Ancestry", () => {
    it("should encode and decode ancestry sequence", () => {
      const ancestry = [
        AncestryItem.create({
          slot: tryAsTimeSlot(100),
          headerHash: Bytes.fill(32, 0x01).asOpaque<HeaderHash>(),
        }),
        AncestryItem.create({
          slot: tryAsTimeSlot(101),
          headerHash: Bytes.fill(32, 0x02).asOpaque<HeaderHash>(),
        }),
      ];

      const encoded = Encoder.encodeObject(ancestryCodec, ancestry, spec);
      const decoded = Decoder.decodeObject(ancestryCodec, encoded, spec);

      assert.strictEqual(decoded.length, 2);
      assert.strictEqual(decoded[0].slot, 100);
      assert.strictEqual(decoded[1].slot, 101);
      assert.deepStrictEqual(decoded[0].headerHash, Bytes.fill(32, 0x01).asOpaque<HeaderHash>());
```

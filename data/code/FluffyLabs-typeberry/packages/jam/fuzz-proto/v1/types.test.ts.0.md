---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/types.test.ts#L1-L127
title: packages/jam/fuzz-proto/v1/types.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 0
chunk_total: 4
content_sha: a3631061d44a52bac931a373b351b359afd36717aecc3aa40028cecaa63a1e74
language: typescript
---
`packages/jam/fuzz-proto/v1/types.test.ts` (lines 1–127)

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { type HeaderHash, type StateRootHash, tryAsTimeSlot } from "@typeberry/block";
import { testBlockView } from "@typeberry/block/test-helpers.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Decoder, Encoder } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { HASH_SIZE } from "@typeberry/hash";
import { tryAsU8, tryAsU32 } from "@typeberry/numbers";
import {
  AncestryItem,
  ancestryCodec,
  ErrorMessage,
  Features,
  Initialize,
  KeyValue,
  type MessageData,
  MessageType,
  messageCodec,
  PeerInfo,
  stateCodec,
  Version,
} from "./types.js";

const spec = tinyChainSpec;

describe("Fuzzer V1 Data Structures", () => {
  describe("Version", () => {
    it("should encode and decode a version", () => {
      const version = Version.create({
        major: tryAsU8(1),
        minor: tryAsU8(2),
        patch: tryAsU8(3),
      });

      const encoded = Encoder.encodeObject(Version.Codec, version, spec);
      const decoded = Decoder.decodeObject(Version.Codec, encoded, spec);

      assert.strictEqual(decoded.major, 1);
      assert.strictEqual(decoded.minor, 2);
      assert.strictEqual(decoded.patch, 3);
    });

    it("should handle maximum values", () => {
      const version = Version.create({
        major: tryAsU8(255),
        minor: tryAsU8(255),
        patch: tryAsU8(255),
      });

      const encoded = Encoder.encodeObject(Version.Codec, version, spec);
      const decoded = Decoder.decodeObject(Version.Codec, encoded, spec);

      assert.strictEqual(decoded.major, 255);
      assert.strictEqual(decoded.minor, 255);
      assert.strictEqual(decoded.patch, 255);
    });

    it("should parse version from string", () => {
      const version = Version.tryFromString("1.2.3");

      assert.strictEqual(version.major, 1);
      assert.strictEqual(version.minor, 2);
      assert.strictEqual(version.patch, 3);
    });

    it("should ignore the git hash / pre-release suffix", () => {
      const version = Version.tryFromString("0.7.0-15ccd70");

      assert.strictEqual(version.major, 0);
      assert.strictEqual(version.minor, 7);
      assert.strictEqual(version.patch, 0);
    });

    it("should ignore the build metadata suffix", () => {
      const version = Version.tryFromString("1.2.3+build.42");

      assert.strictEqual(version.major, 1);
      assert.strictEqual(version.minor, 2);
      assert.strictEqual(version.patch, 3);
    });
  });

  describe("PeerInfo", () => {
    it("should encode and decode peer info with features", () => {
      const appVersion = Version.create({
        major: tryAsU8(1),
        minor: tryAsU8(0),
        patch: tryAsU8(0),
      });

      const jamVersion = Version.create({
        major: tryAsU8(0),
        minor: tryAsU8(7),
        patch: tryAsU8(0),
      });

      const peerInfo = PeerInfo.create({
        fuzzVersion: tryAsU8(1),
        features: tryAsU32(Features.Ancestry | Features.Fork),
        appVersion,
        jamVersion,
        name: "test-fuzzer",
      });

      const encoded = Encoder.encodeObject(PeerInfo.Codec, peerInfo, spec);
      const decoded = Decoder.decodeObject(PeerInfo.Codec, encoded, spec);

      assert.strictEqual(decoded.fuzzVersion, 1);
      assert.strictEqual(decoded.features, 0b11);
      assert.strictEqual(decoded.name, "test-fuzzer");
      assert.strictEqual(decoded.appVersion.major, 1);
      assert.strictEqual(decoded.jamVersion.major, 0);
      assert.strictEqual(decoded.jamVersion.minor, 7);
    });

    it("should encode example from spec", () => {
      // Example from spec:
      // {
      //   "fuzz_version": 1,
      //   "features": 2,
      //   "jam_version": { "major": 0, "minor": 1, "patch": 23 },
      //   "app_version": { "major": 0, "minor": 7, "patch": 0 },
      //   "name": "fuzzer"
      // }
      // Expected: 0x0001020000000001170007000666757a7a6572

```

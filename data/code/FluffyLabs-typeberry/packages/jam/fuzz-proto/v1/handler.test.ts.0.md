---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/handler.test.ts#L1-L120
title: packages/jam/fuzz-proto/v1/handler.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 0
chunk_total: 5
content_sha: a7c8aedc1d4693ea92d57799d0e93826f498e220ddb28f325ccdeeecfb4a8ffe
language: typescript
---
`packages/jam/fuzz-proto/v1/handler.test.ts` (lines 1–120)

```typescript
import assert from "node:assert";
import { describe, it, type Mock, mock } from "node:test";
import { type BlockView, type HeaderHash, type StateRootHash, tryAsTimeSlot } from "@typeberry/block";
import { testBlockView } from "@typeberry/block/test-helpers.js";
import { Bytes, BytesBlob } from "@typeberry/bytes";
import { Decoder, Encoder } from "@typeberry/codec";
import { tinyChainSpec } from "@typeberry/config";
import { tryAsU8, tryAsU32 } from "@typeberry/numbers";
import { Result } from "@typeberry/utils";
import type { IpcSender } from "../server.js";
import { type FuzzMessageHandler, FuzzTarget } from "./handler.js";
import {
  AncestryItem,
  ErrorMessage,
  Features,
  Initialize,
  KeyValue,
  type Message,
  MessageType,
  messageCodec,
  PeerInfo,
  Version,
} from "./types.js";

const spec = tinyChainSpec;

class MockV1MessageHandler implements FuzzMessageHandler {
  getPeerInfo: Mock<(value: PeerInfo) => Promise<PeerInfo>> = mock.fn();
  initialize: Mock<(value: Initialize) => Promise<StateRootHash>> = mock.fn();
  importBlock: Mock<(value: BlockView) => Promise<Result<StateRootHash, ErrorMessage>>> = mock.fn();
  getSerializedState: Mock<(value: HeaderHash) => Promise<KeyValue[]>> = mock.fn();
}

class MockSender implements IpcSender {
  _sentData: BytesBlob[] = [];
  _closeCalled = 0;

  send(data: BytesBlob): void {
    this._sentData.push(data);
  }

  close(): void {
    this._closeCalled++;
  }
}

describe("FuzzV1Target Handler", () => {
  describe("handshake and PeerInfo", () => {
    it("should handle PeerInfo message and complete handshake", async () => {
      const mockMessageHandler = new MockV1MessageHandler();
      const mockSender = new MockSender();

      const inputPeerInfo = PeerInfo.create({
        fuzzVersion: tryAsU8(1),
        features: tryAsU32(Features.Ancestry | Features.Fork),
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
        features: tryAsU32(Features.Ancestry), // Subset of input features
        appVersion: Version.create({
          major: tryAsU8(1),
          minor: tryAsU8(1),
          patch: tryAsU8(0),
        }),
        jamVersion: Version.create({
          major: tryAsU8(0),
          minor: tryAsU8(7),
          patch: tryAsU8(1),
        }),
        name: "response-target",
      });

      const incomingMessage: Message = {
        type: MessageType.PeerInfo,
        value: inputPeerInfo,
      };

      const expectedResponse: Message = {
        type: MessageType.PeerInfo,
        value: responsePeerInfo,
      };

      mockMessageHandler.getPeerInfo.mock.mockImplementation(async () => responsePeerInfo);

      const fuzzTarget = FuzzTarget.new(mockMessageHandler, mockSender, spec);
      const testMessage = encode(incomingMessage);

      await fuzzTarget.onSocketMessage(testMessage);

      // Verify handshake completion and feature negotiation
      assert.strictEqual(fuzzTarget.hasFeature(Features.Ancestry), true);
      assert.strictEqual(fuzzTarget.hasFeature(Features.Fork), false);

      assert.strictEqual(mockSender._sentData.length, 1);
      const sentMessage = decodeMessage(mockSender._sentData[0]);
      assert.deepStrictEqual(sentMessage, expectedResponse);
      assert.strictEqual(mockSender._closeCalled, 0);
    });
  });

  describe("Initialize message", () => {
    it("should handle Initialize message and respond with StateRoot", async () => {
      const mockMessageHandler = new MockV1MessageHandler();
      const mockSender = new MockSender();

      // Complete handshake first
      await completeHandshake(mockMessageHandler, mockSender);

```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/handler.ts#L1-L126
title: packages/jam/fuzz-proto/v1/handler.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 2
content_sha: 7cbd58a063454be00f866e074dfb43fc356851338c6829ba98026096836ae6b7
language: typescript
---
`packages/jam/fuzz-proto/v1/handler.ts` (lines 1–126)

```typescript
import type { BlockView, HeaderHash, StateRootHash } from "@typeberry/block";
import { Decoder, Encoder } from "@typeberry/codec";
import type { ChainSpec } from "@typeberry/config";
import { Logger } from "@typeberry/logger";
import { assertNever, type Result } from "@typeberry/utils";
import type { IpcHandler, IpcSender } from "../server.js";
import {
  ErrorMessage,
  Features,
  type Initialize,
  type KeyValue,
  type Message,
  type MessageData,
  MessageType,
  messageCodec,
  type PeerInfo,
} from "./types.js";

const logger = Logger.new(import.meta.filename, "ext-ipc-fuzz-v1");

/**
 * Handler interface for v1 fuzzer protocol messages.
 * https://github.com/davxy/jam-conformance/blob/main/fuzz-proto/fuzz-v1.asn
 */
export interface FuzzMessageHandler {
  /**
   * Handshake and versioning exchange.
   * Target waits to receive the fuzzer's PeerInfo message before sending its own.
   */
  getPeerInfo(value: PeerInfo): Promise<PeerInfo>;

  /**
   * Initialize or reset target state.
   * Returns the state root of the initialized state.
   */
  initialize(header: Initialize): Promise<StateRootHash>;

  /**
   * Process block and return resulting state root.
   * May return an Error if the block import fails.
   */
  importBlock(value: BlockView): Promise<Result<StateRootHash, ErrorMessage>>;

  /** Retrieve posterior state associated to given header hash. */
  getSerializedState(value: HeaderHash): Promise<KeyValue[]>;
}

export class FuzzTarget implements IpcHandler {
  private sessionFeatures = 0;

  static new(msgHandler: FuzzMessageHandler, sender: IpcSender, spec: ChainSpec) {
    return new FuzzTarget(msgHandler, sender, spec);
  }

  private constructor(
    public readonly msgHandler: FuzzMessageHandler,
    public readonly sender: IpcSender,
    public readonly spec: ChainSpec,
  ) {}

  async onSocketMessage(msg: Uint8Array): Promise<void> {
    // attempt to decode the messsage
    try {
      const message = Decoder.decodeObject(messageCodec, msg, this.spec);
      logger.log`[${message.type}] incoming message`;

      await this.processAndRespond(message);
    } catch (e) {
      logger.error`Error while processing fuzz v1 message: ${e}`;
      logger.error`${e}`;
      if (e instanceof Error) {
        logger.error`${e.stack ?? ""}`;
      }
      this.sender.close();
    }
  }

  private async processAndRespond(message: MessageData): Promise<void> {
    let response: Message | null = null;

    switch (message.type) {
      case MessageType.PeerInfo: {
        // only support V1
        if (message.value.fuzzVersion !== 1) {
          logger.warn`Unsupported fuzzer protocol version: ${message.value.fuzzVersion}. Closing`;
          this.sender.close();
          return;
        }

        // Handle handshake
        const ourPeerInfo = await this.msgHandler.getPeerInfo(message.value);

        // Calculate session features (intersection of both peer features)
        this.sessionFeatures = message.value.features & ourPeerInfo.features;

        logger.info`Handshake completed. Shared features: 0b${this.sessionFeatures.toString(2)}`;
        logger.log`Feature ancestry: ${(this.sessionFeatures & Features.Ancestry) !== 0}`;
        logger.log`Feature fork: ${(this.sessionFeatures & Features.Fork) !== 0}`;

        response = {
          type: MessageType.PeerInfo,
          value: ourPeerInfo,
        };
        break;
      }

      case MessageType.Initialize: {
        try {
          const stateRoot = await this.msgHandler.initialize(message.value);
          response = {
            type: MessageType.StateRoot,
            value: stateRoot,
          };
        } catch (e) {
          response = {
            type: MessageType.Error,
            value: ErrorMessage.create({ message: `initialize error: ${e}` }),
          };
        }
        break;
      }

      case MessageType.ImportBlock: {
        try {
          const result = await this.msgHandler.importBlock(message.value);

```

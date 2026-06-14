---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/ce-128-block-request.ts#L1-L121
title: packages/jam/jamnp-s/protocol/ce-128-block-request.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 3
content_sha: 166d2891fac897ef74a2845abca39419345ab62f9700811fff9528882386169b
language: typescript
---
`packages/jam/jamnp-s/protocol/ce-128-block-request.ts` (lines 1–121)

```typescript
import { Block, type BlockView, type HeaderHash } from "@typeberry/block";
import { BytesBlob } from "@typeberry/bytes";
import { type CodecRecord, codec, Decoder, Encoder } from "@typeberry/codec";
import type { ChainSpec } from "@typeberry/config";
import type { BlocksDb } from "@typeberry/database";
import { HASH_SIZE } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import { tryAsU8, type U32 } from "@typeberry/numbers";
import { Result, WithDebug } from "@typeberry/utils";
import { type StreamHandler, type StreamId, type StreamMessageSender, tryAsStreamKind } from "./stream.js";

/**
 * JAM-SNP CE-128 stream.
 *
 * https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-128-block-request
 */

export const STREAM_KIND = tryAsStreamKind(128);

export enum Direction {
  /**
   * Ascending exclusive.
   *
   * The sequence of blocks in the response should start with a child of the given block, followed by a grandchild, and so on.
   */
  AscExcl = 0,
  /**
   * Descending inclusive.
   *
   * The sequence of blocks in the response should start with the given block, followed by its parent, grandparent, and so on.
   */
  DescIncl = 1,
}

export class BlockRequest extends WithDebug {
  static Codec = codec.Class(BlockRequest, {
    headerHash: codec.bytes(HASH_SIZE).asOpaque<HeaderHash>(),
    direction: codec.u8.convert<Direction>(
      (i) => tryAsU8(i),
      (i) => {
        switch (i) {
          case Direction.AscExcl:
            return Direction.AscExcl;
          case Direction.DescIncl:
            return Direction.DescIncl;
          default:
            throw new Error(`Invalid 'Direction' value: ${i}`);
        }
      },
    ),
    maxBlocks: codec.u32,
  });

  static create({ headerHash, direction, maxBlocks }: CodecRecord<BlockRequest>) {
    return new BlockRequest(headerHash, direction, maxBlocks);
  }

  private constructor(
    public readonly headerHash: HeaderHash,
    public readonly direction: Direction,
    public readonly maxBlocks: U32,
  ) {
    super();
  }
}

const logger = Logger.new(import.meta.filename, "protocol/ce-128");

export class ServerHandler implements StreamHandler<typeof STREAM_KIND> {
  kind = STREAM_KIND;

  static new(
    chainSpec: ChainSpec,
    getBlockSequence: (streamId: StreamId, hash: HeaderHash, direction: Direction, maxBlocks: U32) => BlockView[],
  ) {
    return new ServerHandler(chainSpec, getBlockSequence);
  }

  private constructor(
    private readonly chainSpec: ChainSpec,
    private readonly getBlockSequence: (
      streamId: StreamId,
      hash: HeaderHash,
      direction: Direction,
      maxBlocks: U32,
    ) => BlockView[],
  ) {}

  onStreamMessage(sender: StreamMessageSender, message: BytesBlob): void {
    const request = Decoder.decodeObject(BlockRequest.Codec, message);
    logger.log`[${sender.streamId}] Client has requested: ${request}`;

    const blocks = this.getBlockSequence(sender.streamId, request.headerHash, request.direction, request.maxBlocks);

    sender.bufferAndSend(
      Encoder.encodeObject(codec.sequenceFixLen(Block.Codec.View, blocks.length), blocks, this.chainSpec),
    );
    sender.close();
  }

  onClose(_streamId: StreamId) {}
}

export class ClientHandler implements StreamHandler<typeof STREAM_KIND> {
  kind = STREAM_KIND;

  private promiseResolvers: Map<StreamId, (value: BlockView[]) => void> = new Map();
  private promiseRejectors: Map<StreamId, (reason?: unknown) => void> = new Map();

  static new(chainSpec: ChainSpec) {
    return new ClientHandler(chainSpec);
  }

  private constructor(private readonly chainSpec: ChainSpec) {}

  onStreamMessage(sender: StreamMessageSender, message: BytesBlob): void {
    const { streamId } = sender;
    if (!this.promiseResolvers.has(streamId)) {
      throw new Error("Received an unexpected message from the server.");
    }
    const blocks = Decoder.decodeSequence(Block.Codec.View, message, this.chainSpec);
```

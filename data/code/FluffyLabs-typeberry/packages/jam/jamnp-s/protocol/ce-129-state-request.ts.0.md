---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/ce-129-state-request.ts#L1-L121
title: packages/jam/jamnp-s/protocol/ce-129-state-request.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 2
content_sha: 8de43254a68128c8edb82633abb250803c6f007f33d3b700e399bc1a5c69e95a
language: typescript
---
`packages/jam/jamnp-s/protocol/ce-129-state-request.ts` (lines 1–121)

```typescript
import type { HeaderHash } from "@typeberry/block";
import { Bytes, type BytesBlob } from "@typeberry/bytes";
import { type CodecRecord, codec, Decoder, Encoder } from "@typeberry/codec";
import { HASH_SIZE } from "@typeberry/hash";
import { Logger } from "@typeberry/logger";
import { tryAsU32, type U32 } from "@typeberry/numbers";
import { TRUNCATED_KEY_BYTES, TrieNode } from "@typeberry/trie/nodes.js";
import { WithDebug } from "@typeberry/utils";
import { type StreamHandler, type StreamId, type StreamMessageSender, tryAsStreamKind } from "./stream.js";

/**
 * JAM-SNP CE-129 stream.
 *
 * https://github.com/zdave-parity/jam-np/blob/main/simple.md#ce-129-state-request
 */

export const STREAM_KIND = tryAsStreamKind(129);
const TRIE_NODE_BYTES = 64;

export type Key = Bytes<TRUNCATED_KEY_BYTES>;

const trieNodeCodec = codec.bytes(TRIE_NODE_BYTES).convert<TrieNode>(
  (i) => Bytes.fromBlob(i.raw, TRIE_NODE_BYTES),
  (i) => new TrieNode(i.raw),
);

export class KeyValuePair extends WithDebug {
  static Codec = codec.Class(KeyValuePair, {
    key: codec.bytes(TRUNCATED_KEY_BYTES),
    value: codec.blob,
  });

  static create({ key, value }: CodecRecord<KeyValuePair>) {
    return new KeyValuePair(key, value);
  }

  static new(key: Key, value: BytesBlob) {
    return new KeyValuePair(key, value);
  }

  private constructor(
    public readonly key: Key,
    public readonly value: BytesBlob,
  ) {
    super();
  }
}

export class StateResponse extends WithDebug {
  static Codec = codec.Class(StateResponse, {
    keyValuePairs: codec.sequenceVarLen(KeyValuePair.Codec),
  });

  static create({ keyValuePairs }: CodecRecord<StateResponse>) {
    return new StateResponse(keyValuePairs);
  }

  private constructor(public readonly keyValuePairs: KeyValuePair[]) {
    super();
  }
}

export class StateRequest extends WithDebug {
  static Codec = codec.Class(StateRequest, {
    headerHash: codec.bytes(HASH_SIZE).asOpaque<HeaderHash>(),
    startKey: codec.bytes(TRUNCATED_KEY_BYTES),
    endKey: codec.bytes(TRUNCATED_KEY_BYTES),
    maximumSize: codec.u32,
  });

  static create({ headerHash, startKey, endKey, maximumSize }: CodecRecord<StateRequest>) {
    return new StateRequest(headerHash, startKey, endKey, maximumSize);
  }

  private constructor(
    public readonly headerHash: HeaderHash,
    public readonly startKey: Key,
    public readonly endKey: Key,
    public readonly maximumSize: U32,
  ) {
    super();
  }
}

const logger = Logger.new(import.meta.filename, "protocol/ce-129");

export class Handler implements StreamHandler<typeof STREAM_KIND> {
  kind = STREAM_KIND;

  private readonly boundaryNodes: Map<StreamId, TrieNode[]> = new Map();
  private readonly onResponse: Map<StreamId, (state: StateResponse) => void> = new Map();

  static new(
    isServer = false,
    getBoundaryNodes?: (hash: HeaderHash, startKey: Key, endKey: Key) => TrieNode[],
    getKeyValuePairs?: (hash: HeaderHash, startKey: Key, endKey: Key) => KeyValuePair[],
  ) {
    return new Handler(isServer, getBoundaryNodes, getKeyValuePairs);
  }

  private constructor(
    private readonly isServer: boolean = false,
    private readonly getBoundaryNodes?: (hash: HeaderHash, startKey: Key, endKey: Key) => TrieNode[],
    private readonly getKeyValuePairs?: (hash: HeaderHash, startKey: Key, endKey: Key) => KeyValuePair[],
  ) {
    if (isServer && (getBoundaryNodes === undefined || getKeyValuePairs === undefined)) {
      throw new Error("getBoundaryNodes and getKeyValuePairs are required in server mode.");
    }
  }

  onStreamMessage(sender: StreamMessageSender, message: BytesBlob): void {
    const { streamId } = sender;
    if (this.isServer) {
      logger.info`[${streamId}][server]: Received request.`;

      if (this.getBoundaryNodes === undefined || this.getKeyValuePairs === undefined) {
        return;
      }

      const request = Decoder.decodeObject(StateRequest.Codec, message);

```

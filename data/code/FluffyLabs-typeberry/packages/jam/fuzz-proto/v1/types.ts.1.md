---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/types.ts#L153-L287
title: packages/jam/fuzz-proto/v1/types.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-07T07:54:29Z'
last_modified: '2026-05-07T07:54:29Z'
chunk_index: 1
chunk_total: 3
content_sha: d6175b43e16187316c0073c176dd5a6af94fa6ba83fad5554cd5daa89d087532
language: typescript
---
`packages/jam/fuzz-proto/v1/types.ts` (lines 153–287)

```typescript
export type Ancestry = AncestryItem[];

/**
 * Initialize ::= SEQUENCE {
 *     header Header,
 *     keyvals State,
 *     ancestry Ancestry
 * }
 */
export class Initialize extends WithDebug {
  static Codec = codec.Class(Initialize, {
    header: Header.Codec,
    keyvals: stateCodec,
    ancestry: ancestryCodec,
  });

  static create({ header, keyvals, ancestry }: CodecRecord<Initialize>) {
    return new Initialize(header, keyvals, ancestry);
  }

  private constructor(
    public readonly header: Header,
    public readonly keyvals: KeyValue[],
    public readonly ancestry: Ancestry,
  ) {
    super();
  }
}

/** GetState ::= HeaderHash */
export const getStateCodec = codec.bytes(HASH_SIZE).asOpaque<HeaderHash>();
export type GetState = HeaderHash;

/** StateRoot ::= StateRootHash */
export const stateRootCodec = codec.bytes(HASH_SIZE).asOpaque<StateRootHash>();
export type StateRoot = StateRootHash;

/** Error ::= UTF8String */
export class ErrorMessage extends WithDebug {
  static Codec = codec.Class(ErrorMessage, {
    message: codec.string,
  });

  static create({ message }: CodecRecord<ErrorMessage>): ErrorMessage {
    return new ErrorMessage(message);
  }

  private constructor(public readonly message: string) {
    super();
  }
}

/** Message choice type tags */
export enum MessageType {
  PeerInfo = 0,
  Initialize = 1,
  StateRoot = 2,
  ImportBlock = 3,
  GetState = 4,
  State = 5,
  Error = 255,
}

/** Message data union */
export type MessageData =
  | { type: MessageType.PeerInfo; value: PeerInfo }
  | { type: MessageType.Initialize; value: Initialize }
  | { type: MessageType.StateRoot; value: StateRoot }
  | { type: MessageType.ImportBlock; value: BlockView }
  | { type: MessageType.GetState; value: GetState }
  | { type: MessageType.State; value: KeyValue[] }
  | { type: MessageType.Error; value: ErrorMessage };

/**
 * Message ::= CHOICE {
 *     peer-info     [0] PeerInfo,
 *     initialize    [1] Initialize,
 *     state-root    [2] StateRoot,
 *     import-block  [3] ImportBlock,
 *     get-state     [4] GetState,
 *     state         [5] State,
 *     error         [255] Error
 * }
 */
export const messageCodec = codec.custom<MessageData>(
  {
    name: "Message",
    sizeHint: { bytes: 1, isExact: false },
  },
  (e, msg) => {
    e.i8(msg.type);
    switch (msg.type) {
      case MessageType.PeerInfo:
        PeerInfo.Codec.encode(e, msg.value);
        break;
      case MessageType.Initialize:
        Initialize.Codec.encode(e, msg.value);
        break;
      case MessageType.StateRoot:
        stateRootCodec.encode(e, msg.value);
        break;
      case MessageType.ImportBlock:
        Block.Codec.View.encode(e, msg.value);
        break;
      case MessageType.GetState:
        getStateCodec.encode(e, msg.value);
        break;
      case MessageType.State:
        stateCodec.encode(e, msg.value);
        break;
      case MessageType.Error:
        ErrorMessage.Codec.encode(e, msg.value);
        break;
      default:
        throw new Error(`Unknown message type: ${msg}`);
    }
  },
  (d): MessageData => {
    const type = d.u8();
    switch (type) {
      case MessageType.PeerInfo:
        return { type: MessageType.PeerInfo, value: PeerInfo.Codec.decode(d) };
      case MessageType.Initialize:
        return { type: MessageType.Initialize, value: Initialize.Codec.decode(d) };
      case MessageType.StateRoot:
        return { type: MessageType.StateRoot, value: stateRootCodec.decode(d) };
      case MessageType.ImportBlock:
        return { type: MessageType.ImportBlock, value: Block.Codec.View.decode(d) };
      case MessageType.GetState:
        return { type: MessageType.GetState, value: getStateCodec.decode(d) };
      case MessageType.State:
        return { type: MessageType.State, value: stateCodec.decode(d) };
      case MessageType.Error:
        return { type: MessageType.Error, value: ErrorMessage.Codec.decode(d) };
      default:
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/types.ts#L283-L324
title: packages/jam/fuzz-proto/v1/types.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 98852ae8548528cd711091132f2be239d1adf9cab06d62082d25c6868fe8a28c
language: typescript
---
`packages/jam/fuzz-proto/v1/types.ts` (lines 283–324)

```typescript
        return { type: MessageType.ImportBlock, value: Block.Codec.View.decode(d) };
      case MessageType.GetState:
        return { type: MessageType.GetState, value: getStateCodec.decode(d) };
      case MessageType.State:
        return { type: MessageType.State, value: stateCodec.decode(d) };
      case MessageType.Error:
        return { type: MessageType.Error, value: ErrorMessage.Codec.decode(d) };
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  },
  (s) => {
    const type = s.decoder.u8();
    switch (type) {
      case MessageType.PeerInfo:
        PeerInfo.Codec.View.skip(s);
        break;
      case MessageType.Initialize:
        Initialize.Codec.View.skip(s);
        break;
      case MessageType.StateRoot:
        stateRootCodec.View.skip(s);
        break;
      case MessageType.ImportBlock:
        Block.Codec.View.skip(s);
        break;
      case MessageType.GetState:
        getStateCodec.View.skip(s);
        break;
      case MessageType.State:
        stateCodec.View.skip(s);
        break;
      case MessageType.Error:
        ErrorMessage.Codec.View.skip(s);
        break;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }
  },
);

export type Message = MessageData;
```

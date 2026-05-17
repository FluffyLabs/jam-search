---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/types.ts#L283-L321
title: packages/jam/fuzz-proto/v1/types.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 2
chunk_total: 3
content_sha: f702c260b1092e0d3fa14612d016dec510d908c2743f955847b713ef1e5f91d3
language: typescript
---
`packages/jam/fuzz-proto/v1/types.ts` (lines 283–321)

```typescript
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

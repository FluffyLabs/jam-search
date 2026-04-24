---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/fuzz-proto/v1/handler.test.ts#L443-L455
title: packages/jam/fuzz-proto/v1/handler.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 4
chunk_total: 5
content_sha: 304076af647796099aa99e7d0798adad46f93224506cdee6e1829baebfa20f28
language: typescript
---
`packages/jam/fuzz-proto/v1/handler.test.ts` (lines 443–455)

```typescript
    mockMessageHandler.getPeerInfo.mock.mockImplementation(async () => responsePeerInfo);

    const handshakeMessage: Message = {
      type: MessageType.PeerInfo,
      value: inputPeerInfo,
    };

    const testMessage = encode(handshakeMessage);
    await target.onSocketMessage(testMessage);

    return target;
  }
});
```

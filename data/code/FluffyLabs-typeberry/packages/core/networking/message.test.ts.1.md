---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/message.test.ts#L115-L124
title: packages/core/networking/message.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 9646bd06562e9cbecb715a18fe97ce155b5d38755e5a6e02985c74cb10ac99b0
language: typescript
---
`packages/core/networking/message.test.ts` (lines 115–124)

```typescript
    const message1 = new Uint8Array(16 * 1024 * 1024 + 1);
    const lengthPrefix1 = new Uint8Array([0, 0, 0, 1]);
    const combinedFrame = new Uint8Array([...lengthPrefix1, ...message1]);

    handler(combinedFrame);

    assert.deepStrictEqual(receivedMessages, []);
    assert.strictEqual(overflowCalled, true);
  });
});
```

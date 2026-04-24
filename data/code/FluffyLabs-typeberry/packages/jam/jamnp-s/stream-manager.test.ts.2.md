---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/stream-manager.test.ts#L216-L248
title: packages/jam/jamnp-s/stream-manager.test.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-04-22T14:38:44+02:00'
last_modified: '2026-04-22T14:38:44+02:00'
chunk_index: 2
chunk_total: 3
content_sha: d12db058cc6a845096670bf0b8afd87f81546f612eedecf39b3c8f2ecc0c178a
language: typescript
---
`packages/jam/jamnp-s/stream-manager.test.ts` (lines 216–248)

```typescript
      assert.strictEqual(handler.closeCalls[0].isError, true);
    });
  });

  describe("lifecycle", () => {
    it("should wait for all streams to finish", async () => {
      const manager = new StreamManager();
      const peer = createDisconnectedPeer("1");
      const handler = createTestHandler(1 as StreamKind);
      manager.registerIncomingHandlers(handler);

      const stream1 = new TestManualStream(42);
      const stream2 = new TestManualStream(43);

      // Start handling both streams
      stream1._simulateIncomingData(new Uint8Array([1]));
      stream2._simulateIncomingData(new Uint8Array([1]));

      // Close streams immediately
      stream1._incomingData.close();
      stream2._incomingData.close();

      const handle1 = manager.onIncomingStream(peer, stream1);
      const handle2 = manager.onIncomingStream(peer, stream2);

      await Promise.all([handle1, handle2]);
      await manager.waitForFinish();

      // If we reach here, waitForFinish worked correctly
      assert.ok(true);
    });
  });
});
```

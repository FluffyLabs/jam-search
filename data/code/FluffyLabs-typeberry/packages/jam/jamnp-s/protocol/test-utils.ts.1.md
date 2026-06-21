---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/protocol/test-utils.ts#L125-L187
title: packages/jam/jamnp-s/protocol/test-utils.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: 63593033cf2cbbd0c9b908b526b729485f2a33ca6c4cb4366f4c127d171af45d
language: typescript
---
`packages/jam/jamnp-s/protocol/test-utils.ts` (lines 125–187)

```typescript
  receiveStreamClose(id: StreamId) {
    const stream = this.openStreams.get(id);
    if (stream === undefined) {
      return;
    }
    this.openStreams.delete(id);
    stream[0].onClose(id, false);
  }

  private createStreamIfNotPresent(streamId: StreamId, kind: StreamKind): [StreamHandler, StreamMessageSender] {
    const existing = this.openStreams.get(streamId);
    if (existing !== undefined) {
      // stream is already open, so we don't do anything.
      return existing;
    }

    const handler = this.registeredHandlers.get(kind);
    if (handler === undefined) {
      throw new Error(`Attempting to open stream with unregistered handler: ${kind}`);
    }

    const stream = this.newStream(streamId, kind, () => {
      setTimeout(() => {
        this.openStreams.delete(streamId);
        handler.onClose(streamId, false);
      }, SIMULATED_STREAM_TIMEOUT_MS);
    });
    this.openStreams.set(streamId, [handler, stream]);

    return [handler, stream];
  }
}

export function testClientServer() {
  const newStream = (other: TestMessageHandler, id: StreamId, onClose: () => void): TestStreamSender => {
    return new TestStreamSender(id, {
      onSend: (data) => other.streamReceive(id, data),
      onClose: () => {
        // close the stream on our end
        onClose();
        // notify the other end about stream closing.
        other.receiveStreamClose(id);
      },
    });
  };
  const client = new TestMessageHandler((id, kind, onClose): TestStreamSender => {
    setImmediate(() => {
      server.receiveStreamOpen(id, kind);
    });
    return newStream(server, id, onClose);
  });
  const server = new TestMessageHandler((id, kind, onClose): TestStreamSender => {
    setImmediate(() => {
      client.receiveStreamOpen(id, kind);
    });
    return newStream(client, id, onClose);
  });

  return {
    client,
    server,
  };
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api-node/port.ts#L123-L163
title: packages/workers/api-node/port.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 1
chunk_total: 2
content_sha: a9bbf4fc0246ec0adc2bd0a9f223acb36d8cae424852fef74a1077a13e99853c
language: typescript
---
`packages/workers/api-node/port.ts` (lines 123–163)

```typescript
      eventName: event,
      responseId: msg.responseId,
      data: encoded.raw,
    };
    // casting to transferable is safe here, since we know that encoder
    // always returns owned uint8arrays.
    this.port.postMessage(message, [encoded.raw.buffer as unknown as Transferable]);
  }

  private queuePending(msg: Message) {
    const pending = this.pendingMessages.get(msg.eventName) ?? [];
    pending.push(msg);
    this.pendingMessages.set(msg.eventName, pending);
  }

  private flushPending(event: string, listener: (responseId: string, data: Uint8Array) => void) {
    const pending = this.pendingMessages.get(event);
    if (pending === undefined) {
      return;
    }
    this.pendingMessages.delete(event);
    for (const msg of pending) {
      listener(msg.responseId, msg.data);
    }
  }
}

function isMessage(data: unknown): data is Message {
  const isObject = data !== null && typeof data === "object";
  if (!isObject) {
    return false;
  }

  for (const k of MESSAGE_KEYS) {
    if (!(k in data)) {
      return false;
    }
  }

  return true;
}
```

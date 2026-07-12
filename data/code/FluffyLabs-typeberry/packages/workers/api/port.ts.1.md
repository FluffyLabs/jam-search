---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/port.ts#L129-L157
title: packages/workers/api/port.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-11T19:25:25+02:00'
last_modified: '2026-07-11T19:25:25+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 7b560c06d86187286792a978b8d72ce2996032ff2b78e895037b54001971efdc
language: typescript
---
`packages/workers/api/port.ts` (lines 129–157)

```typescript
    const pending = this.outbound.pendingMessages.get(event) ?? [];
    pending.push(msg);
    this.outbound.pendingMessages.set(event, pending);
  }

  private flushPending(event: string, trigger: (args: unknown) => void) {
    const pending = this.inbound.pendingMessages.get(event);
    if (pending === undefined) {
      return;
    }
    this.inbound.pendingMessages.delete(event);
    for (const msg of pending) {
      trigger(msg);
    }
  }

  private closeState(state: PortState) {
    state.events.emit("error", new Error("closing channel"));
    state.events.removeAllListeners();
    state.pendingMessages.clear();
  }
}

function createPortState(): PortState {
  return {
    events: new EventEmitter(),
    pendingMessages: new Map<string, Envelope<unknown>[]>(),
  };
}
```

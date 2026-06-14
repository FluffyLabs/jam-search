---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/listener/index.ts#L1-L49
title: packages/core/listener/index.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 051e049d51fe5ef60078e25f5bf7888e8b32cf9eeb7338a5107ade720854d9c7
language: typescript
---
`packages/core/listener/index.ts` (lines 1–49)

```typescript
import { EventEmitter } from "node:events";

const EVENT = Symbol();
const EVENT_DONE = Symbol();

/** A typed version of event emitter. */
export class Listener<T> {
  private readonly emitter = new EventEmitter();

  emit(data: T) {
    this.emitter.emit(EVENT, data);
  }

  on(listener: (d: T) => void) {
    this.emitter.on(EVENT, listener);
    return this;
  }

  off(listener: (d: T) => void) {
    this.emitter.off(EVENT, listener);
    return this;
  }

  once(listener: (d: T) => void) {
    this.emitter.once(EVENT, listener);
    return this;
  }

  onceDone(listener: () => void) {
    this.emitter.once(EVENT_DONE, listener);
    return this;
  }

  markDone() {
    this.emitter.emit(EVENT_DONE);
    this.emitter.removeAllListeners(EVENT);
    this.emitter.removeAllListeners(EVENT_DONE);
  }

  /** Return a callback that will emit events. */
  callbackHandler(): (req: T) => Promise<void> {
    return async (req) => {
      // to avoid deadlocks and since we don't care about that signal,
      // we simply return the response immediately and process the emitting
      // later
      setImmediate(() => this.emit(req));
    };
  }
}
```

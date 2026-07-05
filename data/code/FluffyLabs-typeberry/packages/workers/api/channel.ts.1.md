---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/workers/api/channel.ts#L112-L143
title: packages/workers/api/channel.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-07-03T23:06:13+02:00'
last_modified: '2026-07-03T23:06:13+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 9b648f41fae8202dab3e2239bc01609f23abe04d19b29101914861a018e29372
language: typescript
---
`packages/workers/api/channel.ts` (lines 112–143)

```typescript
        // attach response listener first
        this.port.once(responseId, val.response, (msg) => {
          // we got response, so will resolve
          this.pendingPromises.delete(reject);

          resolve(msg.data);
        });

        // send message to the port
        this.port.postMessage(key, val.request, {
          responseId,
          data,
        });
      });
    };
  }

  destroy() {
    this.port.close();
  }
}

function capitalize<T extends string>(k: T): Capitalize<T> {
  if (k.length === 0) {
    return k as Capitalize<T>;
  }
  return (k.charAt(0).toUpperCase() + k.slice(1)) as Capitalize<T>;
}

function isMessageCodecs(val: unknown): val is MessageCodecs<unknown, unknown> {
  return val !== null && typeof val === "object" && "request" in val && "response" in val;
}
```

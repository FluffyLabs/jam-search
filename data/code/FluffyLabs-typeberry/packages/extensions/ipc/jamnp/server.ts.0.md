---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/extensions/ipc/jamnp/server.ts#L1-L46
title: packages/extensions/ipc/jamnp/server.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-24T13:20:40Z'
last_modified: '2026-06-24T13:20:40Z'
chunk_index: 0
chunk_total: 1
content_sha: 01dedc5e0869201007d0119a1a53824dcf77ccf5c93ef53a5a273952b02c3784
language: typescript
---
`packages/extensions/ipc/jamnp/server.ts` (lines 1–46)

```typescript
import type { HeaderHash } from "@typeberry/block";
import type { ChainSpec } from "@typeberry/config";
import { ce129, up0 } from "@typeberry/jamnp-s";
import type { Listener } from "@typeberry/listener";
import type { TrieNode } from "@typeberry/trie/nodes.js";
import { startIpcServer } from "../server.js";
import { JamnpIpcHandler } from "./handler.js";

/** An IPC endpoint exposing network-like messaging protocol. */
export function startJamnpIpcServer(
  nodeName: string,
  chainSpec: ChainSpec,
  announcements: Listener<up0.Announcement>,
  getHandshake: () => up0.Handshake,
  getBoundaryNodes: (hash: HeaderHash, startKey: ce129.Key, endKey: ce129.Key) => TrieNode[],
  getKeyValuePairs: (hash: HeaderHash, startKey: ce129.Key, endKey: ce129.Key) => ce129.KeyValuePair[],
) {
  return startIpcServer(`typeberry-jamnp-${nodeName}`, (sender) => {
    const handler = JamnpIpcHandler.new(sender);
    // Send block announcements
    const listener = (announcement: unknown) => {
      if (announcement instanceof up0.Announcement) {
        handler.withStreamOfKind(up0.STREAM_KIND, (handler: up0.Handler, sender) => {
          handler.sendAnnouncement(sender, announcement);
        });
      } else {
        throw new Error(`Invalid annoncement received: ${announcement}`);
      }
    };
    announcements.on(listener);
    handler.waitForEnd().finally(() => {
      announcements.off(listener);
    });

    handler.registerStreamHandlers(
      up0.Handler.new(
        chainSpec,
        getHandshake,
        () => {},
        () => {},
      ),
    );
    handler.registerStreamHandlers(ce129.Handler.new(true, getBoundaryNodes, getKeyValuePairs));
    return handler;
  });
}
```

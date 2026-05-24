---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/setup.ts#L200-L213
title: packages/core/networking/setup.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-24T08:09:48+02:00'
last_modified: '2026-05-24T08:09:48+02:00'
chunk_index: 2
chunk_total: 3
content_sha: 0b3718c9d625a82fa32848fb3545cbd12d08f64e0d9b60efec51c6d909de3fa9
language: typescript
---
`packages/core/networking/setup.ts` (lines 200–213)

```typescript
      const connectionStartTime = now();
      addEventListener(peer.conn, events.EventQUICConnectionClose, (ev) => {
        const duration = now() - connectionStartTime;
        const reason = String(ev.detail) ?? "normal";
        networkMetrics.recordDisconnected(peer.id, side, reason, duration);
        peers.peerDisconnected(peer);
      });
      peers.peerConnected(peer);
      return peer;
    }

    return QuicNetwork.new(socket, server, dial, peers, { host, port });
  }
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/peers.ts#L109-L159
title: packages/core/networking/peers.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-02T00:04:19+02:00'
last_modified: '2026-06-02T00:04:19+02:00'
chunk_index: 1
chunk_total: 2
content_sha: 7c9d6689816e22215dc616d181c95c32edbf0454c229316861b8a0e55ba1e7d5
language: typescript
---
`packages/core/networking/peers.ts` (lines 109–159)

```typescript
  private readonly peers: Map<PeerId, Peer> = new Map();

  peerConnected(peer: T) {
    logger.info`💡 Peer ${displayId(peer)} connected.`;
    const oldPeerData = this.peers.get(peer.id);
    if (oldPeerData !== undefined) {
      // TODO [ToDr] replacing old connection?
      logger.warn`Replacing older connection.`;
    }
    this.peers.set(peer.id, peer);
    for (const callback of this._onPeerConnected) {
      callback(peer);
    }
  }

  peerDisconnected(peer: T) {
    logger.info`⚡︎Peer ${displayId(peer)} disconnected.`;
    this.peers.delete(peer.id);
    for (const callback of this._onPeerDisconnected) {
      callback(peer);
    }
  }

  isConnected(id: PeerId) {
    return this.peers.has(id);
  }

  noOfConnectedPeers() {
    return this.peers.size;
  }

  onPeerConnected(cb: PeerCallback<T>) {
    this._onPeerConnected.push(cb);
    return () => {
      const idx = this._onPeerConnected.indexOf(cb);
      if (idx !== -1) {
        this._onPeerConnected.splice(idx, 1);
      }
    };
  }

  onPeerDisconnected(cb: PeerCallback<T>) {
    this._onPeerDisconnected.push(cb);
    return () => {
      const idx = this._onPeerDisconnected.indexOf(cb);
      if (idx !== -1) {
        this._onPeerDisconnected.splice(idx, 1);
      }
    };
  }
}
```

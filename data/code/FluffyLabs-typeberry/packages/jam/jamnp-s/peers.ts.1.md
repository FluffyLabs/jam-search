---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/peers.ts#L125-L213
title: packages/jam/jamnp-s/peers.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 1
chunk_total: 2
content_sha: 0e51773fafb1dae95e5286b19e918b1a5c8f83088a4f0b7e326cbdfbb8cd2148
language: typescript
---
`packages/jam/jamnp-s/peers.ts` (lines 125–213)

```typescript
    // just ignore peers we don't know about.
    if (meta === undefined) {
      return;
    }
    if (markAsDisconnected) {
      // abort any existing reconnect task
      meta.backgroundTask.abort();
      // mark the peer as disconnected
      meta.peerRef = null;
      meta.backgroundTask = new AbortController();
    }
    // abort signal
    const signal = meta.backgroundTask.signal;

    // now keep trying to connect
    for (;;) {
      // increase the reconnection counter
      meta.currentRetry += 1;
      if (meta.currentRetry > meta.maxRetries) {
        // reached max retries for a peer, remove it from tracking.
        this.peerInfo.delete(id);
        logger.log`[${id}] max retries reached. Removing peer.`;
        return;
      }
      // else attempt to connect to a node a bit later.
      const timeoutSeconds = Math.min(
        MIN_RECONNECT_TIMEOUT_S * meta.currentRetry * meta.currentRetry,
        MAX_RECONNECT_TIMEOUT_S,
      );
      try {
        await setTimeout(timeoutSeconds * 1000, undefined, { signal });
      } catch {
        // ignoring errors here, since that's expected. We just wanted to
        // abort the task.
        return;
      }

      // seems we are already connected, bailing
      if (meta.peerRef !== null) {
        return;
      }

      // also check via network.peers to handle race with incoming connections
      if (this.network.peers.isConnected(id)) {
        return;
      }

      // attempt to connect to the peer
      try {
        logger.trace`[${id}] Attempting to connect to peer at ${meta.address.host}:${meta.address.port}.`;
        await this.network.dial(meta.address, { signal, verifyName: meta.peerId });
        return;
      } catch (e) {
        if (signal.aborted) {
          return;
        }
        // check if we got connected via incoming connection while dialing
        if (this.network.peers.isConnected(id)) {
          return;
        }
        // failing to connect, will retry.
        logger.trace`[${id}] Failure reason: ${e}`;
        logger.trace`[${id}] attempt failed. Will retry (${meta.currentRetry}/${meta.maxRetries})`;
      }
    }
  }

  /**
   * Add a list of peers that we should keep a consistent connection.
   *
   * That means we are going to be dialing them indefinitely (with
   * an exponential back-off though if they are unavailable).
   */
  addPersistentRetry(bootnodes: Bootnode[]) {
    for (const node of bootnodes) {
      this.peerInfo.set(node.id, {
        peerId: node.id,
        address: { host: node.host, port: node.port },
        maxRetries: 2 ** 32,
        currentRetry: 0,
        peerRef: null,
        lastConnected: 0,
        backgroundTask: new AbortController(),
        aux: new Map(),
      });
      this.scheduleReconnect(node.id);
    }
  }
}
```

---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/jamnp-s/peers.ts#L1-L131
title: packages/jam/jamnp-s/peers.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-30T08:29:37+02:00'
last_modified: '2026-05-30T08:29:37+02:00'
chunk_index: 0
chunk_total: 2
content_sha: d9564af39fa3bcc7fe6b42eea2a9b473c9a686ffc84e9f7b7fb6c0a5babc307f
language: typescript
---
`packages/jam/jamnp-s/peers.ts` (lines 1–131)

```typescript
import { setTimeout } from "node:timers/promises";
import type { Bootnode } from "@typeberry/config";
import { Logger } from "@typeberry/logger";
import type { Network, Peer, PeerAddress, PeerId } from "@typeberry/networking";
import { OK } from "@typeberry/utils";

export { Bootnode } from "@typeberry/config";

type PeerInfo = {
  peerId: PeerId;
  address: PeerAddress;

  /** If `Peer` is set, it means it's connected. */
  peerRef: Peer | null;
  lastConnected: number;
  maxRetries: number;
  currentRetry: number;

  backgroundTask: AbortController;

  aux: Map<AuxData<unknown>["id"], unknown>;
};

export type AuxData<T> = {
  id: symbol;
  unused?: T;
};

const logger = Logger.new(import.meta.filename, "net:conn");

/** Number of attempts to re-connect to non-bootnode peers. */
const MAX_RETRIES = 5;
/** Minimal reconnection time in seconds. */
const MIN_RECONNECT_TIMEOUT_S = 3;
/** Maximal reconnection time in seconds. */
const MAX_RECONNECT_TIMEOUT_S = 3_600;

/**
 * Manage current and past connections to peers.
 *
 * Note this collection is wider in scope than just `Peers`.
 * We not only track info about currently connected peers, but we also
 * have a record of peers that we were connected to earlier, to allow
 * tracking their behavior (score) or reconnecting in the future.
 */
export class Connections {
  /** Info about peers that are currently connected or where connected in the past. */
  private readonly peerInfo: Map<PeerId, PeerInfo> = new Map();

  static new(network: Network<Peer>) {
    return new Connections(network);
  }

  private constructor(private readonly network: Network<Peer>) {
    network.peers.onPeerConnected((peer) => {
      this.updatePeer(peer);
      return OK;
    });
    network.peers.onPeerDisconnected((peer) => {
      this.scheduleReconnect(peer.id, true);
      return OK;
    });
  }

  /** Attach some external typed data to given peer. */
  setAuxData<T>(peer: PeerId, id: AuxData<T>, data: T) {
    this.peerInfo.get(peer)?.aux.set(id.id, data);
  }

  /** Read some externally-attached data about the peer. */
  getAuxData<T>(peer: PeerId, id: AuxData<T>): T | undefined {
    return this.peerInfo.get(peer)?.aux.get(id.id) as T | undefined;
  }

  /** Read, act and update the aux data of some peer. */
  withAuxData<T>(peer: PeerId, id: AuxData<T>, onAux: (aux: T | undefined) => T) {
    const auxData = this.getAuxData(peer, id);
    const newAuxData = onAux(auxData);
    this.setAuxData(peer, id, newAuxData);
  }

  /** Return the number of currently connected peers. */
  getPeerCount() {
    return this.network.peers.noOfConnectedPeers();
  }

  /** Return peers that are currently connected. */
  *getConnectedPeers() {
    for (const peer of this.peerInfo.values()) {
      if (peer.peerRef !== null) {
        yield peer;
      }
    }
  }

  /** Register metadata about newly connected peer. */
  private updatePeer(peer: Peer) {
    // let's check if we know something about that peer already.
    const meta = this.peerInfo.get(peer.id);
    if (meta === undefined) {
      this.peerInfo.set(peer.id, {
        peerId: peer.id,
        address: peer.address,
        peerRef: peer,
        lastConnected: Date.now(),
        maxRetries: MAX_RETRIES,
        currentRetry: 0,
        backgroundTask: new AbortController(),
        aux: new Map(),
      });
      return;
    }

    // set the peer as connected just now
    meta.peerRef = peer;
    meta.lastConnected = Date.now();
    meta.currentRetry = Math.floor(meta.currentRetry / 2);
    // update it's address?
    meta.address = peer.address;
  }

  /** Attempt to scheduled a reconnect for a peer that just got disconnected. */
  private async scheduleReconnect(id: PeerId, markAsDisconnected = false) {
    const meta = this.peerInfo.get(id);
    // just ignore peers we don't know about.
    if (meta === undefined) {
      return;
    }
    if (markAsDisconnected) {
      // abort any existing reconnect task
      meta.backgroundTask.abort();
```

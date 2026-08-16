---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/quic-network.ts#L1-L65
title: packages/core/networking/quic-network.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-08-14T15:27:42+02:00'
last_modified: '2026-08-14T15:27:42+02:00'
chunk_index: 0
chunk_total: 1
content_sha: 64833a679f943a18ad0b5f0a272ba159515841b7bb21e2ca40c52a180ea387c8
language: typescript
---
`packages/core/networking/quic-network.ts` (lines 1–65)

```typescript
import type { QUICServer, QUICSocket } from "@matrixai/quic";
import { Logger } from "@typeberry/logger";
import type { DialOptions, Network } from "./network.js";
import type { PeerAddress, Peers, PeersManagement } from "./peers.js";
import type { QuicPeer } from "./quic-peer.js";

const logger = Logger.new(import.meta.filename, "net");

export class QuicNetwork implements Network<QuicPeer> {
  private started = false;

  static new(
    socket: QUICSocket,
    server: QUICServer,
    _dial: (peer: PeerAddress, options: DialOptions) => Promise<QuicPeer>,
    _peers: PeersManagement<QuicPeer>,
    listen: { host: string; port: number },
  ) {
    return new QuicNetwork(socket, server, _dial, _peers, listen);
  }

  private constructor(
    private readonly socket: QUICSocket,
    private readonly server: QUICServer,
    private readonly _dial: (peer: PeerAddress, options: DialOptions) => Promise<QuicPeer>,
    private readonly _peers: PeersManagement<QuicPeer>,
    private readonly listen: { host: string; port: number },
  ) {}

  get isRunning() {
    return this.started;
  }

  async start() {
    if (this.started) {
      throw new Error("Network already started!");
    }

    this.started = true;
    await this.socket.start({ host: this.listen.host, port: this.listen.port });
    logger.info`🛜  QUIC socket on ${this.socket.host}:${this.socket.port}`;
    await this.server.start();
    logger.log`🛜  QUIC server listening`;
  }

  async stop() {
    if (!this.started) {
      throw new Error("Network not started yet!");
    }

    logger.info`Stopping the networking.`;
    await this.server.stop();
    await this.socket.stop();
    this.started = false;
    logger.info`Networking stopped.`;
  }

  get peers(): Peers<QuicPeer> {
    return this._peers;
  }

  async dial(peer: PeerAddress, options: DialOptions = {}): Promise<QuicPeer> {
    return this._dial(peer, options);
  }
}
```

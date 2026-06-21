---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/testing.ts#L134-L245
title: packages/core/networking/testing.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-15T16:53:45Z'
last_modified: '2026-06-15T16:53:45Z'
chunk_index: 1
chunk_total: 2
content_sha: 215a2367ebf335a76d331a9f6c3a8cc26efd33f554ac569aa575a10c5455587a
language: typescript
---
`packages/core/networking/testing.ts` (lines 134–245)

```typescript
    const streamId = this._streamId++;
    const [txStream, rxStream] = TestDuplexStream.pair(streamId);
    logger.log`[peer:${this.id}] --> [peer:${this._otherPeer?.id}] opening streams ${txStream.streamId} -> ${rxStream.streamId}`;
    // Allow the "virtual" connection to be full estabilished,
    // before triggering the callbacks. We currently assume
    // this happens synchronously, but if that causes issues
    // we may also trigger that manually.
    setImmediate(() => {
      for (const cb of this._otherPeer?._onIncomingStreams ?? []) {
        cb(rxStream);
      }
    });
    return txStream;
  }

  async disconnect(): Promise<void> {}
}

export class TestPeerDisconnected implements Peer {
  _streamId = 0;

  private readonly _onIncomingStreams: StreamCallback[] = [];
  readonly _openedStreams: TestManualStream[] = [];
  _disconnectCalled = false;

  constructor(
    public readonly connectionId: string,
    public readonly address: PeerAddress,
    public readonly id: PeerId,
    public readonly key: Ed25519Key,
  ) {}

  addOnIncomingStream(streamCallback: StreamCallback): void {
    this._onIncomingStreams.push(streamCallback);
  }

  openStream(): Stream {
    const stream = new TestManualStream(this._streamId++);
    this._openedStreams.push(stream);
    return stream;
  }

  async disconnect(): Promise<void> {
    this._disconnectCalled = true;
  }
}

/**
 * Create a standalone test peer, that allows fine-grained control over the received
 * and sent data.
 */
export function createDisconnectedPeer(id: string, host = "127.0.0.1", port = 8080): TestPeerDisconnected {
  return new TestPeerDisconnected(
    `conn-${id}`,
    { host, port },
    asOpaqueType(id),
    Bytes.zero(ED25519_KEY_BYTES).asOpaque(),
  );
}

/**
 * Creates two peer objects that are interconnected - sending data
 * over `writable` of one peer, will cause it to be receied on
 * `readable` on the other peer and vice-versa.
 */
export function createTestPeerPair(streamIdx: number, id1: string, id2: string) {
  const host = "127.0.0.1";
  const port = 8080;
  const key = Bytes.zero(ED25519_KEY_BYTES).asOpaque();

  return TestPeer.pairUp(
    new TestPeer(streamIdx, `conn-${id1}-${id2}`, { host, port }, asOpaqueType(id1), key),
    new TestPeer(streamIdx + 10_000, `conn-${id1}-${id2}`, { host, port }, asOpaqueType(id2), key),
  );
}

/**
 * Mock Network implementation for testing
 * Provides controlled peer connection/disconnection simulation
 */
export class MockNetwork implements Network<Peer> {
  public readonly _peers: PeersManagement<Peer> = new PeersManagement();

  constructor(public readonly name: string) {
    this.peers.onPeerConnected((peer) => {
      logger.log`(network: ${this.name}) New peer connected: ${peer.id}.`;
      return OK;
    });
    this.peers.onPeerDisconnected((peer) => {
      logger.log`(network: ${this.name}) Peer disconnected: ${peer.id}.`;
      return OK;
    });
  }

  get peers() {
    return this._peers;
  }

  async start(): Promise<void> {
    // Mock implementation
  }

  async stop(): Promise<void> {
    // Mock implementation
  }

  async dial(address: PeerAddress, _options: DialOptions): Promise<Peer> {
    const peer = createDisconnectedPeer(address.host);
    this._peers.peerConnected(peer);
    return peer;
  }
}
```

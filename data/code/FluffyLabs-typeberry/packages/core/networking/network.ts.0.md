---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/core/networking/network.ts#L1-L24
title: packages/core/networking/network.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-05-15T16:05:10Z'
last_modified: '2026-05-15T16:05:10Z'
chunk_index: 0
chunk_total: 1
content_sha: 73494e9aed96dd52acfb0e71f5384721616b61f197fba27e0b7188246c9e6e39
language: typescript
---
`packages/core/networking/network.ts` (lines 1–24)

```typescript
import type { Peer, PeerAddress, Peers } from "./peers.js";

/** Peer dialing options. */
export type DialOptions = {
  /** Verify the expected peer name after connection. */
  verifyName?: string;
  /** Abort connection on demand. */
  signal?: AbortSignal;
};

/** Networking abstraction. */
export interface Network<T extends Peer> {
  /** Peers management. */
  peers: Peers<T>;

  /** Start networking interface. */
  start(): Promise<void>;

  /** Stop networking interface and terminate existing connections. */
  stop(): Promise<void>;

  /** Initiate a new connection to some peer. */
  dial(address: PeerAddress, options: DialOptions): Promise<T>;
}
```

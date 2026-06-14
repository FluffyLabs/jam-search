---
type: page
content_kind: code
url: >-
  https://github.com/FluffyLabs/typeberry/blob/main/packages/jam/config/network.ts#L1-L36
title: packages/jam/config/network.ts
site: github.com/FluffyLabs/typeberry
created_at: '2026-06-12T09:50:25Z'
last_modified: '2026-06-12T09:50:25Z'
chunk_index: 0
chunk_total: 1
content_sha: 65d8afff0f146ad877de0f15cd07fb1f8ede4dc09f716a495c6797ec4eecdad4
language: typescript
---
`packages/jam/config/network.ts` (lines 1–36)

```typescript
import type { Opaque } from "@typeberry/utils";

/** Peer id. */
export type PeerId = Opaque<string, "peerId">;

/** Peer connection details. */
export type PeerAddress = {
  /** IPV4 peer address */
  host: string;
  /** port number */
  port: number;
};

/** Bootnode class represents a single contact point in the network */
export class Bootnode implements PeerAddress {
  static new(id: PeerId, ip: string, port: number) {
    return new Bootnode(id, ip, port);
  }

  private constructor(
    /** Network address derived from the node's cryptographic public key (always 53-character?) */
    readonly id: PeerId,
    /** IP address (either IPv4 or IPv6) of the bootnode */
    readonly ip: string,
    /** Port number on which the bootnode is listening for new connections */
    readonly port: number,
  ) {}

  get host() {
    return this.ip;
  }

  toString() {
    return `${this.id}@${this.ip}:${this.port}`;
  }
}
```
